from flask import Flask, request, render_template, redirect, session, jsonify
import json
from database import Database
from utilities.lists import recurring, categories, category_label
from utilities.color_scheme import color_scheme
from datetime import datetime

db = Database()

app = Flask(__name__)

current_user = 5

@app.route('/')
def index():  # put application's code here
    budget = db.get_budget(current_user)
    lists_of_items = json.loads(budget[2])

    today_date = datetime.today().strftime('%m/%d/%Y')

    item_amounts = [float(x) for x in lists_of_items['amount']]
    item_category = [int(x) for x in lists_of_items['category']]
    item_recurring = [int(x) for x in lists_of_items['recurring']]
    lists_of_items['amount'] = item_amounts
    lists_of_items['category'] = item_category
    lists_of_items['recurring'] = item_recurring

    select_lists = {
        "recurring": recurring,
        "categories": categories,
        "cat_labels": category_label
    }
    print(lists_of_items)
    return render_template('budget.html', items=lists_of_items, select_lists=select_lists, color_scheme=color_scheme, today_date=today_date)

@app.route('/add_to_budget')
def add_to_budget():
    budget = db.get_budget(current_user)
    lists_of_items = json.loads(budget[2])

    item_amount = float(lists_of_items['amount'][-1])

    item_information = {
        "item": lists_of_items['items'][-1],
        "amount": item_amount,
        "dateDue": lists_of_items['dateDue'][-1],
        "recurring": lists_of_items['recurring'][-1],
        "category": lists_of_items['category'][-1],
        "isPaid": lists_of_items['isPaid'][-1],
        "index": (len(lists_of_items['items'])-1)
    }

    select_lists = {
        "recurring": recurring,
        "categories": categories,
        "cat_labels": category_label
    }

    return render_template('components/budget_item.html', item=item_information, select_lists=select_lists)

@app.route('/receive_expense_list', methods=['POST'])
def receive_expense_list():
    item_names = request.form.getlist('item_names[]')
    item_amounts = request.form.getlist('item_amounts[]')
    item_categories = request.form.getlist('item_categories[]')
    item_dates = request.form.getlist('item_dates[]')
    item_recurrings = request.form.getlist('item_recurrings[]')
    item_paid = request.form.getlist('item_paid[]')

    item_amounts = [float(x) for x in item_amounts]
    item_categories = [int(x) for x in item_categories]
    item_recurrings = [int(x) for x in item_recurrings]

    lists_of_items = {
        'items': item_names,
        'amount': item_amounts,
        'dateDue': item_dates,
        'recurring': item_recurrings,
        'category': item_categories,
        'isPaid': item_paid
    }

    db.update_budget(current_user, json.dumps(lists_of_items))
    print(item_names)
    print(item_amounts)
    return json.dumps({'status': 'Success'})

@app.route('/update_item', methods=['POST'])
def update_item():
    item_names = request.form.getlist('item_names[]')
    item_amounts = request.form.getlist('item_amounts[]')
    item_categories = request.form.getlist('item_categories[]')
    item_dates = request.form.getlist('item_dates[]')
    item_recurrings = request.form.getlist('item_recurrings[]')
    item_paid = request.form.getlist('item_paid[]')

    item_amounts = [float(x) for x in item_amounts]
    item_categories = [int(x) for x in item_categories]
    item_recurrings = [int(x) for x in item_recurrings]

    lists_of_items = {
        'items': item_names,
        'amount': item_amounts,
        'dateDue': item_dates,
        'recurring': item_recurrings,
        'category': item_categories,
        'isPaid': item_paid
    }


    print(lists_of_items)
    db.update_budget(current_user, json.dumps(lists_of_items))

    return jsonify(result='complete')


if __name__ == '__main__':
    app.run()