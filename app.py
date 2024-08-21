from flask import Flask, request, render_template, redirect, session, jsonify
import json
from database import Database
from utilities.lists import recurring, categories, category_label, recurring_labels
from utilities.color_scheme import color_scheme
from utilities.recurring import add_recurring_items
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
        "rec_labels": recurring_labels,
        "categories": categories,
        "cat_labels": category_label
    }
    print(lists_of_items)
    return render_template('budget.html', items=lists_of_items, select_lists=select_lists, color_scheme=color_scheme, today_date=today_date)

@app.route('/add_to_budget/<pos>')
def add_to_budget(pos):
    budget = db.get_budget(current_user)
    lists_of_items = json.loads(budget[2])
    pos = int(pos)
    item_amount = float(lists_of_items['amount'][pos])

    item_information = {
        'item_id': lists_of_items['item_id'][pos],
        "item": lists_of_items['items'][pos],
        "amount": item_amount,
        "dateDue": lists_of_items['dateDue'][pos],
        "recurring": lists_of_items['recurring'][pos],
        "category": lists_of_items['category'][pos],
        "isPaid": lists_of_items['isPaid'][pos],
        "index": ((len(lists_of_items['items'])-1) if pos == (-1) else pos)
    }

    select_lists = {
        "recurring": recurring,
        "rec_labels": recurring_labels,
        "categories": categories,
        "cat_labels": category_label
    }

    return render_template('components/budget_item.html', item=item_information, color_scheme=color_scheme, select_lists=select_lists)

@app.route('/get_full_budget')
def get_full_budget():
    budget = db.get_budget(current_user)
    lists_of_items = json.loads(budget[2])

    full_template = ""

    for i in range(len(lists_of_items['items'])):
        item_amount = float(lists_of_items['amount'][i])

        item_information = {
            'item_id': lists_of_items['item_id'][i],
            "item": lists_of_items['items'][i],
            "amount": item_amount,
            "dateDue": lists_of_items['dateDue'][i],
            "recurring": lists_of_items['recurring'][i],
            "category": lists_of_items['category'][i],
            "isPaid": lists_of_items['isPaid'][i],
            "index": i
        }

        select_lists = {
            "recurring": recurring,
            "rec_labels": recurring_labels,
            "categories": categories,
            "cat_labels": category_label
        }

        full_template += ''.join(render_template('components/budget_item.html', item=item_information, color_scheme=color_scheme, select_lists=select_lists))

    return full_template


@app.route('/update_item', methods=['POST'])
def update_item():
    item_ids = request.form.getlist('item_ids[]')
    item_names = request.form.getlist('item_names[]')
    item_amounts = request.form.getlist('item_amounts[]')
    item_categories = request.form.getlist('item_categories[]')
    item_dates = request.form.getlist('item_dates[]')
    item_recurrings = request.form.getlist('item_recurrings[]')
    item_paid = request.form.getlist('item_paid[]')

    item_amounts = [float(x) for x in item_amounts]
    item_categories = [int(x) for x in item_categories]
    item_recurrings = [int(x) for x in item_recurrings]
    item_ids = [int(x) for x in item_ids]

    pos_list = []

    lists_of_items = {
        'item_id': item_ids,
        'items': item_names,
        'amount': item_amounts,
        'dateDue': item_dates,
        'recurring': item_recurrings,
        'category': item_categories,
        'isPaid': item_paid
    }

    result = "complete"
    # if fewer item id's exist than item_names then a new item was added
    if len(item_ids) == 0 and len(item_names) == 1:
        lists_of_items['item_id'] = [1]
    elif len(item_ids) < len(item_names):
        new_id = (list(set(item_ids))[-1]) + 1
        lists_of_items['item_id'].append(new_id)

        if item_recurrings[-1] > 1:
            lists_of_items, pos_list = add_recurring_items(lists_of_items)
            result = "refresh"

    print(lists_of_items)
    db.update_budget(current_user, json.dumps(lists_of_items))

    return jsonify(result=result, poslist=pos_list)


if __name__ == '__main__':
    app.run()