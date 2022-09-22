from application.workers import celery
from application.dbase import db
from application.models import trackers, logs, User
from application.config import mailConfig
import csv 
import requests
from celery.schedules import crontab
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import math
from jinja2 import Template, Environment, FileSystemLoader

def format_message(template_file, data):
    environment = Environment(loader=FileSystemLoader("templates/"))
    template = environment.get_template(template_file)
    return template.render(data)

@celery.task()
def expt(id1):
    print("IvvvvvvSIDE TASK")
    print(id1)
    record = db.session.query(trackers).filter(trackers.uid == id1).all()
    print(record)
    print("hahaha")
    f = open('export.csv', 'w')
    out = csv.writer(f)
    out.writerow(['name', 'desc', 'last_update'])
    for item in record:
        out.writerow([item.name, item.desc, item.last_update])
    f.close()

@celery.task()
def exptlog(tid):
    print("IvvvvvvSIDE TASK")
    print(tid)
    record = db.session.query(logs).filter(logs.tid == tid).all()
    print(record)
    print("hahaha")
    f = open('export1.csv', 'w')
    out = csv.writer(f)
    out.writerow(['time', 'value', 'notes'])
    for item in record:
        out.writerow([item.time, item.value, item.notes])
    f.close()

@celery.task()
def testfunc():
    print(" \(^o^)/")

@celery.task()
def reminder():
    print("entering for")
    record = db.session.query(User).filter(User.whooks != None).all()
    print(record)
    for i in record:
        if i.log_flag != 1:
            url = i.whooks
            payload = { 'text': 'You did not log any event today!'}
            r = requests.post(url, json=payload)
            print(r.text)

@celery.task()
def flag_clear():
    record = db.session.query(User).filter(User.whooks != None).all()
    for i in record:
        i.log_flag = 0
    db.session.commit()

@celery.task()
def send_email():
    
    rec_u = db.session.query(User).all()
    for r in rec_u:
        tlist=[]
        vlist=[]
        rec_t = db.session.query(trackers).filter(trackers.uid == r.id).all()
        nl =0
        nt=0
        for t in rec_t:
            tlist.append(t.name)
            rec_l = db.session.query(logs).filter(logs.tid == t.id).all()
            nl += len(rec_l)
            if t.ttype == 1 or t.ttype == 3:
                count=0
                for l in rec_l:
                    count =count+ float(l.value)
                    round(count,1)
                try:
                    count = float(count/len(rec_l))

                    count = math.trunc(count*100)/100
                except:
                    pass
                print(count)
                vlist.append(count)
            if t.ttype == 2:
                lt = []
                for l in rec_l:
                    lt.append(l.value)
                vmode= "NA"
                try:
                    vmode = max(set(lt), key=lt.count)
                except:
                    pass
                print(vmode)
                vlist.append(vmode)
        print(tlist)
        print(vlist) 
        a =zip(tlist,vlist)
        print(a)
        nt = len(rec_t)
        
        user =  r.email

        data = { "nt" : nt, "nl": nl, "user": user, "records": a}
        msg = MIMEMultipart()
        msg["From"] = mailConfig.SENDER_ADDRESS
        msg["To"] = r.email
        msg["Subject"] ="Monthly report"

        _msg = format_message("test2.html", data=data)
        msg.attach(MIMEText(_msg, "html"))
        s = smtplib.SMTP(host= mailConfig.SMTP_SERVER_HOST, port= mailConfig.SMTP_SERVER_PORT)
        s.login(mailConfig.SENDER_ADDRESS,mailConfig.SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()

@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute=45, hour=21), testfunc.s())
    sender.add_periodic_task(
        crontab(minute=30, hour=18), reminder.s())
    sender.add_periodic_task(
        crontab(minute=0, hour=0), flag_clear.s())
    sender.add_periodic_task(
        crontab(minute=0, hour=12, day= 30), send_email.s())



