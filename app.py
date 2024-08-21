from flask import Flask, jsonify, request, url_for, send_from_directory
import mysql.connector
import os
import random
from jwt import encode
from mysql.connector import errorcode
import logging
import math
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_mail import Mail, Message
from flask_cors import CORS
import bcrypt 
import json
import jwt
from werkzeug.utils import secure_filename
from flask import send_file
from datetime import datetime, timedelta
from mysql.connector import Error, connect
from datetime import date, timedelta  # Import the date class
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif' }
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
jwt = JWTManager(app)
# bcrypt = Bcrypt()

def send_registration_email(to_email, subject, body):
    msg = Message(subject, sender='rajubhaaik@gmail.com', recipients=[to_email])
    msg.body = body
    mail.send(msg)


def send_admin_notification_email(admin_email, firstname,lastname):
    subject = "New User Registration"
    body = f"Hello Admin,\n\nA new user {firstname} {lastname} has registered on your website."
    send_registration_email(admin_email, subject, body)


# Token 
def generate_token(user_id, companyname):
    payload = {
        'userID': user_id,
        'companyname': companyname,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def generate_token(user_id, email):
    payload = {
        'userID': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    }
    token = encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')
    return token

# Database Configuration
db_config = {
    "user": "root",
    "password": "",
    "host": "localhost",
    "database": "aecearthwebapp1",
}

# Function to create a database connection
def create_connection():
    try:
        connection = connect(**db_config)
        return connection
    except Error as e:
        print(f"Error creating connection: {e}")
        return None


# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'rajubhaaik@gmail.com'
app.config['MAIL_PASSWORD'] = 'xmxb xwzg jvzn yyxk'

app.config['SECRET_KEY']='csac jsnaco6465c 4ssd64c'
mail = Mail(app)


@app.route("/api/purchase_order", methods=["POST"])
def create_purchase_order():
    try:
        select_supplier = request.form.get("select_supplier")
        invoice_date = request.form.get("invoice_date")
        due_date = request.form.get("due_date")
        payment_terms = request.form.get("payment_terms")
        description = request.form.get("description")
        unit_price = request.form.get("unit_price")
        total_amount = request.form.get("total_amount")
        quantity = request.form.get("quantity")

        # Check if all required fields are present
        if not all(
            [
                select_supplier,
                invoice_date,
                due_date,
                payment_terms,
                description,
                unit_price,
                total_amount,
                quantity,
            ]
        ):
            return jsonify({"error": "Missing required fields"}), 400

        # Insert the purchase order data into the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO purchase_order 
                          (select_supplier, invoice_date, due_date, payment_terms, description, unit_price, total_amount, quantity)
                          VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                select_supplier,
                invoice_date,
                due_date,
                payment_terms,
                description,
                unit_price,
                total_amount,
                quantity,
            ),
        )
        conn.commit()
        cursor.close()

        return jsonify({"message": "Purchase order created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/purchase_order", methods=["GET"])
def get_purchase_orders():
    try:
        conn = mysql.connection
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM purchase_order")
        purchase_orders = cursor.fetchall()
        cursor.close()

        purchase_order_list = []
        for order in purchase_orders:
            purchase_order_dict = {
                "id": order[0],
                "select_supplier": order[1],
                "invoice_date": order[2],
                "due_date": order[3],
                "payment_terms": order[4],
                "description": order[5],
                "unit_price": order[6],
                "total_amount": order[7],
                "quantity": order[8],
            }
            purchase_order_list.append(purchase_order_dict)

        return jsonify({"purchase_orders": purchase_order_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Invoice creation from
@app.route("/api/invoice_creation", methods=["POST"])
def invoice_creation():
    try:
        select_supplier = request.form.get("select_supplier")
        invoice_date = request.form.get("invoice_date")
        due_date = request.form.get("due_date")
        payment_terms = request.form.get("payment_terms")
        description = request.form.get("description")
        quantity = request.form.get("quantity")
        unit_price = request.form.get("unit_price")
        total_amount = request.form.get("total_amount")

        # Check if all required fields are present
        if not all(
            [
                select_supplier,
                invoice_date,
                due_date,
                payment_terms,
                description,
                unit_price,
                total_amount,
                quantity,
            ]
        ):
            return jsonify({"error": "Missing required fields"}), 400

        # Insert the purchase order data into the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO invoice_creation
                          (select_supplier, invoice_date, due_date, payment_terms, description, quantity, unit_price, total_amount)
                          VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                select_supplier,
                invoice_date,
                due_date,
                payment_terms,
                description,
                quantity,
                unit_price,
                total_amount,
            ),
        )
        conn.commit()
        cursor.close()

        return jsonify({"message": "Invoice created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/invoice_creation", methods=["GET"])
def get_invoice_creations():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM invoice_creation")
        invoice_creations = cursor.fetchall()
        cursor.close()

        invoice_creation_list = []
        for invoice in invoice_creations:
            invoice_creation_dict = {
                "id": invoice[0],
                "select_supplier": invoice[1],
                "invoice_date": invoice[2],
                "due_date": invoice[3],
                "payment_terms": invoice[4],
                "description": invoice[5],
                "unit_price": invoice[6],
                "total_amount": invoice[7],
                "quantity": invoice[8],
            }
            invoice_creation_list.append(invoice_creation_dict)

        return jsonify({"invoice_creations": invoice_creation_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# API for Registration
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed_password.decode("utf-8")


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Extract data from JSON request
    companyname = data.get("companyname")
    location = data.get("location")
    email = data.get("email")
    phone = data.get("contact")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    # Validate required fields
    # if not firstname or not lastname or not email or not phone or not password or not confirm_password:
    #     return jsonify({"error": "Missing required fields"}), 400

    # Check if email contains capital letters
    # if any(char.isupper() for char in email):
    #     return jsonify({"error": "Email should be in lowercase"}), 400
    # else: return "working"

    # Convert email to lowercase
    email = email.lower()

    # Check if the user already exists in the database
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    if user:
        return jsonify({"error": "User already exists"}), 409

    # Check if password and confirm_password match
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Hash the password

    hashed_password = hash_password(password)

    # Insert new user into the database
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO users (companyname, location, email, phone_number, password) VALUES (%s, %s, %s, %s, %s)",
        (companyname, location, email, phone, hashed_password),
    )

    conn.commit()
    cur.close()

    # Send registration email to the user
    send_registration_email(email, 'Registration Successful', 'Thank you for registering with our website!')

    # Notify admin
    admin_email = 'jeethupathak7760@gmail.com'
    send_admin_notification_email(admin_email,companyname, location )

    return jsonify({"message": "User registered successfully"}), 201

#Login API
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        # Attempt MySQL connection
        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor()
        cur.execute("SELECT id, companyname, password FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_id, companyname, hashed_password = user

        if bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8")):
            # Generate a new token
            token = generate_token(user_id, email)
            return jsonify({"message": "Login Successful", "token": token, "userId": user_id, "companyname": companyname}), 200
        else:
            return jsonify({"error": "Incorrect email or password"}), 401
    except mysql.connector.Error as e:
        # Handle MySQL connection errors
        error_message = str(e)
        return jsonify({"error": error_message}), 500
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
            
    # function to generate OTP
def generate_otp():
    digits = "0123456789"
    OTP = ""
    for i in range(4):
        OTP += digits[math.floor(random.random() * 10)]
    return OTP


# Send OTP via Email
def send_otp_email(email, otp):
    msg = Message("Password Reset OTP", recipients=[email], sender="myemail123@gmail.com")
    msg.body = f"Your OTP for password reset is: {otp}"
    mail.send(msg)


# API for Requesting Password Reset OTP
@app.route("/api/reset_password/request", methods=["POST"])
def request_reset_password():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data["email"]
    if not email:
        return jsonify({"error": "Email not provided"}), 400

    # Check if the email exists in the database
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Generate OTP
    otp = generate_otp()

    # # Calculate OTP expiration time
    # otp_expiration = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)

    # Store OTP and its expiration time in the database
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor()
    cur.execute("UPDATE users SET otp = %s WHERE email = %s", (otp, email))
    conn.commit()
    cur.close()
    conn.close

    # Send OTP via Email
    send_otp_email(email, otp)

    return (
        jsonify({"message": "Password reset OTP sent to your email", "otp": otp}),
        200,
    )


# API for Verify OTP
@app.route("/api/verify_otp", methods=["POST"])
def verify_otp():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    otp = data.get("otp")
    email = data.get("email")

    if not otp or not email:
        return jsonify({"error": "Email or OTP not provided"}), 400

    # Retrieve OTP from dadabase
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor()
    cur.execute("SELECT otp FROM users WHERE email = %s", (email,))
    otp_data = cur.fetchone()
    cur.close()

    if not otp_data:
        return jsonify({"error": "Email not found"}), 404

    saved_otp = otp_data[0]

    # # Check if OTP is expired
    # if datetime.datetime.now(datetime.timezone.utc) > otp_expiration:
    #     return jsonify({"error": "OTP has expired"}), 400

    if saved_otp != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    return jsonify({"message": "OTP verification successful"}), 200

# API for Reset Password
@app.route('/api/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400 

    new_password = data.get('newPassword')
    confirm_new_password = data.get('confirmNewPassword')
    email = data.get('email')
    
    if not new_password or not confirm_new_password or not email:
        return jsonify({"error": "Missing required fields"}), 400

    if new_password != confirm_new_password:
        return jsonify({"error": "New password and confirmation password do not match"}), 400

    # Check if the email exists in the database
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor() 
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Hash the new password before updating it in the database
    hashed_new_password = hash_password(new_password)

    # Update the user's password in the database
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor() 
    cur.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_new_password, email))
    conn.commit()
    cur.close()

    return jsonify({"message": "Password reset successfully"}), 200

#other file code

@app.route('/api/invoice', methods=['POST'])
def create_invoice():
    invoice_number = request.form.get('invoice_number')
    date = request.form.get('date')
    amount = request.form.get('amount')
    attached_documents = request.files.get('attached_documents')

    # Check if all required fields are present
    if not (invoice_number and date and amount and attached_documents):
        return jsonify({'error': 'Missing required fields'}), 400

    # Create the 'uploads' directory if it doesn't exist
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    # Save the attached document to the server
    attached_documents_path = f"uploads/{attached_documents.filename}"
    attached_documents.save(attached_documents_path)

    # Insert the invoice data into the database
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO invoice_form (invoice_number, date, amount, attached_documents)
                          VALUES (%s, %s, %s, %s)''', (invoice_number, date, amount, attached_documents_path))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Invoice created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/invoice', methods=['GET'])
def get_invoices():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM invoice_form")
        invoices = cursor.fetchall()
        cursor.close()
        conn.close()
        invoices_list = []
        for invoice in invoices:
            invoice_data = {
                'id': invoice[0],
                'invoice_number': invoice[1],
                'date': invoice[2],
                'amount': invoice[3],
                'attached_documents': invoice[4]
            }
            invoices_list.append(invoice_data)
        return jsonify({'invoices': invoices_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attached_documents', methods=['GET'])
def get_attached_documents():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT id, attached_documents FROM invoice_form")
        documents = cursor.fetchall()
        cursor.close()
        conn.close()
        documents_list = []
        for doc in documents:
            doc_id = doc[0]
            doc_path = doc[1]
            documents_list.append({'id': doc_id, 'name': doc_path.split('/')[-1]})
        return jsonify({'documents': documents_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attached_documents/<int:document_id>', methods=['GET'])
def download_attached_document(document_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT attached_documents FROM invoice_form WHERE id = %s", (document_id,))
        document_path = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        return send_file(document_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Suppliet Payment History Form

@app.route('/api/supplier_payment', methods=['POST'])
def create_supplier_payment():
    try:
        supplier_name = request.form.get('supplier_name')
        invoice_number = request.form.get('invoice_number')
        date = request.form.get('date')
        amount = request.form.get('amount')
        payment_date = request.form.get('payment_date')
        payment_amount = request.form.get('payment_amount')
        payment_method = request.form.get('payment_method')
        transaction_reference = request.form.get('transaction_reference')
       
       

        # Check if all required fields are present
        if not (supplier_name and invoice_number and date and amount and payment_date and payment_amount and payment_method and transaction_reference):
            return jsonify({'error': 'Missing required fields'}), 400

        # Insert the supplier payment data into the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO supplier_payments 
                          (Supplier_name, invoice_number, date, amount, payment_date, payment_amount, payment_method, transaction_reference)
                          VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''',
                       (supplier_name, invoice_number, date, amount, payment_date, payment_amount, payment_method, transaction_reference))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Supplier payment created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/supplier_payment', methods=['GET'])
def get_supplier_payments():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM supplier_payments")
        payments = cursor.fetchall()
        cursor.close()
        conn.close()
        payments_list = []
        for payment in payments:
            payment_data = {
                'id': payment[0],
                'Supplier_name': payment[1],
                'invoice_number': payment[2],
                'date': str(payment[3]),  # Convert date object to string
                'amount': str(payment[4]),  # Convert decimal object to string
                'payment_date': str(payment[5]),  # Convert date object to string
                'payment_amount': str(payment[6]),  # Convert decimal object to string
                'payment_method': payment[7],
                'transaction_reference': payment[8]
            }
            payments_list.append(payment_data)
        return jsonify({'supplier_payments': payments_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Supplier Approval Form

@app.route('/api/supplier_approval', methods=['POST'])
def create_supplier_approval():
    try:
        company_name = request.form.get('company_name')
        contact_person = request.form.get('contact_person')
        number = request.form.get('number')
        email = request.form.get('email')
        approval_status = request.form.get('approval_status')
        leave_comments = request.form.get('leave_comments')

        # Check if all required fields are present
        if not (company_name and contact_person and number and email and approval_status and leave_comments):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if approval_status is either 'approve' or 'reject'
        if approval_status not in ['Approved', 'Rejected']:
            return jsonify({'error': 'Invalid approval status'}), 400

        # Insert the supplier approval data into the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO supplier_approvals 
                          (company_name, contact_person, number, email, approval_status, leave_comments)
                          VALUES (%s, %s, %s, %s, %s, %s)''',
                       (company_name, contact_person, number, email, approval_status, leave_comments))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Supplier approval created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/supplier_approval', methods=['GET'])
def get_supplier_approvals():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM supplier_approvals")
        approvals = cursor.fetchall()
        cursor.close()
        conn.close()
        approvals_list = []
        for approval in approvals:
            approval_data = {
                'id': approval[0],
                'company_name': approval[1],
                'contact_person': approval[2],
                'number': approval[3],
                'email': approval[4],
                'approval_status': approval[5],
                'leave_comments': approval[6]
            }
            approvals_list.append(approval_data)
        return jsonify({'supplier_approvals': approvals_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
#Api for Profile
# Route to update bank details for a specific user
@app.route('/api/update_bank_details/<int:user_id>', methods=['PUT'])
def update_bank_details(user_id):
    data = request.json
    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            # Validate required fields
            if not all(key in data for key in ('bank_name', 'account', 'branch', 'ifsc')):
                return jsonify({"message": "Missing required fields"}), 400
            
            # Check if the user already exists
            cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            
            if result:
                # If the user exists, update their bank details
                query = """
                UPDATE users 
                SET bank_name = %s, account = %s, branch = %s, ifsc = %s
                WHERE id = %s
                """
                values = (
                    data['bank_name'],
                    data['account'],
                    data['branch'],
                    data['ifsc'],
                    user_id
                )
                cursor.execute(query, values)
                connection.commit()
                cursor.close()
                connection.close()
                return jsonify({"message": "Bank details saved successfully"}), 200
            else:
                # User ID does not exist
                cursor.close()
                connection.close()
                return jsonify({"message": "User not found"}), 404
        except Error as e:
            cursor.close()
            connection.close()
            return jsonify({"message": f"Failed to save data: {e}"}), 500
    else:
        return jsonify({"message": "Failed to connect to the database"}), 500




# Route to get bank details for a specific user
@app.route('/api/get_bank_details/<int:user_id>', methods=['GET'])
def get_bank_details(user_id):
    connection = create_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Check if the user exists
            cursor.execute("SELECT bank_name, account, branch, ifsc FROM users WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            
            if result:
                cursor.close()
                connection.close()
                return jsonify(result), 200
            else:
                cursor.close()
                connection.close()
                return jsonify({"message": "User not found"}), 404
        except Error as e:
            cursor.close()
            connection.close()
            return jsonify({"message": f"Failed to retrieve data: {e}"}), 500
    else:
        return jsonify({"message": "Failed to connect to the database"}), 500



# Route to update user details for a specific user
@app.route('/api/update_user_details/<int:user_id>', methods=['PUT'])
def update_user_details(user_id):
    data = request.json
    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            # Validate required fields
            required_fields = ['email', 'phone_number', 'companyname', 'location']
            if not all(field in data for field in required_fields):
                return jsonify({"message": "Missing required fields"}), 400
            
            # Check if user exists
            cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            
            if result:
                # If the user exists, update their details
                query = """
                UPDATE users 
                SET email = %s, phone_number = %s, companyname = %s, location = %s
                WHERE id = %s
                """
                values = (
                    data['email'],
                    data['phone_number'],
                    data['companyname'],
                    data['location'],
                    user_id
                )
                cursor.execute(query, values)
                connection.commit()
                cursor.close()
                connection.close()
                return jsonify({"message": "User details updated successfully"}), 200
            else:
                # User ID does not exist
                cursor.close()
                connection.close()
                return jsonify({"message": "User not found"}), 404
        except Error as e:
            cursor.close()
            connection.close()
            return jsonify({"message": f"Failed to update data: {e}"}), 500
    else:
        return jsonify({"message": "Failed to connect to the database"}), 500


# Route to get user details for a specific user
@app.route('/api/get_user_details/<int:user_id>', methods=['GET'])
def get_user_details(user_id):
    connection = create_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Check if the user exists
            cursor.execute("SELECT id, email, phone_number, companyname, location FROM users WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            
            if result:
                cursor.close()
                connection.close()
                return jsonify(result), 200
            else:
                cursor.close()
                connection.close()
                return jsonify({"message": "User not found"}), 404
        except Error as e:
            cursor.close()
            connection.close()
            return jsonify({"message": f"Failed to retrieve data: {e}"}), 500
    else:
        return jsonify({"message": "Failed to connect to the database"}), 500
    
# Function to establish a database connection
def get_database_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        logging.error("Database connection error: %s", err)
        raise
    
#Goods and Material Api
#Products
@app.route('/products/<int:UserID>', methods=['POST'])
def add_new_product(UserID):
    try:
        conn = get_database_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE id = %s", (UserID,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        product_name = request.form.get('productName')
        description = request.form.get('description')
        quantity_available = request.form.get('quantityAvailable')
        unit_price = request.form.get('unitPrice')
        images = request.files.getlist('images')

        if not all([product_name, description, quantity_available, unit_price]):
            return jsonify({'error': 'Missing required fields'}), 400

        filenames = []
        for image in images:
            if image and image.filename:
                filename = secure_filename(image.filename)
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                filenames.append(filename)

        images_json = json.dumps(filenames)  # Store only filenames as JSON

        sql = """
        INSERT INTO products (user_id, product_name, description, quantity_available, unit_price, images)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (UserID, product_name, description, quantity_available, unit_price, images_json))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Product added successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/users/<int:UserID>/products', methods=['GET'])
def get_user_products(UserID):
    try:
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Query to fetch all products for the specified user
        cursor.execute("SELECT * FROM products WHERE user_id = %s", (UserID,))
        products = cursor.fetchall()

        # Check if the user has any products
        if not products:
            return jsonify({'error': 'No products found for this user'}), 404

        # Format the product data
        products_list = []
        for product in products:
            product_id, user_id, product_name, description, quantity_available, unit_price, images_json = product

            image_paths = json.loads(images_json)
            image_links = [url_for('uploaded_file', filename=os.path.basename(image_path), _external=True) for image_path in image_paths]

            products_list.append({
                'product_id': product_id,
                'user_id': user_id,
                'product_name': product_name,
                'description': description,
                'quantity_available': quantity_available,
                'unit_price': unit_price,
                'image_links': image_links
            })

        cursor.close()
        conn.close()

        return jsonify(products_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/products/<int:UserID>/<int:ProductID>', methods=['PUT'])
def update_product(UserID, ProductID):
    try:
        # Parse the request to get the updated product details
        product_name = request.form.get('productName')
        description = request.form.get('description')
        quantity_available = request.form.get('quantityAvailable')
        unit_price = request.form.get('unitPrice')
        
        # Check if all required fields are present
        if not all([product_name, description, quantity_available, unit_price]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Execute an UPDATE SQL query to modify the product details
        sql = """
        UPDATE products 
        SET product_name = %s, description = %s, quantity_available = %s, unit_price = %s 
        WHERE product_id = %s AND user_id = %s
        """
        cursor.execute(sql, (product_name, description, quantity_available, unit_price, ProductID, UserID))
        conn.commit()

        # Handle image updates
        if 'images' in request.files:
            images = request.files.getlist('images')
            image_paths = []
            for image in images:
                if image and allowed_file(image.filename):
                    filename = secure_filename(image.filename)
                    image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    image_paths.append(filename)

            # Update image paths in the database
            cursor.execute("UPDATE products SET images = %s WHERE product_id = %s", (json.dumps(image_paths), ProductID))
            conn.commit()

        # Fetch updated image paths from the database
        cursor.execute("SELECT images FROM products WHERE product_id = %s", (ProductID,))
        images_json = cursor.fetchone()[0]
        image_paths = json.loads(images_json)
        image_links = [url_for('uploaded_file', filename=os.path.basename(image_path), _external=True) for image_path in image_paths]

        cursor.close()
        conn.close()

        return jsonify({
            'message': 'Product updated successfully',
            'image_links': image_links
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/products/<int:UserID>/<int:ProductID>', methods=['DELETE'])
def delete_product(UserID, ProductID):
    try:
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Check if the user exists
        cursor.execute("SELECT * FROM users WHERE id = %s", (UserID,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Check if the product exists and belongs to the user
        cursor.execute("SELECT images FROM products WHERE product_id = %s AND user_id = %s", (ProductID, UserID))
        product = cursor.fetchone()
        if not product:
            return jsonify({'error': 'Product not found or does not belong to the user'}), 404

        # Delete images from the filesystem
        images_json = product[0]
        if images_json:
            image_paths = json.loads(images_json)
            for image_path in image_paths:
                full_path = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(image_path))
                if os.path.exists(full_path):
                    os.remove(full_path)

        # Execute the DELETE SQL query to remove the product
        cursor.execute("DELETE FROM products WHERE product_id = %s AND user_id = %s", (ProductID, UserID))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
#Get Stock Levels API:
# Route to get vendor stock levels
def connect_to_database():
    """Connect to the MySQL database and return the connection object."""
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

@app.route('/api/vendor/<int:vendorId>/stock', methods=['GET'])
def get_vendor_stock_levels(vendorId):
    try:
        conn = connect_to_database()
        if conn is None:
            return jsonify({'error': 'Failed to connect to database'}), 500

        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT product_id, product_name, quantity_available
            FROM products
            WHERE user_id = %s
        """, (vendorId,))
        products = cursor.fetchall()

        stock_levels = []
        for product in products:
            stock_status = "In Stock" if product['quantity_available'] >= 10 else "Alert: Low Stock"
            stock_levels.append({
                "productId": product['product_id'],
                "productName": product['product_name'],
                "currentStockLevel": product['quantity_available'],
                "stockStatus": stock_status
            })

        cursor.close()
        conn.close()

        return jsonify(stock_levels), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#Update Stock Quantity API
# Route to update vendor stock quantity
@app.route('/api/vendor/<int:vendorId>/stock/<int:productId>/<int:new_quantity>', methods=['PUT'])
def update_vendor_stock_quantity(vendorId, productId, new_quantity):
    try:
        if new_quantity < 0:
            return jsonify({'error': 'Quantity must be a non-negative integer'}), 400

        conn = connect_to_database()
        if conn is None:
            return jsonify({'error': 'Failed to connect to database'}), 500

        cursor = conn.cursor()

        cursor.execute("""
            SELECT quantity_available
            FROM products 
            WHERE product_id = %s AND user_id = %s
        """, (productId, vendorId))
        product = cursor.fetchone()
        if not product:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Product not found for the specified vendor'}), 404

        old_quantity = product[0]
        updated_quantity = old_quantity + new_quantity

        cursor.execute("""
            UPDATE products 
            SET quantity_available = %s 
            WHERE product_id = %s AND user_id = %s
        """, (updated_quantity, productId, vendorId))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Stock quantity updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
####################################### order management ##########################################

@app.route('/api/v1/orders/<int:user_id>/create', methods=['POST'])
def create_order_from_cart(user_id):
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Check if customer exists
        cursor.execute("SELECT * FROM customers WHERE id = %s", (user_id,))
        customer = cursor.fetchone()
        if not customer:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Customer not found'}), 404

        # Get cart items for customer
        cursor.execute("SELECT * FROM cart WHERE customer_id = %s", (user_id,))
        cart_items = cursor.fetchall()
        if not cart_items:
            cursor.close()
            conn.close()
            return jsonify({'error': 'No items in cart'}), 400

        # Get current date for order_date
        order_date = datetime.now().strftime('%Y-%m-%d')

        # Iterate over cart items and create orders
        for item in cart_items:
            product_id = item[2]  # Assuming 3rd column is product_id

            # Check if product_id exists in products table
            cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
            product = cursor.fetchone()
            if not product:
                cursor.close()
                conn.close()
                error_message = f"Product with ID {product_id} does not exist"
                return jsonify({'error': error_message}), 404

            # Product exists, retrieve the vendor ID associated with the product
            vendor_id = product[1]  # Assuming 2nd column is vendor_id

            # Insert order into orders table with vendor ID and order_date
            cursor.execute("""
                INSERT INTO orders 
                (user_id, order_date, vendor_id, product_id, quantity, total_price, order_status) 
                VALUES 
                (%s, %s, %s, %s, %s, %s, %s)
            """, (user_id, order_date, vendor_id, product_id, item[5], item[7], 'pending'))  # Assuming 6th column is quantity and 8th column is subtotal

            # Reduce the quantity available in the products table
            cursor.execute("""
                UPDATE products 
                SET quantity_available = quantity_available - %s 
                WHERE product_id = %s
            """, (item[5], product_id))  # Assuming 6th column in cart table is quantity

        # Clear cart
        cursor.execute("DELETE FROM cart WHERE customer_id = %s", (user_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Orders created successfully'}), 201

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    

#This endpoint retrieves all orders for a specific user
#API for the vendor order mgt get method
@app.route('/api/v1/orders/vendor/<int:vendor_id>', methods=['GET'])
def get_vendor_orders(vendor_id):
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Get orders for the vendor with customer name
        cursor.execute("""
            SELECT orders.order_id, orders.order_date, 
                   CONCAT(customers.first_name, ' ', customers.last_name) AS customer_name,
                   orders.total_price, orders.order_status
            FROM orders
            JOIN customers ON orders.user_id = customers.id
            JOIN products ON orders.product_id = products.product_id
            WHERE products.user_id = %s
        """, (vendor_id,))
        orders = cursor.fetchall()
        if not orders:
            cursor.close()
            conn.close()
            return jsonify({'message': 'No orders found for this vendor'}), 404

        # Format orders data
        order_list = []
        for order in orders:
            order_dict = {
                'order_id': order[0],             # order_id
                'order_date': order[1],           # order_date
                'customer_name': order[2],        # customer_name
                'total_price': order[3],          # total_price
                'order_status': order[4]          # order_status
            }
            order_list.append(order_dict)

        cursor.close()
        conn.close()

        return jsonify({'orders': order_list}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

#API for order mgt to get details using Vendor_id  and order id for vendors
@app.route('/api/v1/orders/vendor/<int:vendor_id>/<int:order_id>', methods=['GET'])
def get_vendor_order_with_product(vendor_id, order_id):  # Renamed function
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Get the specific order for the vendor with customer name and product details
        cursor.execute("""
            SELECT 
                orders.order_id, 
                orders.order_date, 
                CONCAT(customers.first_name, ' ', customers.last_name) AS customer_name,
                orders.total_price, 
                orders.order_status,
                products.product_name,
                products.description
            FROM orders
            JOIN customers ON orders.user_id = customers.id
            JOIN products ON orders.product_id = products.product_id
            WHERE products.user_id = %s AND orders.order_id = %s
        """, (vendor_id, order_id))
        order = cursor.fetchone()
        if not order:
            cursor.close()
            conn.close()
            return jsonify({'message': 'No order found for this vendor'}), 404

        # Format order data
        order_dict = {
            'order_id': order[0],            
            'order_date': order[1],           
            'customer_name': order[2],        
            'total_price': order[3],          
            'order_status': order[4],         
            'product_name': order[5],       
            'description': order[6]           
        }

        cursor.close()
        conn.close()

        return jsonify({'order': order_dict}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

############################################### ORDER MANAGEMENT ####################################
@app.route('/api/vendor/orders/<int:vendor_id>/<int:order_id>', methods=['GET'])
def get_vendor_order(vendor_id, order_id):
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Retrieve the order for the vendor
        cursor.execute("""
            SELECT order_id, user_id, product_id, quantity, total_price, 
                   payment_status, estimated_delivery, order_status, 
                   location, vendor_id 
            FROM orders 
            WHERE vendor_id = %s AND order_id = %s
        """, (vendor_id, order_id))
        order = cursor.fetchone()

        if not order:
            return jsonify({'message': 'Order not found for the vendor'}), 404

        # Prepare response body
        order_details = {
            'orderId': order[0],
            'customerId': order[1],         # user_id
            'productId': order[2],          # product_id
            'quantity': order[3],           # quantity
            'totalPrice': float(order[4]),  # total_price
            'paymentStatus': order[5],      # payment_status
            'estimatedDelivery': str(order[6]), # estimated_delivery
            'orderStatus': order[7],        # order_status
            'location': order[8],           # location
            'vendorId': order[9]            # vendor_id
        }

        # If payment status is 'paid', update order status to 'received'
        if order_details['paymentStatus'] == 'paid' and order_details['orderStatus'] != 'received':
            cursor.execute("UPDATE orders SET order_status = 'received' WHERE order_id = %s", (order_id,))
            conn.commit()
            order_details['orderStatus'] = 'received'

        cursor.close()
        conn.close()

        return jsonify(order_details), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API for Update Order Status by vendor
@app.route('/api/vendor/orders/<int:vendor_id>/<int:order_id>', methods=['PUT'])
def update_order_status(vendor_id, order_id):
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Extract the new order status from the request body
        order_status = request.json.get('orderStatus')

        if not order_status:
            return jsonify({'error': 'Missing orderStatus in request body'}), 400

        # Check if the order exists and belongs to the vendor
        cursor.execute("SELECT * FROM orders WHERE vendor_id = %s AND order_id = %s", (vendor_id, order_id))
        order = cursor.fetchone()
        if not order:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Order not found or does not belong to the vendor'}), 404

        # Update the order status in the orders table
        cursor.execute("""
            UPDATE orders 
            SET order_status = %s 
            WHERE vendor_id = %s AND order_id = %s
        """, (order_status, vendor_id, order_id))

        # Commit the changes
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Order status updated successfully'}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


#########################################Invoice and payment#############################################
# API for retrieving invoices[Get Invoices API]
@app.route('/api/vendor/invoices', methods=['GET'])
def retrieve_invoices():
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Retrieve invoices data from orders table
        cursor.execute("""
            SELECT o.invoice_id, o.order_id, o.user_id, o.total_price, o.payment_status,
                   c.first_name, c.last_name,
                   p.product_name, p.description
            FROM orders o
            JOIN customers c ON o.user_id = c.id
            JOIN products p ON o.product_id = p.product_id
        """)
        invoices_data = cursor.fetchall()

        # Prepare response body
        invoices = []
        for invoice_data in invoices_data:
            invoice = {
                'invoiceId': str(invoice_data[0]),
                'orderId': str(invoice_data[1]),
                'customerName': f"{invoice_data[5]} {invoice_data[6]}",  # Concatenate first_name and last_name
                'productDetails': invoice_data[7],  # Assuming product_name is the productDetails
                'totalAmount': float(invoice_data[3]),  # Assuming total_price is the totalAmount
                'paymentStatus': invoice_data[4]
            }
            invoices.append(invoice)

        cursor.close()
        conn.close()

        return jsonify(invoices), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500







@app.route('/api/vendor/invoices/<int:invoice_id>', methods=['PUT'])
def update_payment_status(invoice_id):
    try:
        status = request.json.get('status')  # Get status from request body
        if not status:
            return jsonify({'error': 'Status is required in request body'}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("SELECT payment_status FROM orders WHERE invoice_id = %s", (invoice_id,))
        order = cursor.fetchone()
        if not order:
            return jsonify({'error': 'Invoice not found'}), 404
        if order[0] == '':
            return jsonify({'error': 'Payment for this invoice has already been processed'}), 400

        cursor.execute("""
            UPDATE orders 
            SET payment_status = %s 
            WHERE invoice_id = %s
        """, (status, invoice_id))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Payment status updated successfully'}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "_main_":
    app.run(debug=True)
