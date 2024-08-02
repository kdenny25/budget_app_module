from flask import Flask, request, render_template, url_for, redirect, flash, session
import json
from database import Database

db = Database()

app = Flask(__name__)

# lists_of_items = {
#     "items": ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7'],
#     "dates": [],
#     "amount": [200.00, 10.30, -50.18, -25.00, 600.00, -150.00, 200.00]
# }

@app.route('/')
def index():  # put application's code here
    budget = db.get_budget(5)
    lists_of_items = json.loads(budget[2])
    return render_template('budget.html', items=lists_of_items)

@app.route('/receive_expense_list', methods=['POST'])
def receive_expense_list():
    expenses = request.form.getlist('item_names[]')
    item_amounts = request.form.getlist('item_amounts[]')

    print(expenses)
    print(item_amounts)
    return json.dumps({'status': 'Success'})

@app.route('/add_item', methods=['POST'])
def add_item():
    item_names = request.form.getlist('item_names[]')
    item_amounts = request.form.getlist('item_amounts[]')

    item_amounts = [float(x) for x in item_amounts]
    lists_of_items = {}
    lists_of_items['items'] = item_names
    lists_of_items['amount'] = item_amounts

    db.update_budget(5, json.dumps(lists_of_items))
    print(session.keys())
    return redirect('/')


if __name__ == '__main__':
    app.run()