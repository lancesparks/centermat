import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging

logger = logging.getLogger(__name__)

# Configs - Move these to your settings/environment variables
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "lancehsparks@gmail.com"
SMTP_PASSWORD = "qryeazhcbkbampyb"

def send_reset_password_email(email: str, reset_link: str):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Reset your Centermat password"
    msg['From'] = f"Centermat <{SMTP_USERNAME}>"
    msg['To'] = email

    html_content = f"""
    <html>
      <body style="font-family: sans-serif;">
        <h2>Reset your Centermat Password</h2>
        <p>Click the link below to set a new password. This link is only valid for 15 minutes:</p>
        <p><a href="{reset_link}" style="font-weight: bold; color: #111;">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
    """
    
    msg.attach(MIMEText(html_content, 'html'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, email, msg.as_string())
            logger.info(f"Successfully sent reset email to {email}")
    except Exception as e:
        logger.exception(f"Failed to send SMTP reset email to {email}: {str(e)}")