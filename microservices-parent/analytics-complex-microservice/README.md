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

Analytics microservice example outputs:
127.0.0.1:5010/analytics/top_words, method='GET'
returns the 5 most common positive and 5 most common negative words in json format
{
"code": 200,
"data": {
"most common negative words": [
[
"i",
2
],
[
"food",
2
],
[
"like",
1
],
[
"much",
1
],
[
"meh",
1
]
],
"most common positive words": [
[
"good",
6
],
[
"food",
5
],
[
"the",
3
],
[
"i",
3
],
[
"service",
2
]
]
}
}

127.0.0.1:5010/analytics/pos_neg_percent, method='GET'
returns percentages of positive and negative feedback in json format
{
"code": 200,
"data": {
"feedback_percentages": {
"negative feedback": "20.00%",
"positive feedback": "80.00%"
}
}
}

127.0.0.1:5010/analytics/top_menu_items, method='GET'
returns top 5 menu items based on total orders in json format
{
"code": 200,
"data": [
"jangmeyon",
"tteakbokki",
"chicken",
"beef",
"kimchi",
]
}

127.0.0.1:5010/analytics/mode_of_eating, method='GET'
returns percentage of different modes of eating in json format
{
"code": 200,
"data": {
"eat_in": "50.00%"
"eat_out": "50.00%"
}
}
