from flask import Flask, request
from flask_pymongo import pymongo
from pymongo import MongoClient
import requests

app = Flask(__name__)
# app.config["MONGO_URI"] = "mongodb+srv://esdgroup5:atnOGttsAp9VxC4f@esdmenu.6j7pwgr.mongodb.net/?retryWrites=true&w=majority"
# mongo = PyMongo(app)
# db = mongodb_client.db
CONNECTION_STRING = "mongodb+srv://esdgroup5:atnOGttsAp9VxC4f@esdmenu.6j7pwgr.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(CONNECTION_STRING)
db = client.get_database('Invoice')
user_collection = pymongo.collection.Collection(db, 'invoices')
# def get_order_info(order_id):
#     order = mongo.db.orders.find_one({"orderId": order_id})
#     return order


# def get_menu_info(menu_id):
#     url = "http://esdmenu.6j7pwgr.mongodb.net/menus/" + menu_id
#     response = requests.get(url)
#     menu = response.json()
#     return menu


def calculate_total_price(order_info, menu_info):
    total_price = 0
    for item in order_info["orderLineItemsList"]:
        menu_item = next(
            (x for x in menu_info if x["name"] == item["product_name"]), None)
        if menu_item is not None:
            total_price += menu_item["price"] * item["quantity"]

    return total_price


@app.route("/calculate-bill", methods=['POST'])
def calculate_bill():
    # order_info = get_order_info(order_id)
    # if order_info is None:
    #     return {"error": "Order not found"}
    # menu_id = order_info["menuId"]
    # menu_info = get_menu_info(menu_id)
    info = request.get_json()
    order_info = info["order"]
    menu_info = info["menu"]
    order_id = order_info["orderId"]
    customerId = order_info["customerId"]
    invoiceId = str(order_id) + "_" + str(customerId)

    total_price = calculate_total_price(order_info, menu_info)
    body = {
        "_id": invoiceId,
        "InvoiceId": str(invoiceId),
        "OrderId": order_id,
        "TotalPrice": total_price,
        "PaymentStatus": "unpaid",
        "SessionId": None,
        "PaymentIntentId": None,
        "RefundId": None,
        "RefundStatus": None
    }
    try:
        print(body)
        success = user_collection.insert_one(body)
        if (success):
            return {"status": 200, "body": body}
        else:
            return {"status": 400, "error": "Failed to add invoice to database"}
    except Exception as e:
        return {"status": 500, "error": str(e)}


@app.route("/refundBill", methods=['PUT'])
def refund_bill():
    updates = request.json()
    invoiceId = updates["InvoiceId"]
    SessionId = updates["SessionId"]
    PaymentIntentId = updates["PaymentIntentId"]
    RefundId = updates["RefundId"]
    RefundStatus = updates["RefundStatus"]
    try:
        response = user_collection.update_one(
            {"InvoiceId": invoiceId},
            {"$set": {
                "SessionId ": SessionId,
                "PaymentIntentId": PaymentIntentId,
                "RefundId": RefundId,
                "RefundStatus": RefundStatus
            }}
        )
        if (response):
            return {"status": 200}
        else:
            return {"status": 400, "error": "Failed to update invoice in database"}
    except Exception as e:
        return {"status": 500, "error": str(e)}


@app.route("/updatePaymentStatus", methods=['PUT'])
def update_paymentStatus():
    updates = request.get_json()
    invoiceId = updates["InvoiceId"]
    PaymentStatus = updates["PaymentStatus"]
    try:
        response = user_collection.update_one(
            {"InvoiceId": invoiceId},
            {"$set": {
                "PaymentStatus": PaymentStatus
            }}
        )
        if (response):
            return {"status": 200}
        else:
            return {"status": 400, "error": "Failed to update invoice in database"}
    except Exception as e:
        return {"status": 500, "error": str(e)}


if __name__ == '__main__':
    app.run()
