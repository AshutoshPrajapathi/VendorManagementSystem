from flask import Flask, request, jsonify, send_file
import mysql.connector
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database Configuration
db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'aecearthwebapp'
}

# Your route definitions and database operations here

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


if __name__ == '_main_':
    app.run(debug=True)