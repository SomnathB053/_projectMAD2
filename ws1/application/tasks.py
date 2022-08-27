from application.workers import celery

@celery.task()
def hello(name):
    print("INSIDE TASK")
    print("hello {}".format(name))