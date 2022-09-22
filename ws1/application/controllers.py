from random import expovariate
from flask import Flask, render_template, request
from flask import redirect
from flask_security import login_required, current_user, auth_required
from flask import current_app as app
from application import tasks


@app.route("/", methods=["GET","POST"])
def random():
	if(current_user.is_authenticated):
		print("test")
		if request.method == "GET":
			return render_template("test.html")		
	else:
		return redirect("/login")	


#@login_required
@app.route("/expall", methods=["GET","POST"])

def hello_user():
	id=  current_user.id
	job = tasks.expt.delay(id)

	return str(job), 200


@app.route("/exptracker/<tid>", methods=["GET","POST"])

def explogs(tid):
	#id=  current_user.id
	job = tasks.exptlog.delay(tid)

	return str(job), 200

@app.route("/login", methods=["GET","POST"])
def whatever():
	if request.method == "GET":
		return render_template("login.html")	


