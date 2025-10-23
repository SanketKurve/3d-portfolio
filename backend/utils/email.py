import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
NOTIFICATION_EMAIL = os.getenv('NOTIFICATION_EMAIL', SMTP_USER)

async def send_email(to_email: str, subject: str, body: str, html_body: str = None):
    """Send email using Gmail SMTP"""
    try:
        if not SMTP_USER or not SMTP_PASSWORD:
            logger.warning("Email credentials not configured. Email not sent.")
            return False
        
        message = MIMEMultipart('alternative')
        message['From'] = SMTP_USER
        message['To'] = to_email
        message['Subject'] = subject
        
        text_part = MIMEText(body, 'plain')
        message.attach(text_part)
        
        if html_body:
            html_part = MIMEText(html_body, 'html')
            message.attach(html_part)
        
        await aiosmtplib.send(
            message,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASSWORD,
            use_tls=True
        )
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

async def send_contact_notification(name: str, email: str, subject: str, message: str):
    """Send notification email when someone submits contact form"""
    email_subject = f"New Contact Form Submission: {subject or 'No Subject'}"
    
    body = f"""New message received from your portfolio:

Name: {name}
Email: {email}
Subject: {subject or 'N/A'}

Message:
{message}

---
This is an automated notification from your portfolio website.
"""
    
    html_body = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7c3aed; margin-bottom: 20px;">📬 New Contact Form Submission</h2>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
            <p><strong>Subject:</strong> {subject or 'N/A'}</p>
        </div>
        <div style="background: #fff; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">{message}</p>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">This is an automated notification from your portfolio website.</p>
    </div>
</body>
</html>"""
    
    return await send_email(NOTIFICATION_EMAIL, email_subject, body, html_body)

async def send_auto_reply(to_email: str, name: str):
    """Send auto-reply to person who submitted contact form"""
    subject = "Thank you for contacting me! - Sanket Kurve"
    
    body = f"""Hi {name},

Thank you for reaching out! I've received your message and will get back to you as soon as possible.

In the meantime, feel free to check out my projects on GitHub or connect with me on LinkedIn.

Best regards,
Sanket Kurve

GitHub: https://github.com/SanketKurve
LinkedIn: https://www.linkedin.com/in/sanket-kurve-03a8b3196
Email: sanketkurve.2005@gmail.com
"""
    
    html_body = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #7c3aed; margin-bottom: 20px;">✉️ Thank You for Reaching Out!</h2>
            <p>Hi <strong>{name}</strong>,</p>
            <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
            <p>In the meantime, feel free to check out my projects or connect with me:</p>
            <div style="margin: 20px 0;">
                <p>🔗 <a href="https://github.com/SanketKurve" style="color: #7c3aed; text-decoration: none;">GitHub</a></p>
                <p>💼 <a href="https://www.linkedin.com/in/sanket-kurve-03a8b3196" style="color: #7c3aed; text-decoration: none;">LinkedIn</a></p>
                <p>📧 <a href="mailto:sanketkurve.2005@gmail.com" style="color: #7c3aed; text-decoration: none;">sanketkurve.2005@gmail.com</a></p>
            </div>
            <p style="margin-top: 30px;">Best regards,<br><strong>Sanket Kurve</strong></p>
        </div>
    </div>
</body>
</html>"""
    
    return await send_email(to_email, subject, body, html_body)
