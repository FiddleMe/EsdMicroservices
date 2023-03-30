from flask import Flask, request, jsonify
from flask_cors import CORS
import pika
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

# activity_log_URL = "http://localhost:5003/activity_log"
# error_URL = "http://localhost:5004/error"
app = Flask(__name__)
CORS(app)
hostname = 'localhost'
port = 5672
queue_name = 'update-status'


@app.route("/place_order", methods=['POST'])
def place_order():
    if request.is_json:
        try:
            order = request.get_json()
            print(order)
            print("received order")
            result = processPlaceOrder(order)

            print("-------\n")
            print("result")
            print(result)
            return jsonify(result), result["code"]
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

    if order_result["code"] in range(200, 300):
        orderId = order_result["OrderId"]
        order = {
            "orderLineItemsDtoList": orderLineItems,
            "customerId": customerId,
            "Mode": mode,
            "orderId": orderId

        }
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=hostname, port=port,
                                      heartbeat=3600, blocked_connection_timeout=3600))
        channel = connection.channel()
        channel.queue_declare(queue='update-status', durable=True)
        message = {'recipient': 'iamsomoene@gmail.com',
                   'status_msg': 'Order Created'}  # modify as needed
        channel.basic_publish(exchange='',
                              routing_key='update-status', body=json.dumps(message))
        print("Message published to RabbitMQ")
        connection.close()
        return {
            "code": 200,
            "data": {"order": order},
            "message": "Order created."
        }
    return {
        "code": 500,
        "data": {"order_result": order_result},
        "message": "Order creation failure sent for error handling."
    }


def processInvoice(orderId):
    orderId = orderId["orderId"]
    print(orderId)
    order = invoke_http(get_order_URL, method='GET',
                        params={'OrderId': orderId})

    reqOrder = order["order"]
    print(reqOrder)
    menu = invoke_http(menu_url, method="GET")
    requestBody = {
        "order": reqOrder,
        "menu": menu
    }
    print(requestBody)
    createInvoice = invoke_http(
        create_invoice_url, method="POST", json=requestBody)
    print("create invoicer result:", createInvoice)

    return createInvoice


if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          " for placing an order...")
    app.run(host="0.0.0.0", port=5100, debug=True)
