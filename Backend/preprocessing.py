import re
import numpy as np

class LiveFeatureExtractor:
    def __init__(self):
        self.patterns = {
            'fillers': re.compile(r'&-([a-z]+)', re.IGNORECASE),
            'repetition': re.compile(r'\[/+\]'),
            'retracing': re.compile(r'\[//\]'),
            'incomplete': re.compile(r'\+[\./]+'),
            'errors': re.compile(r'\[\*.*?\]'),
            'pauses': re.compile(r'\(\.+\)')
        }

    def clean_for_bert(self, raw_text):
        text = re.sub(r'^\*PAR:\s+', '', raw_text)
        text = re.sub(r'\x15\d+_\d+\x15', '', text)
        text = re.sub(r'<|>', '', text)
        text = re.sub(r'\[.*?\]', '', text)
        text = re.sub(r'\(\.+\)', '[PAUSE]', text) 
        text = text.replace('_', ' ')
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def get_features(self, raw_text):
        stats = {k: len(p.findall(raw_text)) for k, p in self.patterns.items()}
        clean_for_stats = re.sub(r'\[.*?\]', '', raw_text)
        clean_for_stats = re.sub(r'&-([a-z]+)', '', clean_for_stats)
        clean_for_stats = re.sub(r'[^\w\s]', '', clean_for_stats)
        words = clean_for_stats.lower().split()
        stats['word_count'] = len(words)
        return stats

    def get_vector(self, raw_text, global_ttr_override=None):
        stats = self.get_features(raw_text)
        n = stats['word_count'] if stats['word_count'] > 0 else 1
        
        if global_ttr_override is not None:
            ttr = global_ttr_override
        else:
            clean_for_stats = re.sub(r'\[.*?\]', '', raw_text)
            clean_for_stats = re.sub(r'&-([a-z]+)', '', clean_for_stats)
            clean_for_stats = re.sub(r'[^\w\s]', '', clean_for_stats)
            words = clean_for_stats.lower().split()
            ttr = (len(set(words)) / n) if n > 0 else 0.0

        return [
            ttr,
            stats['fillers']/n,
            stats['repetition']/n,
            stats['retracing']/n,
            stats['errors']/n,
            stats['pauses']/n
        ]

class ChaParser:
    def __init__(self):
        self.extractor = LiveFeatureExtractor()
    
    def parse(self, file_content_lines):
        sentences = []
        features = []
        raw_lines = []
        all_words_in_session = []
        
        decoded_lines = [line.decode('utf-8') if isinstance(line, bytes) else line for line in file_content_lines]

        for line in decoded_lines:
            if line.startswith('*PAR:'):
                clean_line = re.sub(r'[^\w\s]', '', line.replace('*PAR:', ''))
                words = clean_line.lower().split()
                all_words_in_session.extend(words)

        unique_words = len(set(all_words_in_session))
        total_words = len(all_words_in_session)
        global_ttr = unique_words / total_words if total_words > 0 else 0.0
        
        for line in decoded_lines:
            if line.startswith('*PAR:'):
                display_text = self.extractor.clean_for_bert(line)
                feat_vec = self.extractor.get_vector(line, global_ttr_override=global_ttr)
                
                sentences.append(display_text)
                features.append(feat_vec)
                raw_lines.append(line.strip())
                    
        return sentences, features, raw_lines