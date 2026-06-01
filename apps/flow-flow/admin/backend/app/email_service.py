import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger("admin")

SMTP_HOST = os.getenv("FLOW_SMTP_HOST") or os.getenv("MAIL_SERVER", "")
SMTP_PORT = int(os.getenv("FLOW_SMTP_PORT") or os.getenv("MAIL_PORT", "587"))
SMTP_USER = os.getenv("FLOW_SMTP_USER") or os.getenv("MAIL_USERNAME", "")
SMTP_PASS = os.getenv("FLOW_SMTP_PASS") or os.getenv("MAIL_PASSWORD", "")
SMTP_FROM = os.getenv("FLOW_SMTP_FROM") or os.getenv("MAIL_FROM", "noreply@barberiaflowflow.com")
ADMIN_EMAIL = os.getenv("FLOW_ADMIN_EMAIL") or SMTP_USER

APPOINTMENT_CONFIRMATION_TEMPLATE = """Hola {client_name},

Tu cita en Barbería Flow Flow ha sido agendada exitosamente.

📅 Fecha: {date}
⏰ Hora: {time}
💇 Servicio: {service_name}
📍 Dirección: {address}

Si necesitas cancelar o reagendar, contáctanos al WhatsApp: wa.me/{whatsapp}

¡Te esperamos! ✂️

Barbería Flow Flow
Estilo que habla por sí solo
"""

ADMIN_NOTIFICATION_TEMPLATE = """Nueva cita agendada

Cliente: {client_name}
Teléfono: {client_phone}
Email: {client_email}
Servicio: {service_name}
Fecha: {date}
Hora: {time}
Notas: {notes}
"""


def is_email_configured() -> bool:
    return bool(SMTP_HOST and SMTP_USER and SMTP_PASS)


def send_email(to: str, subject: str, body: str) -> bool:
    if not is_email_configured():
        logger.info("email_not_configured — would send to=%s subject=%s", to, subject)
        logger.info("email_body:\n%s", body)
        return False
    try:
        msg = MIMEMultipart()
        msg["From"] = SMTP_FROM
        msg["To"] = to
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain", "utf-8"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        logger.info("email_sent to=%s subject=%s", to, subject)
        return True
    except Exception as e:
        logger.error("email_failed to=%s error=%s", to, str(e))
        return False


def send_appointment_confirmation(
    client_name: str,
    client_email: str,
    date: str,
    time: str,
    service_name: str,
):
    body = APPOINTMENT_CONFIRMATION_TEMPLATE.format(
        client_name=client_name,
        date=date,
        time=time,
        service_name=service_name or "Corte",
        address="Cra 45 # 23-10, Medellín",
        whatsapp="573001234567",
    )
    send_email(client_email, "✂️ Barbería Flow Flow — Cita Confirmada", body)


def send_admin_notification(
    client_name: str,
    client_phone: str,
    client_email: str,
    service_name: str,
    date: str,
    time: str,
    notes: str,
):
    if not ADMIN_EMAIL:
        return
    body = ADMIN_NOTIFICATION_TEMPLATE.format(
        client_name=client_name, client_phone=client_phone,
        client_email=client_email, service_name=service_name or "Corte",
        date=date, time=time, notes=notes or "Ninguna",
    )
    send_email(ADMIN_EMAIL, "📌 Nueva cita — Barbería Flow Flow", body)
