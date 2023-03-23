from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("dbURL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Feedback(db.Model):
    __tablename__ = "feedback"

    feedbackID = db.Column(db.Integer, primary_key=True)
    dateTime = db.Column(db.DateTime, nullable=False)
    contactNo = db.Column(db.Integer)
    description = db.Column(db.String(255), nullable=False)

    def __init__ (self, feedbackID, dateTime, contactNo, description):
        self.feedbackID = feedbackID
        self.dateTime = dateTime
        self.contactNo = contactNo
        self.description = description

    def json(self):
        return {"feedbackID": self.feedbackID, "dateTime": self.dateTime,
                "contactNo": self.contactNo, "description": self.description}
    

@app.route("/feedback")
def get_all_feedback():
    feedback_list = Feedback.query.all()
    if len(feedback_list):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "all_feedbacks": [feedback.json() for feedback in feedback_list]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There is no feedback."
        }
    )

@app.route("/feedback/<int:feedbackID>")
def find_by_feedbackID(feedbackID):
    feedback = Feedback.query.filter_by(feedbackID=feedbackID).first()
    if feedback:
        return jsonify(
            {
                "code": 200,
                "data": feedback.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Feedback with given ID not found."
        }
    )

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)

