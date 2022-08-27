import os

basedir = os.path.abspath(os.path.dirname(__file__))
class Config():
    WTF_CSRF_ENABLED= False
    DEBUG = False
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"



class LocalDevelopmentConfig(Config):
    DEBUG=True
    SQLITE_DB_DIR = os.path.join(basedir, "../db")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "db1.sqlite3")
    SECRET_KEY= "254cfvfdvwr34t4df34rw"
    SECURITY_PASSWORD_HASH= "bcrypt"
    SECURITY_PASSWORD_SALT = "TESTINkmsdkfmdcmdf"
    SECURITY_REGISTERABLE=True
    SECURITY_SEND_REGISTER_EMAIL=False
    SECURITY_UNAUTHORIZED_VIEW=None
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"
