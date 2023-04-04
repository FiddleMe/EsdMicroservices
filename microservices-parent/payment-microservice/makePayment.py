# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import os
import stripe
import time
import random
import json
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

stripe.api_key = 'sk_test_51MlMMGLBRjiDAFPiuVE5HAXjMEUJiDlqjGLSP72dEbhQI9STJeHq0cTCPZUGCEFPAUXo59zcLa0EMK7CoCSY11LE00JZafQOs4'

# get link to pay


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    order = request.get_json()
    totalPrice = order["TotalPrice"]
    customerId = order["customerId"]
    startTime = int(time.time())  # timing to set 30mins expiry
    # create stripe refund object
    session = stripe.checkout.Session.create(
        # pass payment information to stripe
        line_items=[{
            'price_data': {
                'currency': 'sgd',
                'product_data': {
                    'name': 'Total Bill',
                },
                'unit_amount': totalPrice,
            },
            'quantity': 1,
        }],
        mode='payment',
        expires_at=startTime + 1800,
        success_url='http://127.0.0.1:5100/updatePI?SessionId={CHECKOUT_SESSION_ID}' + f"&customerId={customerId}"
    )

    dataDict = {
        "url": session.url,
        "sessionID": session.id,
    }

    return jsonify(dataDict)

# get payment status and payment intent id


@app.route('/paymentStatus')
def paymentStatus():
    order = request.get_json()
    session_id = order["session_id"]
    # get stripe checkout object
    session = stripe.checkout.Session.retrieve(
        session_id,
    )

    dataDict = {
        "sessionID": session_id,
        "PaymentStatus": session.payment_status,
        "pi": session.payment_intent
    }

    return jsonify(dataDict)

# refund


@app.route('/refund', methods=['POST'])
def refund():
    refund_data = request.get_json()
    paymentIntent = refund_data["pi"]
    # create stripe refund object
    refund = stripe.Refund.create(payment_intent=paymentIntent)
    print(refund)

    dataDict = {
        "paymentIntentID": paymentIntent,
        "refundID": refund.id,
        "refundStatus": refund.status
    }

    return jsonify(dataDict)

# get refund status


@app.route('/refundStatus')
def refundStatus():
    refund_data = request.get_json()
    refundID = refund_data["RefundId"]
    # get stripe refund object
    refund = stripe.Refund.retrieve(
        refundID
    )
    dataDict = {
        "refundID": refundID,
        "refundStatus": refund.status,
        "status": 200
    }
    return jsonify(dataDict)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=4242)
