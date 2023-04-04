from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import pika
import os
import sys
import json
import stripe

from invokes import invoke_http

update_order_url = "http://order-service:8081/api/order/updateOrderById"
order_URL = "http://order-service:8081/api/order"
get_order_URL = "http://order-service:8081/api/order/findOrderById"
menu_url = "http://product-service:8080/api/product"
create_invoice_url = "http://invoice-service:5000/calculate-bill"

create_checkout_url = "http://payment-service:4242/create-checkout-session"
# pass in session_id at the back
payment_status_url = "http://payment-service:4242/paymentStatus"
update_field_url = "http://invoice-service:5000/updateField"
stripe.api_key = 'sk_test_51MlMMGLBRjiDAFPiuVE5HAXjMEUJiDlqjGLSP72dEbhQI9STJeHq0cTCPZUGCEFPAUXo59zcLa0EMK7CoCSY11LE00JZafQOs4'

app = Flask(__name__)
CORS(app)
hostname = 'rabbit_pika'
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
            request_data = request.get_json()
            orderId = request_data["orderId"]
            print(orderId)
            print("received order")
            invoice = processInvoice(orderId)

            print("-------\n")
            print("result")
            print(invoice)
            invoiceId = invoice["body"]["InvoiceId"]
            paramreq = {"OrderId": orderId, "InvoiceId": invoiceId}
            updateorder = updateOrderdb(paramreq)
            print(updateorder)
            session = createSession(invoice["body"])
            return session
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


def updateOrderdb(invoice):
    invoiceId = invoice["InvoiceId"]
    orderId = invoice["OrderId"]
    updateorder = invoke_http(
        update_order_url, method="PUT", params={"OrderId": orderId, "InvoiceId": invoiceId}
    )
    return updateorder


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
        message = {'recipient': customerId,
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
    else:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=hostname, port=port,
                                      heartbeat=3600, blocked_connection_timeout=3600))
        channel = connection.channel()
        channel.queue_declare(queue='update-status', durable=True)
        message = {'recipient': customerId,
                   'status_msg': 'Order Failed, Please Try Again'}  # modify as needed
        channel.basic_publish(exchange='',
                              routing_key='update-status', body=json.dumps(message))
        print("Message published to RabbitMQ")

        return {
            "code": 500,
            "data": {"order_result": order_result},
            "message": "Order creation failure sent for error handling."
        }


def processInvoice(orderId):
    # orderId = orderId["orderId"]
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

# create checkout session, return session id


def createSession(order):
    totalPrice = int(order['TotalPrice']) * 100
    InvoiceId = order['InvoiceId']
    customerId = InvoiceId.split("_")[1]
    print(customerId)
    requestBody = {
        "TotalPrice": totalPrice,
        "customerId": customerId
    }
    # create payment session

    try:
        paymentSession = invoke_http(
            create_checkout_url, method="POST", json=requestBody)
        print(paymentSession)

        requestBody = {
            "InvoiceId": InvoiceId,
            "SessionId": paymentSession["sessionID"]
        }
    # update Sessionid
        update = invoke_http(
            update_field_url, method="PUT", json=requestBody)
        if (update["status"] == 200):
            # link and SessionId
            return {"status": 200, "data": paymentSession}
        else:
            return {"status": 400, "error": "Failed to update invoice in database"}
    except Exception as e:
        return {"status": 500, "error": "There seem to be an error creating payment session." + str(e)}

# after payment, update payment intent. pass in session_id, this is automated


@app.route("/updatePI", methods=['GET'])
def updatePI():
    session_obj = stripe.checkout.Session.retrieve(
        request.args.get('SessionId'))
    SessionId = session_obj["id"]
    print("sessionid here  " + SessionId)
    # get pi status by calling sessionid
    piRequestBody = {
        "session_id": SessionId
    }
    # get pi
    try:
        pi_obj = invoke_http(
            payment_status_url, method="GET", json=piRequestBody)
        pi = pi_obj["pi"]
        PaymentStatus = pi_obj["PaymentStatus"]
        # update database with pi and PaymentStatus to be used if there is refund
        requestBody = {
            "SessionId": SessionId,
            "PaymentIntentId": pi,
            "PaymentStatus": PaymentStatus
        }
        # update Sessionid
        update = invoke_http(
            update_field_url, method="PUT", json=requestBody)
        if (update["status"] == 200):
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=hostname, port=port,
                                          heartbeat=3600, blocked_connection_timeout=3600))
            channel = connection.channel()
            channel.queue_declare(queue='update-status', durable=True)
            message = {'recipient': request.args.get('customerId'),
                       'status_msg': f'Payment Successful. To initiate refund, use this PaymentIntentID: ({pi})'}
            channel.basic_publish(exchange='',
                                  routing_key='update-status', body=json.dumps(message))
            print("Message published to RabbitMQ")
            connection.close()
            # PaymentStatus, pi, sessionID
            # return {"status": 200, "data": pi_obj}
            return redirect(f'http://localhost:3000/success?RefundId={pi}')
        else:
            return {"status": 400, "error": "Failed to update invoice in database"}
    except Exception as e:
        return {"status": 500, "error": "There seem to be an error fetching payment intent." + str(e)}


if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          " for placing an order...")
    app.run(host="0.0.0.0", port=5100, debug=True)
