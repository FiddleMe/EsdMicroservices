from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import firebase_admin
from firebase_admin import credentials, auth

# Initialize the Flask app
app = Flask(__name__)

# Configure the database connection string. **TO DO: should be updated with the actual MySQL database credentials for your user details microservice.**
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password@localhost:3306/user_details'

# Configure Firebase credentials and initialize Firebase app
# TO DO: path here may need to change
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Initialize the SQLAlchemy database object
db = SQLAlchemy(app)

# Define the UserDetails model
class UserDetails(db.Model):
    __tablename__ = 'user_details'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = password

    def json(self):
        return {'email': self.email}

# Route for signing up a new user
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')


    # Create a new user in Firebase
    try:
        user = auth.create_user(
            email=email,
            password=password,

        )
    except Exception as e:
        return jsonify({'message': str(e)}), 400

    # Create a new UserDetails object and add it to the database
    user_details = UserDetails(email, password)
    db.session.add(user_details)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# Route for logging in an existing user
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Verify the user's credentials with Firebase
    try:
        user = auth.sign_in_with_email_and_password(email, password)
    except Exception as e:
        return jsonify({'message': str(e)}), 401

    # Retrieve the user's details from the database
    user_details = UserDetails.query.filter_by(email=email).first()

    return jsonify({
        'message': 'User logged in successfully',
        'user': user_details.json()
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
