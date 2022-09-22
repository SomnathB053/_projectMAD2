from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = "1025"
SENDER_ADDRESS = "support@myapp.com"
SENDER_PASSWORD = ""

def send_email(_to, _sub, _msg):
    msg = MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg["To"] = _to
    msg["Subject"] = _sub

    msg.attach(MIMEText(_msg, "html"))

    s = smtplib.SMTP(host= SMTP_SERVER_HOST, port= SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS,SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()

    return True

def main():
    new_users = [
        { "name": "ABC", "email": "abc@example.com"},
        { "name": "CDF", "email": "bsc@example.com"},
    ]

    for u in new_users:
        send_email(u["email"], _sub="hello", _msg="Welcome")


if __name__ == "__main__":
    main()