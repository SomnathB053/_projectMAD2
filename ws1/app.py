
from flask import Flask, render_template, request
from flask_security import UserMixin, RoleMixin, Security, SQLAlchemySessionUserDatastore, SQLAlchemyUserDatastore, login_required
from flask_sqlalchemy import SQLAlchemy
from flask import redirect
from flask_restful import Resource, Api
from application.config import LocalDevelopmentConfig
from application.dbase import db
from application.models import User, Role
from application.api import User_API, trackerAPI, logAPI
from application import workers

app = Flask(__name__, template_folder="templates")
app.config.from_object(LocalDevelopmentConfig)
db.init_app(app)
api= Api(app)
app.app_context().push()
user_datastore= SQLAlchemySessionUserDatastore(db.session, User,Role)
security = Security(app, user_datastore)




celery = workers.celery   
celery.conf.update(
	broker_url = app.config["CELERY_BROKER_URL"],
	result_backend = app.config["CELERY_RESULT_BACKEND"]
)
celery.Task = workers.ContextTask


api.add_resource(User_API, "/api/user")
api.add_resource(trackerAPI, "/api/tracker/<uID>","/api/tracker/delete/<tID>", "/api/tracker")
api.add_resource(logAPI, "/api/log", "/api/log/delete/<lid>", "/api/log/<tid>")


from application.controllers import *
'''
@app.route("/", methods=["GET","POST"])
@login_required
def random():
	if request.method == "GET":
		return render_template("test.html")		
	elif request.method == "POST":
		return redirect("/home")

	

@app.route("/home", methods=["GET"])
def sign_in():
	if request.method == "GET":
		return render_template("test2.html")		
	
from application.api import User_API
api.add_resource(User_API, "/api/<user>", "/api")
'''


if __name__ == '__main__':
    app.debug=True
    app.run()