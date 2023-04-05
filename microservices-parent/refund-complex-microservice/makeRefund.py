from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import pika
import os
import sys
import json
import stripe

from invokes import invoke_http

# pass in payment_intent and customerId at the back
refund_url = "http://payment-service:4242/refund"
# pass in refundID at the back
refund_status_url = "http://payment-service:4242/refundStatus"
update_field_url = "http://invoice-service:5000/updateField"
# pass in any unique id to find data from invoices collection
search_url = "http://invoice-service:5000/search"
# update database for order
update_order_url = "http://order-service:8081/api/order/updateOrderById"

stripe.api_key = 'sk_test_51MlMMGLBRjiDAFPiuVE5HAXjMEUJiDlqjGLSP72dEbhQI9STJeHq0cTCPZUGCEFPAUXo59zcLa0EMK7CoCSY11LE00JZafQOs4'

app = Flask(__name__)
CORS(app)
hostname = 'rabbit_pika'
port = 5672
queue_name = 'update-status'


@app.route("/refund", methods=['POST'])
def refund():
    requests = request.get_json()
    pi = requests['pi']
    customerId = requests['customerId']
    piRequestBody = {
        "pi": pi
    }
    # get and update RefundId and RefundStatus
    try:
        print("hello")
        refund_obj = invoke_http(
            refund_url, method="POST", json=piRequestBody)
        print(refund_obj)

        requestBody = {
            "PaymentIntentId": pi,
            "RefundId": refund_obj["refundID"],
            "RefundStatus": refund_obj["refundStatus"]
        }
        # update RefundId and RefundStatus
        update = invoke_http(
            update_field_url, method="PUT", json=requestBody)
        

        # get orderid from invoice database
        searchRequestBody = {
            "PaymentIntentId": pi
        }
        data_obj = invoke_http(
            search_url, method="GET", json=searchRequestBody)
        print(data_obj)
        OrderId = data_obj["data"]["OrderId"]
        
        # update order database with status
        updateorder = invoke_http(
            update_order_url, method="PUT", params={"OrderId": OrderId, "Status": "cancelled"}
        )
        if (update["status"] == 200):
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=hostname, port=port,
                                          heartbeat=3600, blocked_connection_timeout=3600))
            channel = connection.channel()
            channel.queue_declare(queue='update-status', durable=True)
            message = {'recipient': customerId,
                       'status_msg': f'Refund Initiated for ({pi}). Refund ID: {refund_obj["refundID"]}'}
            channel.basic_publish(exchange='',
                                  routing_key='update-status', body=json.dumps(message))
            print("Message published to RabbitMQ")
            connection.close()
            return {"status": 200, "data": refund_obj}
        else:
            return {"status": 400, "error": "Failed to update invoice in database"}
    except Exception as e:
        return {"status": 500, "error": "Failed to create refund, it is likely that refund has already been initiated for this payment intent." + str(e)}

# get refund status and update database, this is for customer to check status


@app.route("/refundStatus", methods=['POST'])
def refundStatus():
    requests = request.get_json()
    RefundId = requests['RefundId']
    requestBody = {
        "RefundId": RefundId
    }

    try:
        # get refund obj
        refund_obj = invoke_http(
            refund_status_url, method="GET", json=requestBody)
        print(refund_obj)

        # get InvoiceId using RefundId
        data_obj = invoke_http(
            search_url, method="GET", json=requestBody)
        print(data_obj)
        InvoiceId = data_obj["data"]["InvoiceId"]

        # update database with status
        requestBody = {
            "InvoiceId": InvoiceId,
            "RefundStatus": refund_obj["refundStatus"]
        }
        update = invoke_http(
            update_field_url, method="PUT", json=requestBody)
        if (update["status"] == 200):
            return {"status": 200, "data": refund_obj}
        else:
            return {"status": 400, "error": "Failed to update invoice in database"}
    except Exception as e:
        return {"status": 500, "error": "There seem to be an error fetching refund data." + str(e)}


if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          " for placing an order...")
    app.run(host="0.0.0.0", port=4100, debug=True)
