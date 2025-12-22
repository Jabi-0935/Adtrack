import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel

class GatedFeatureFusion(nn.Module):
    def __init__(self, embed_dim, feature_dim):
        super().__init__()
        self.feat_proj = nn.Linear(feature_dim, embed_dim)
        self.gate = nn.Sequential(
            nn.Linear(embed_dim * 2, embed_dim),
            nn.Sigmoid()
        )
        self.norm = nn.LayerNorm(embed_dim)

    def forward(self, text_embeds, raw_features):
        feat_embeds = F.relu(self.feat_proj(raw_features))
        combined = torch.cat([text_embeds, feat_embeds], dim=2)
        z = self.gate(combined)
        fused = z * text_embeds + (1 - z) * feat_embeds
        return self.norm(fused)

class ResearchHybridModel(nn.Module):
    def __init__(self, model_name='microsoft/deberta-base', feature_dim=6):
        super().__init__()
        self.bert = AutoModel.from_pretrained(model_name)
        self.bert_hidden = 768
        
        self.fusion = GatedFeatureFusion(self.bert_hidden, feature_dim)
        
        self.lstm = nn.LSTM(
            input_size=self.bert_hidden, 
            hidden_size=256,
            num_layers=2,
            batch_first=True,
            bidirectional=True,
            dropout=0.3
        )
        
        self.attention = nn.Sequential(
            nn.Linear(512, 128),
            nn.Tanh(),
            nn.Linear(128, 1)
        )
        
        self.classifier = nn.Sequential(
            nn.Linear(512, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(128, 2)
        )
        
    def forward(self, input_ids, attention_mask, linguistic_features, lengths):
        batch_size, seq_len, word_len = input_ids.shape
        flat_input = input_ids.view(-1, word_len)
        flat_mask = attention_mask.view(-1, word_len)
        bert_out = self.bert(flat_input, attention_mask=flat_mask).last_hidden_state
        sent_embeds = bert_out[:, 0, :].view(batch_size, seq_len, -1)
        
        fused = self.fusion(sent_embeds, linguistic_features)
        
        packed = torch.nn.utils.rnn.pack_padded_sequence(fused, lengths.cpu(), batch_first=True, enforce_sorted=False)
        packed_out, _ = self.lstm(packed)
        lstm_out, _ = torch.nn.utils.rnn.pad_packed_sequence(packed_out, batch_first=True, total_length=seq_len)
        
        attn_scores = self.attention(lstm_out)
        mask = (torch.arange(seq_len, device=input_ids.device)[None, :] < lengths.to(input_ids.device)[:, None]).float().unsqueeze(2)
        attn_scores = attn_scores.masked_fill(mask == 0, -1e9)
        attn_weights = F.softmax(attn_scores, dim=1)
        
        context = torch.sum(lstm_out * attn_weights, dim=1)
        return self.classifier(context), attn_weights.squeeze()