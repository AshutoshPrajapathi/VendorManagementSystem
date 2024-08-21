from flask import Flask, jsonify, request, url_for, send_from_directory
import mysql.connector
import os
import random
from flask import Flask, render_template
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

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
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

@app.route('/api/v1/cart/<int:customer_id>', methods=['POST'])
def add_to_cart(customer_id):
    try:
        data = request.json
        product_id = data.get('product_id')
        quantity = data.get('quantity')
        
        if not product_id or not quantity:
            return jsonify({'error': 'Product ID and quantity are required'}), 400
        
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Check if customer exists
        cursor.execute("SELECT * FROM customers WHERE id = %s", (customer_id,))
        customer = cursor.fetchone()
        if not customer:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Customer not found'}), 404
        
        # Check if product exists
        cursor.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
        product = cursor.fetchone()
        if not product:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if quantity is available
        quantity_available = product[4]  # Assuming 5th column is quantity_available
        if quantity > quantity_available:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Quantity not available'}), 400
        
        # Calculate subtotal
        unit_price = product[5]  # Assuming 6th column is unit_price
        subtotal = unit_price * quantity
        
        # Add product to cart
        cursor.execute(
            "INSERT INTO cart (customer_id, product_id, product_name, product_image, quantity, price, subtotal) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (customer_id, product_id, product[2], product[6], quantity, unit_price, subtotal)
        )
        
        # Update quantity available in products table
        cursor.execute(
            "UPDATE products SET quantity_available = quantity_available - %s WHERE product_id = %s",
            (quantity, product_id)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Product added to cart successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Example of serving HTML for 404 Not Found page
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

    
@app.route('/api/v1/cart/<int:customer_id>', methods=['GET'])
def view_cart(customer_id):
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Check if customer exists
        cursor.execute("SELECT * FROM customers WHERE id = %s", (customer_id,))
        customer = cursor.fetchone()
        if not customer:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Customer not found'}), 404
        
        # Get cart items for customer
        cursor.execute("SELECT * FROM cart WHERE customer_id = %s", (customer_id,))
        cart_items = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Convert cart items to JSON format
        cart_list = []
        for item in cart_items:
            cart_list.append({
                'id': item[0],
                'product_id': item[2],
                'product_name': item[3],
                'product_image': item[4],
                'quantity': item[5],
                'price': item[6],
                'subtotal': item[7]
            })
        
        return jsonify({'cart_items': cart_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/cart/<int:customer_id>/<int:cart_item_id>', methods=['PUT'])
def update_cart_item(customer_id, cart_item_id):
    try:
        data = request.json
        quantity = data.get('quantity')
        
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Check if customer exists
        cursor.execute("SELECT * FROM customers WHERE id = %s", (customer_id,))
        customer = cursor.fetchone()
        if not customer:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Customer not found'}), 404
        
        # Check if cart item exists
        cursor.execute("SELECT * FROM cart WHERE id = %s AND customer_id = %s", (cart_item_id, customer_id))
        cart_item = cursor.fetchone()
        if not cart_item:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Cart item not found'}), 404
        
        # Check if product exists
        cursor.execute("SELECT * FROM products WHERE product_id = %s", (cart_item[2],))
        product = cursor.fetchone()
        if not product:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if quantity is available
        if quantity > product[4]:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Quantity not available'}), 400
        
        # Update quantity and subtotal of cart item
        subtotal = product[5] * quantity
        cursor.execute(
            "UPDATE cart SET quantity = %s, subtotal = %s WHERE id = %s AND customer_id = %s",
            (quantity, subtotal, cart_item_id, customer_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Cart item updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/cart/<int:customer_id>/<int:cart_item_id>', methods=['DELETE'])
def remove_cart_item(customer_id, cart_item_id):
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Check if customer exists
        cursor.execute("SELECT * FROM customers WHERE id = %s", (customer_id,))
        customer = cursor.fetchone()
        if not customer:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Customer not found'}), 404
        
        # Check if cart item exists
        cursor.execute("SELECT * FROM cart WHERE id = %s AND customer_id = %s", (cart_item_id, customer_id))
        cart_item = cursor.fetchone()
        if not cart_item:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Cart item not found'}), 404
        
        # Remove cart item
        cursor.execute("DELETE FROM cart WHERE id = %s AND customer_id = %s", (cart_item_id, customer_id))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Cart item removed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

########################################################## Orders and Checkout #############################################################

# API endpoint to create orders from customer's cart
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

   

#This endpoint retrieves all orders for a specific user means customers

@app.route('/api/v1/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Get orders for the user with customer name
        cursor.execute("""
            SELECT orders.order_id, orders.order_date, 
                   CONCAT(customers.first_name, ' ', customers.last_name) AS customer_name,
                   orders.total_price, orders.order_status
            FROM orders
            JOIN customers ON orders.user_id = customers.id
            WHERE orders.user_id = %s
        """, (user_id,))
        orders = cursor.fetchall()
        if not orders:
            cursor.close()
            conn.close()
            return jsonify({'message': 'No orders found for this user'}), 404

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
    
#API for order mgt to get details using vendorid and order id for vendors

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
            'order_id': order[0],             # order_id
            'order_date': order[1],           # order_date
            'customer_name': order[2],        # customer_name
            'total_price': order[3],          # total_price
            'order_status': order[4],         # order_status
            'product_name': order[5],         # product_name
            'description': order[6]           # description
        }

        cursor.close()
        conn.close()

        return jsonify({'order': order_dict}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500




#API for order mgt to get details using customer and order id for customers

@app.route('/api/v1/orders/<int:user_id>/<int:order_id>', methods=['GET'])
def get_user_order_with_product(user_id, order_id):  # Renamed function
    try:
        # Establish database connection
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Get the specific order for the user with customer name and product details
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
            WHERE orders.user_id = %s AND orders.order_id = %s
        """, (user_id, order_id))
        order = cursor.fetchone()
        if not order:
            cursor.close()
            conn.close()
            return jsonify({'message': 'No order found for this user'}), 404

        # Format order data
        order_dict = {
            'order_id': order[0],             # order_id
            'order_date': order[1],           # order_date
            'customer_name': order[2],        # customer_name
            'total_price': order[3],          # total_price
            'order_status': order[4],         # order_status
            'product_name': order[5],         # product_name
            'description': order[6]           # description
        }

        cursor.close()
        conn.close()

        return jsonify({'order': order_dict}), 200

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500