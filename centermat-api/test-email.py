# test_email.py
import smtplib
from email.mime.text import MIMEText

# Use your actual Gmail credentials
SMTP_USERNAME = "lancehsparks@gmail.com"
SMTP_PASSWORD = "qryeazhcbkbampyb"
RECEIVER_EMAIL = "lancehsparks@gmail.com"  # Send it to yourself first

msg = MIMEText("If you can read this, your SMTP configuration is 100% working!")
msg['Subject'] = "SMTP Sanity Test"
msg['From'] = SMTP_USERNAME
msg['To'] = RECEIVER_EMAIL

try:
    print("Connecting to Gmail SMTP server...")
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.set_debuglevel(1)  # This will print the exact raw conversation with Google!
        print("Starting TLS...")
        server.starttls()
        print("Logging in...")
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        print("Sending email...")
        server.sendmail(SMTP_USERNAME, RECEIVER_EMAIL, msg.as_string())
        print("Success! Email sent without errors.")
except Exception as e:
    print(f"\n--- ERROR DETECTED ---")
    print(str(e))