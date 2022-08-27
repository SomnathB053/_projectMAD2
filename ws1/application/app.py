
from flask import Flask, render_template, request
#from flask_security import UserMixin, RoleMixin, Security, SQLAlchemySessionUserDatastore, SQLAlchemyUserDatastore, login_required
from flask_sqlalchemy import SQLAlchemy
from flask import redirect
from config import LocalDevelopmentConfig
from dbase import db


app = Flask(__name__, template_folder="templates")
app.config.from_object(LocalDevelopmentConfig)
db.init_app(app)
app.app_context().push()
#user_datastore= SQLAlchemySessionUserDatastore(db.session, User,Role)
#security = Security(app, user_datastore)



@app.route("/", methods=["GET","POST"])
#@login_required
def random():
	if request.method == "GET":
		return render_template("test.html")		
	elif request.method == "POST":
		return redirect("/home")

	

@app.route("/home", methods=["GET"])
def sign_in():
	if request.method == "GET":
		return render_template("test2.html")		
	
if __name__ == '__main__':
    app.debug=True
    app.run()