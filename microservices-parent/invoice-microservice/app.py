from flask import Flask
from flask_pymongo import PyMongo
import requests

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://esdgroup5:9D20RivqGic2ADs9@esdmenu.6j7pwgr.mongodb.net/Orders?retryWrites=true&w=majority"
mongo = PyMongo(app)


def get_order_info(order_id):
    order = mongo.db.orders.find_one({"orderId": order_id})
    return order


def get_menu_info(menu_id):
    url = "http://esdmenu.6j7pwgr.mongodb.net/menus/" + menu_id
    response = requests.get(url)
    menu = response.json()
    return menu


def calculate_total_price(order_info, menu_info):
    total_price = 0
    for item in order_info["items"]:
        menu_item = next((x for x in menu_info["items"] if x["menuItemId"] == item["menuItemId"]), None)
        if menu_item is not None:
            total_price += menu_item["price"] * item["quantity"]
    return total_price


@app.route("/calculate-bill/<order_id>")
def calculate_bill(order_id):
    order_info = get_order_info(order_id)
    if order_info is None:
        return {"error": "Order not found"}
    menu_id = order_info["menuId"]
    menu_info = get_menu_info(menu_id)
    total_price = calculate_total_price(order_info, menu_info)
    return {"orderId": order_id, "totalPrice": total_price}


if __name__ == '__main__':
    app.run()
