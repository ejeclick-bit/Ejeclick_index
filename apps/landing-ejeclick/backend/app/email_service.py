import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
import logging

logger = logging.getLogger("ejeclick")

# Configuración de fastapi-mail usando variables de entorno
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "dummy@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "dummy_password"),
    MAIL_FROM=os.getenv("MAIL_FROM", "dummy@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fastmail = FastMail(conf)

async def send_lead_confirmation_email(email_to: EmailStr, name: str):
    """
    Envía un correo automático al posible cliente confirmando que recibimos sus datos.
    """
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #3B82F6;">¡Hola {name}! 👋</h2>
        <p>Recibimos tu solicitud en <strong>EjeClick</strong>.</p>
        <p>Queremos ayudarte a automatizar tus ventas. En muy poco tiempo un consultor de nuestro equipo se pondrá en contacto contigo vía WhatsApp para agendar tu diagnóstico gratuito.</p>
        <p>Si tienes alguna pregunta urgente, no dudes en responder a este correo.</p>
        <br/>
        <p>Saludos,<br/><strong>El equipo de EjeClick</strong></p>
    </div>
    """

    message = MessageSchema(
        subject="Recibimos tu solicitud - EjeClick",
        recipients=[email_to],
        body=html,
        subtype=MessageType.html
    )

    try:
        await fastmail.send_message(message)
        logger.info(f"Correo de confirmación enviado a {email_to}")
    except Exception as e:
        logger.error(f"Error al enviar correo de confirmación a {email_to}: {e}")


async def send_admin_alert_email(lead_name: str, lead_email: str, lead_whatsapp: str, business_type: str):
    """
    Envía un correo de alerta al administrador informando de un nuevo lead.
    """
    admin_email = os.getenv("MAIL_USERNAME", "dummy@gmail.com") # Se envía al mismo correo configurado
    
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #10B981;">🔥 ¡Nuevo Lead Capturado!</h2>
        <p>Alguien acaba de llenar el formulario en EjeClick. Estos son los datos:</p>
        <ul>
            <li><strong>Nombre:</strong> {lead_name}</li>
            <li><strong>Email:</strong> {lead_email}</li>
            <li><strong>WhatsApp:</strong> {lead_whatsapp}</li>
            <li><strong>Tipo de Negocio:</strong> {business_type}</li>
        </ul>
        <p><em>Ponte en contacto con él lo antes posible para no dejar enfriar el lead.</em></p>
    </div>
    """

    message = MessageSchema(
        subject=f"🔥 Nuevo Lead: {lead_name} - EjeClick",
        recipients=[admin_email],
        body=html,
        subtype=MessageType.html
    )

    try:
        await fastmail.send_message(message)
        logger.info(f"Alerta de admin enviada para lead: {lead_name}")
    except Exception as e:
        logger.error(f"Error al enviar alerta de admin para lead {lead_name}: {e}")
