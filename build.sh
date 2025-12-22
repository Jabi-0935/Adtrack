#!/usr/bin/env bash
set -e

pip install -r Backend/requirements.txt

FILE_ID="1KZvendw8dVApmymgSSCSjPSrgZuDwJQP"
COOKIE_FILE="./cookie.txt"
HTML_FILE="./gdrive.html"

curl -c $COOKIE_FILE -s -L "https://drive.google.com/uc?export=download&id=${FILE_ID}" -o $HTML_FILE
CONFIRM=$(sed -n 's/.*confirm=\([0-9A-Za-z_]*\).*/\1/p' $HTML_FILE)

curl -Lb $COOKIE_FILE "https://drive.google.com/uc?export=download&confirm=${CONFIRM}&id=${FILE_ID}" \
    -o Backend/best_alzheimer_model.pth
