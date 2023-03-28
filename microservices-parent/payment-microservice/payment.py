# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

import os
import stripe
import time
import random
import json

from flask import Flask, request

app = Flask(__name__)

stripe.api_key = 'sk_test_51MlMMGLBRjiDAFPiuVE5HAXjMEUJiDlqjGLSP72dEbhQI9STJeHq0cTCPZUGCEFPAUXo59zcLa0EMK7CoCSY11LE00JZafQOs4'

# get link to pay
@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
  # totalPrice = request.args.get("total")
  startTime = int(time.time()) #timing to set 30mins expiry
  price = random.randint(50,20000) #to be replaced and deleted
  # create stripe refund object
  session = stripe.checkout.Session.create(
    # pass payment information to stripe
    line_items=[{
      'price_data': {
        'currency': 'sgd',
        'product_data': {
          'name': 'Total Bill',
        },
        'unit_amount': price,
      },
      'quantity': 1,
    }],
    mode='payment',
    expires_at = startTime + 1800,
    success_url=f'http://localhost:4242/success/',
    cancel_url=f'http://localhost:4242/cancel/',
  )

  dataDict = {
    "url": session.url,
    "sessionID": session.id,
  }

  return json.dumps(dataDict, indent = 4)

#get payment status and payment intent id
@app.route('/paymentStatus')
def paymentStatus():
  session_id = request.args.get('session_id')
  # get stripe checkout object
  session = stripe.checkout.Session.retrieve(
    session_id,
  )
  
  dataDict = {
      "sessionID" : session_id,
      "paymentStatus" : session.payment_status,
      "pi" : session.payment_intent
  }

  return json.dumps(dataDict, indent = 4)

# refund
@app.route('/refund')
def refund():
  paymentIntent = request.args.get("pi")
  # create stripe refund object
  refund = stripe.Refund.create(payment_intent = paymentIntent)
  
  dataDict = {
      "paymentIntentID" : paymentIntent,
      "refundID" : refund.id,
      "refundStatus" : refund.status
  }

  return dataDict

# get refund status
@app.route('/refundStatus')
def refundStatus():
  refundID = request.args.get("re")
  # get stripe refund object
  refund = stripe.Refund.retrieve(
    refundID
  )
  dataDict = {
      "refundID" : refundID,
      "refundStatus" : refund.status
  }
  return json.dumps(dataDict, indent = 4)

if __name__== '__main__':
    app.run(port=4242, debug=True)