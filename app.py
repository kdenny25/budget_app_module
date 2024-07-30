from flask import Flask, request, render_template, url_for, redirect, flash, session
import json

app = Flask(__name__)

@app.route('/')
def index():  # put application's code here
    lists_of_items = {
        "items": ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7'],
        "amount": [200.00, 10.30, -50.18, -25.00, 600.00, -150.00, 200.00]
    }

    return render_template('budget.html', items=lists_of_items)

@app.route('/receive_expense_list', methods=['POST'])
def receive_expense_list():
    expenses = request.form.getlist('expenses[]')

    print(expenses)
    return json.dumps({'status': 'Success'})

if __name__ == '__main__':
    app.run()