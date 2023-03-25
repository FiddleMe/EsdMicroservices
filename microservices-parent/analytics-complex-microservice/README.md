1. First, in VS Code Terminal, change directory to .../microservices-parent/analytics-complex-microservice.

2. Then, execute:
    python3 -m pip install --no-cache-dir -r requirements.txt

3. After this, execute:
    python3 nltk_download.py
   This will download all the nltk packages that you need.
   If you already have these packages, you can skip this step.

4. Now execute:
    python3 analytics.py

5. To test the microservice, use all of the following links:
    127.0.0.1:5010/analytics/pos_neg_percent
    127.0.0.1:5010/analytics/top_menu_items
    127.0.0.1:5010/analytics/mode_of_eating
    127.0.0.1:5010/analytics/top_words
   In all of them, a JSON with code value of 200 should appear in the browser.