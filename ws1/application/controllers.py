from flask import Flask, render_template, request
from flask import redirect
from flask_security import login_required
from flask import current_app as app
from application import tasks


@app.route("/", methods=["GET","POST"])
@login_required
def random():
	if request.method == "GET":
		return render_template("test.html")		
	elif request.method == "POST":
		return redirect("/home")


@app.route("/hello/<user_name>", methods=["GET","POST"])
def hello_user(user_name):
	job = tasks.hello.delay(user_name)

	return str(job), 200