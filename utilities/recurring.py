from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


def get_recurring_dates(start_date, frequency):
    """Generates a list of dates based on the frequency. Only generates dates to the end of the current year
        2 = Weekly
        3 = Bi-Weekly
        4 = Monthly

    """
    date_list = [start_date]
    start_date = datetime.strptime(start_date, "%m/%d/%Y")
    end_of_year = datetime.now().replace(month=12, day=31)

    if frequency == 2:  # Weekly
        delta = (end_of_year - start_date).days
        weeks = delta // 7

        for week in range(weeks):
            prev_date = datetime.strptime(date_list[-1], "%m/%d/%Y")
            new_date = datetime.strftime((prev_date + timedelta(weeks=1)), "%m/%d/%Y")
            date_list.append(new_date)

        return date_list
    elif frequency == 3:
        delta = (end_of_year - start_date).days
        weeks = delta // 7

        for week in range(weeks):
            prev_date = datetime.strptime(date_list[-1], "%m/%d/%Y")
            new_date = datetime.strftime((prev_date + timedelta(weeks=2)), "%m/%d/%Y")
            date_list.append(new_date)

        return date_list
    elif frequency == 4:    #Monthly
        delta = (end_of_year.month - start_date.month)

        for month in range(delta):
            prev_date = datetime.strptime(date_list[-1], "%m/%d/%Y")
            new_date = datetime.strftime((prev_date + relativedelta(months=1)), "%m/%d/%Y")
            date_list.append(new_date)

        return date_list


def add_recurring_items(budget_dict):
    """Takes the budget dictionary and the list of recurring dates to identify where the recurring values
    insert into the budget
    """
    # make a copy of the budget_dict removing the last item. This would be the new item added
    new_budget = {
        'item_id': budget_dict['item_id'][:-1],
        'items': budget_dict['items'][:-1],
        'amount': budget_dict['amount'][:-1],
        'dateDue': budget_dict['dateDue'][:-1],
        'recurring': budget_dict['recurring'][:-1],
        'category': budget_dict['category'][:-1],
        'isPaid': budget_dict['isPaid'][:-1]
    }

    recurring_dates = get_recurring_dates(budget_dict['dateDue'][-1], budget_dict['recurring'][-1])
    # track a list of positions item was added to

    budget_dates = new_budget['dateDue'].copy()
    print("Budget Dates: ", budget_dates)
    for re_idx, r_date in enumerate(recurring_dates):
        if len(budget_dates) == 0:
            budget_dates.append(r_date)

            new_budget['item_id'].append(budget_dict['item_id'][0])
            new_budget['items'].append(budget_dict['items'][0])
            new_budget['amount'].append(budget_dict['amount'][0])
            new_budget['dateDue'].append(r_date)
            new_budget['recurring'].append(budget_dict['recurring'][0])
            new_budget['category'].append(budget_dict['category'][0])
            new_budget['isPaid'].append(budget_dict['isPaid'][0])
        else:
            for idx, budget_date in enumerate(budget_dates):
                if idx < len(budget_dates)-1:
                    rec_date = datetime.strptime(r_date, '%m/%d/%Y')
                    bud_date = datetime.strptime(budget_date, '%m/%d/%Y')
                    next_bud_date = datetime.strptime(budget_dates[idx+1], '%m/%d/%Y')

                    if idx == 0 and rec_date < bud_date:
                        budget_dates.insert((idx), r_date)
                        # insert values into the new budget dictionary
                        new_budget['item_id'].insert((idx), budget_dict['item_id'][-1])
                        new_budget['items'].insert((idx), budget_dict['items'][-1])
                        new_budget['amount'].insert((idx), budget_dict['amount'][-1])
                        new_budget['dateDue'].insert((idx), r_date)
                        new_budget['recurring'].insert((idx), budget_dict['recurring'][-1])
                        new_budget['category'].insert((idx), budget_dict['category'][-1])
                        new_budget['isPaid'].insert((idx), budget_dict['isPaid'][-1])
                        break

                    if bud_date <= rec_date < next_bud_date:
                        budget_dates.insert((idx+1), r_date)
                        # insert values into the new budget dictionary
                        new_budget['item_id'].insert((idx+1), budget_dict['item_id'][-1])
                        new_budget['items'].insert((idx+1), budget_dict['items'][-1])
                        new_budget['amount'].insert((idx+1), budget_dict['amount'][-1])
                        new_budget['dateDue'].insert((idx+1), r_date)
                        new_budget['recurring'].insert((idx+1), budget_dict['recurring'][-1])
                        new_budget['category'].insert((idx+1), budget_dict['category'][-1])
                        new_budget['isPaid'].insert((idx+1), budget_dict['isPaid'][-1])
                        break

                else:
                    budget_dates.append(r_date)

                    new_budget['item_id'].append(budget_dict['item_id'][-1])
                    new_budget['items'].append(budget_dict['items'][-1])
                    new_budget['amount'].append(budget_dict['amount'][-1])
                    new_budget['dateDue'].append(r_date)
                    new_budget['recurring'].append(budget_dict['recurring'][-1])
                    new_budget['category'].append(budget_dict['category'][-1])
                    new_budget['isPaid'].append(budget_dict['isPaid'][-1])
                    break


    pos_list = [x for x in range(len(new_budget['item_id'])) if new_budget['item_id'][x] == budget_dict['item_id'][-1] ]

    print(new_budget)
    print(pos_list)
    return new_budget, pos_list

if __name__ == "__main__":
    print(get_recurring_dates("08/20/2024", 3))