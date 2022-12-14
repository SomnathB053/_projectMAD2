from flask_restful import Resource
from flask_restful import reqparse, request
from application.dbase import db
from application.models import dummy, trackers, logs, User
from flask_restful import fields, marshal_with
from flask_security import login_required, auth_required
from flask import jsonify
from flask_login import current_user
'''
output_fields= {
    "id": fields.Integer,
    "user": fields.String,
    "data": fields.String
}'''

tracker_parser= reqparse.RequestParser()
#tracker_parser.add_argument('id')
tracker_parser.add_argument('name')
tracker_parser.add_argument('uid')
tracker_parser.add_argument('desc')
tracker_parser.add_argument('ttype')
tracker_parser.add_argument('options')
tracker_parser.add_argument('last_update')


log_parser= reqparse.RequestParser()
#tracker_parser.add_argument('id')
log_parser.add_argument('tid')
log_parser.add_argument('value')
log_parser.add_argument('notes')
log_parser.add_argument('time')





class User_API(Resource):
    #@login_required
    @auth_required("token")
    def get(self):

        return {"uid": current_user.id, "email": current_user.email}
    def put(self):
        pass
    def delete(self):
        pass
    def post(self):
        req = request.get_json()
        print(db.session.query(User). filter(User.id == 2).one().whooks)
        record = db.session.query(User).filter(User.id == current_user.id).one()
        try:
            record.whooks = req["whooks"]
            db.session.commit()
        except: db.session.rollback()
        return req

class trackerAPI(Resource):
    #@login_required
    @auth_required("token")
    def get(self, uID):
        record = db.session.query(trackers).filter(trackers.uid == uID).all()
        #return { "id":record[0].id, "name":  record[0].name, "uid": record[0].uid, "desc": record[0].desc, "ttype": record[0].ttype, "options": record[0].options }
        #will actually return json of all trackers
        lis = [ i.json_out() for i in record]
        #print(lis)
        return jsonify(lis)

    @auth_required("token")
    def patch(self):
        req = request.get_json()
        record = db.session.query(trackers).filter(trackers.id == req["tid"]).one()
        try:
            record.name = req["name"]
            record.ttype = req["ttype"]
            record.desc = req["desc"]
            record.options = req["options"]
            db.session.commit()
        except:
            db.session.rollback
        return req
        
    @auth_required("token")
    def delete(self, tID):
        record = db.session.query(trackers).filter(trackers.id == tID).one()
        db.session.delete(record)
        db.session.commit()
        print(tID)
        return {'status': 200}

    @auth_required("token")
    def post(self):
        #args= tracker_parser
        req = request.get_json()
        print(type(req))
        record= trackers( name= req["name"], uid= req["uid"], desc= req["desc"], ttype= req["ttype"], options= req["options"])
        #record= trackers(id= 2, name= "name", uid=1, desc="desc", ttype=1, options= "options")
        db.session.add(record)
        db.session.commit()
        return req

class logAPI(Resource):
    #@login_required
    @auth_required("token")
    def get(self, tid):
        record = db.session.query(logs).filter(logs.tid == tid).all()
        lis = [ i.json_out() for i in record]
        #print(lis)
        return jsonify(lis)
     
    @auth_required("token")
    def patch(self):
        req = request.get_json()
        record = db.session.query(logs).filter(logs.id == req["lid"]).one()
        try:
            record.time = req["time"]
            record.value = req["value"]
            record.notes = req["notes"]
            db.session.commit()
        except:
            db.session.rollback()
        record = db.session.query(User).filter(User.id == None).all()
        return req


    @auth_required("token")
    def delete(self, lid):
        record = db.session.query(logs).filter(logs.id == lid).one()
        db.session.delete(record)
        db.session.commit()
        print(lid)
        return {'status': 200}


    @auth_required("token")
    def post(self):
        req = request.get_json()
        #print(type(req))
        record= logs( tid= req["tid"], time= req["time"], value= req["value"], notes= req["notes"])
        #record= trackers(id= 2, name= "name", uid=1, desc="desc", ttype=1, options= "options")
        db.session.add(record)
        db.session.commit()
        req = request.get_json()
        record = db.session.query(trackers).filter(trackers.id == req["tid"]).one()
        try:
            s=req["time"]
            record.last_update = s[0:10]+" "+s[11:16]
            
            db.session.commit()
        except:
            db.session.rollback()
        record = db.session.query(User).filter(User.id == current_user.id).one()
        try:
            record.log_flag = 1
            db.session.commit()
        except: db.session.rollback()
        return req

     
class dummy(Resource):
    @auth_required("token")
    def get(self):
        return { "msg": "hello"}