from .dbase import db
from flask_security import UserMixin, RoleMixin

roles_users = db.Table('roles_users', db.Column('user_id',db.Integer(),db.ForeignKey('auth.id')),db.Column('role_id',db.Integer(),db.ForeignKey('role.id')))
class User(db.Model,UserMixin):
	__tablename__ = 'auth'
	id =db.Column(db.Integer, autoincrement=True, primary_key=True)
	username= db.Column(db.String, unique=True)
	email = db.Column(db.String, unique=True)	
	password= db.Column(db.String(255))
	fs_uniquifier= db.Column(db.String(255), unique=True, nullable=False)  
	active=db.Column(db.Boolean()) 	
	whooks = db.Column(db.String)
	log_flag =db.Column(db.Integer)
	roles=db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))

class Role(db.Model,RoleMixin):
	__tablename__ = 'role'
	id =db.Column(db.Integer, autoincrement=True, primary_key=True)
	name= db.Column(db.String, unique=True)
	description = db.Column(db.String(255))	

class trackers(db.Model):
	__tablename__ = 'trackers'
	id =db.Column(db.Integer, autoincrement=True, primary_key=True)
	name= db.Column(db.String,nullable=False)	
	desc= db.Column(db.String)	
	ttype= db.Column(db.String,nullable=False)	
	uid= db.Column(db.Integer, db.ForeignKey("auth.id"), nullable=False)
	options=db.Column(db.String)
	last_update=db.Column(db.String)


	def json_out(self):
		return {
			'id': self.id,
			'name':  self.name, 
			'uid': self.uid, 
			'desc': self.desc, 
			'ttype': self.ttype, 
			'options': self.options,
			'last_update': self.last_update
		}
		
class logs(db.Model):
	
	__tablename__ = 'logs'
	id =db.Column(db.Integer, autoincrement=True, primary_key=True)
	tid= db.Column(db.Integer, db.ForeignKey("trackers.id"), nullable=False)
	time= db.Column(db.String, nullable=False)
	value= db.Column(db.String,nullable=False)
	notes= db.Column(db.String)

	def json_out(self):
		return {
			'id': self.id,
			'time':  self.time, 
			'value': self.value, 
			'notes': self.notes, 
			'tid': self.tid, 
		}
    

class dummy(db.Model):
    __tablename__ = 'dummy'
    f1 =db.Column(db.Integer, primary_key=True)
    f2= db.Column(db.String)
    f3= db.Column(db.String)
