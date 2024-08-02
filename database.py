import sqlite3
import json

class Database:
    def __init__(self):
        self.con = sqlite3.connect('budget.db', check_same_thread=False)
        self.cursor = self.con.cursor()
        self.create_budgets_table()

    def create_budgets_table(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS budgets("
                            "id INTEGER PRIMARY KEY, "
                            "userid INTEGER NOT NULL, "
                            "budget TEXT)")

        self.con.commit()

    def create_budget(self, userid, budget):
        self.cursor.execute("INSERT INTO budgets(userid, budget) "
                            "VALUES(?, ?)", (userid, budget))
        self.con.commit()

    def get_budget(self, id):
        # Todo: Will need to query all budgets under userid
        budget = self.cursor.execute("SELECT * "
                            "FROM budgets "
                            "WHERE id=?", (id,)).fetchall()

        return budget[0]

    def get_all_budgets(self):
        budget = self.cursor.execute("SELECT * "
                                     "FROM budgets").fetchall()
        return budget

    def update_budget(self, id, budget):
        self.cursor.execute("UPDATE budgets "
                            "SET budget=? "
                            "WHERE id=?", (budget, id))
        self.con.commit()

if __name__ == "__main__":
    db = Database()
    lists_of_items = {
        "items": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7"],
        "dates": [],
        "amount": [200.00, 10.30, -50.18, -25.00, 600.00, -150.00, 200.00]
    }


    #db.create_budget(1, json.dumps(lists_of_items))
    print(db.get_all_budgets())