from flask import Flask, jsonify
from flask_cors import CORS
from invokes import invoke_http
import nltk
import ssl
from nltk.sentiment import SentimentIntensityAnalyzer

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

app = Flask(__name__)
CORS(app)

feedback_url = "http://127.0.0.1:5001/feedback"
order_url = "http://localhost:8081/api/order"

@app.route("/analytics/pos_neg_percent")
def return_pos_vs_neg():
    feedbacks_json = invoke_http(feedback_url, method='GET')
    feedbacks_dict = feedbacks_json["data"]
    feedbacks_list = feedbacks_dict["all_feedbacks"]

    if len(feedbacks_list):
        positive_feedbacks = []
        negative_feedbacks = []
        
        sia = SentimentIntensityAnalyzer()

        for feedback in feedbacks_list:
            description = feedback["description"]
            compound_score = sia.polarity_scores(description)["compound"]
            if compound_score > 0:
                positive_feedbacks.append(description)
            elif compound_score < 0:
                negative_feedbacks.append(description)
        positive_percentage = '{:.2%}'.format(len(positive_feedbacks)/len(feedbacks_list))
        negative_percentage = '{:.2%}'.format(len(negative_feedbacks)/len(feedbacks_list))
        result = {"positive feedback": positive_percentage, "negative feedback": negative_percentage}
        return jsonify(
                {
                    "code": 200,
                    "data": {
                        "feedback_percentages": result
                    }
                }
            )
    else:
        return jsonify(
        {
            "code": 404,
            "message": "There is no feedback."
        }
    )

@app.route("/analytics/top_menu_items")
def top_menu_items():
    orders_list = invoke_http(order_url, method='GET')
    # orders_list = [
    #     {
    #         "orderLineItemsList": [
    #             {
    #                 "id": 1,
    #                 "product_name": "iphone_13",
    #                 "quantity": 1
    #             },
    #             {
    #                 "id": 2,
    #                 "product_name": "jangmeyon",
    #                 "quantity": 1
    #             }
    #         ],
    #         "orderId": 1,
    #         "customerId": "testing",
    #         "modeOfEating": "hi",
    #         "invoiceId": "None",
    #         "status": "Preorder"
    #     },
    #     {
    #         "orderLineItemsList": [
    #             {
    #                 "id": 3,
    #                 "product_name": "Bibimbap",
    #                 "quantity": 1
    #             }
    #         ],
    #         "orderId": 2,
    #         "customerId": "testing",
    #         "modeOfEating": "hi",
    #         "invoiceId": "None",
    #         "status": "Preorder"
    #     }
    # ]

    if len(orders_list):
        order_item_and_qty = {}
        for order in orders_list:
            orderLineItemsList = order["orderLineItemsList"]
            for item in orderLineItemsList:
                order_item = item["product_name"]
                qty = item["quantity"]
                if order_item not in order_item_and_qty:
                    order_item_and_qty[order_item] = qty
                else:
                    order_item_and_qty[order_item] += qty
        number_of_items = 5
        result = dict(sorted(order_item_and_qty.items(), key = lambda x: x[1], reverse = True)[:number_of_items])
        return jsonify(
            {
                "code": 200,
                "data": result
            }
        )
    else:
        return jsonify(
            {
                "code": 404,
                "message": "There are no orders."
            }
        )
    
@app.route("/analytics/mode_of_eating")
def preferred_mode_of_eating():
    orders_list = invoke_http(order_url, method='GET')
    #next two lines are entirely speculative - order microservice idk how to use
    # Note: the data below is entirely test data. This is strictly temporary.
    # orders_list = [
    #     {
    #         "orderLineItemsList": [
    #             {
    #                 "id": 1,
    #                 "product_name": "iphone_13",
    #                 "quantity": 1
    #             },
    #             {
    #                 "id": 2,
    #                 "product_name": "jangmeyon",
    #                 "quantity": 1
    #             }
    #         ],
    #         "orderId": 1,
    #         "customerId": "testing",
    #         "modeOfEating": "hi",
    #         "invoiceId": "None",
    #         "status": "Preorder"
    #     },
    #     {
    #         "orderLineItemsList": [
    #             {
    #                 "id": 3,
    #                 "product_name": "Bibimbap",
    #                 "quantity": 1
    #             }
    #         ],
    #         "orderId": 2,
    #         "customerId": "testing",
    #         "modeOfEating": "hi",
    #         "invoiceId": "None",
    #         "status": "Preorder"
    #     }
    # ]

    if len(orders_list):
        modes_of_eating = {}
        for order in orders_list:
            mode_of_eating = order["modeOfEating"]
            if mode_of_eating not in modes_of_eating:
                modes_of_eating[mode_of_eating] = 1
            else:
                modes_of_eating[mode_of_eating] += 1
        for mode_of_eating in modes_of_eating:
            modes_of_eating[mode_of_eating] = modes_of_eating[mode_of_eating] / len(orders_list)
            modes_of_eating[mode_of_eating] = '{:.2%}'.format(modes_of_eating[mode_of_eating])
        return jsonify(
            {
                "code": 200,
                "data": modes_of_eating
            }
        )
    else:
        return jsonify(
            {
                "code": 404,
                "message": "There are no orders."
            }
        )


@app.route("/analytics/top_words")
def find_top_words():
    feedbacks_json = invoke_http(feedback_url, method='GET')
    feedbacks_dict = feedbacks_json["data"]
    feedbacks_list = feedbacks_dict["all_feedbacks"]
    stopwords = nltk.corpus.stopwords.words("english")
    sia = SentimentIntensityAnalyzer()
    if len(feedbacks_list):
        positive_bag_of_words = []
        negative_bag_of_words = []
        for feedback in feedbacks_list:
            description = feedback["description"]
            compound_score = sia.polarity_scores(description)["compound"]
            processed_feedback = nltk.word_tokenize(description)
            if compound_score > 0:
                for word in processed_feedback:
                    if word.isalpha() and word not in stopwords:
                        positive_bag_of_words.append(word.lower())
            elif compound_score < 0:
                for word in processed_feedback:
                    if word.isalpha() and word not in stopwords:
                        negative_bag_of_words.append(word.lower())
        positive_word_fd = nltk.FreqDist(positive_bag_of_words)
        negative_word_fd = nltk.FreqDist(negative_bag_of_words)
        most_common_positive = positive_word_fd.most_common(5)
        most_common_negative = negative_word_fd.most_common(5)
        result = {"most common positive words": most_common_positive, "most common negative words": most_common_negative}
        return jsonify(
            {
                "code": 200,
                "data": result
            }
        )

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5010, debug=True)