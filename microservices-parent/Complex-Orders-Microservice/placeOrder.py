from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import sys

import requests
from invokes import invoke_http
import json
# book_URL = "http://localhost:5000/book"
order_URL = "http://localhost:8081/api/order"
get_order_URL = "http://localhost:8081/api/order/findOrderById"
menu_url = "http://localhost:8080/api/product"
create_invoice_url = "http://localhost:5000/calculate-bill"

create_checkout_url = "http://127.0.0.1:5000/create-checkout-session"
payment_status_url = "http://127.0.0.1:5000/paymentStatus" #pass in session_id at the back
refund_url = "http://127.0.0.1:5000/refund" #pass in payment_intent at the back
refund_status_url = "http://127.0.0.1:4242/refundStatus" #pass in refundID at the back


# activity_log_URL = "http://localhost:5003/activity_log"
# error_URL = "http://localhost:5004/error"
app = Flask(__name__)
CORS(app)


@app.route("/place_order", methods=['POST'])
def place_order():
    if request.is_json:
        try:
            order = request.get_json()
            print(order)
            print("received order")
            processPlaceOrder(order)

            print("-------\n")
            print("result")
            return "Order Placed"
        except Exception as e:
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "place_order.py internal error: " + ex_str
            }), 500
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


@app.route("/requestInvoice", methods=['POST'])
def requestInvoice():
    if request.is_json:
        try:
            orderId = request.get_json()
            print(orderId)
            print("received order")
            invoice = processInvoice(orderId)

            print("-------\n")
            print("result")
            print(invoice)
            return jsonify(invoice)
        except Exception as e:
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + \
                fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "requestInvoice.py internal error: " + ex_str
            }), 500
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


def processPlaceOrder(order):
    orderLineItems = order["orderLineItemsDtoList"]
    orderLineItemsDtoList = {"orderLineItemsDtoList": orderLineItems}
    print(orderLineItemsDtoList)
    customerId = order["customerId"]
    print(customerId)
    mode = order["Mode"]
    print(mode)
    print('\n-----Invoking order microservice-----')
    order_result = invoke_http(
        order_URL, method='POST', json=orderLineItemsDtoList, params={'customerId': customerId, "Mode": mode})
    print('order_result:', order_result)


def processInvoice(orderId):
    orderId = orderId["orderId"]
    order = invoke_http(get_order_URL, method='GET',
                        params={'OrderId': orderId})
    menu = invoke_http(menu_url, method="GET")
    requestBody = {
        "order": order,
        "menu": menu
    }
    createInvoice = invoke_http(
        create_invoice_url, method="POST", json=requestBody)
    print("create invoicer result:", createInvoice)

    return createInvoice

# create checkout session, return session id
@app.route("/checkoutSession", methods=['POST'])
def createSession():
    order = request.get_json()
    totalPrice = order['TotalPrice']
    requestBody = {
        "TotalPrice":totalPrice
    }
    paymentSession = invoke_http(
        create_checkout_url, method="POST", json=requestBody)
    print(paymentSession)
    return paymentSession

if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          " for placing an order...")
    app.run(host="0.0.0.0", port=5100, debug=True)
