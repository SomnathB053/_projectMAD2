from flask_sqlalchemy import SQLAlchemy
from flask import redirect
from application.dbase import db
from application.models import dummy, trackers, logs, User
from application.config import LocalDevelopmentConfig


def f():
    record = db.session.query(User).filter(User.whooks != None).all()
    for i in record:
        i.log_flag = 0
    db.session.commit()

if __name__ == '__main__':
    f()