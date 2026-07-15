#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
INSANO TECH HUB - LOCAL SMTP BACKEND (UPGRADED v2.1)
This script runs a lightweight python server that listens to POST requests from
the web frontend, allowing real email delivery via Google SMTP or custom mail servers.
Supports GET requests for health check and encodes UTF-8 subjects/headers to prevent ascii crashes.
"""

import http.server
import socketserver
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header

PORT = 8080

# ==============================================================================
# CONFIGURACION DEL EMISOR SMTP (CORREO CORPORATIVO / DOMINIO PROPIO)
# ==============================================================================
# Puedes usar cualquier correo de dominio propio (ej. ventas@tuempresa.com):
#
# 1. Si tu dominio esta en Google Workspace:
#    SMTP_SERVER = "smtp.gmail.com"
#    SMTP_PORT = 587
#    SMTP_USER = "ventas@tudominio.com"
#    SMTP_PASSWORD = "tu contraseña de aplicacion de 16 caracteres de Google"
#
# 2. Si tu dominio esta en Wix / Hostinger / Outlook Corporativo:
#    Cambia el SMTP_SERVER y SMTP_PORT según tu proveedor de hosting:
#    - Hostinger: "smtp.hostinger.com" (Port: 587)
#    - Wix: "smtp.sendgrid.net" o el SMTP corporativo que te asigne Wix.
# ==============================================================================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "tu_correo@gmail.com"                  # Cambia esto por tu correo (ej: ventas@insanotech.com)
SMTP_PASSWORD = "tu_contrasena_de_aplicacion"      # Cambia esto por tu contraseña de aplicacion SMTP (solo caracteres ASCII)
# ==============================================================================

class EmailHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Enable CORS headers for development/file origin accessibility
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        # Graceful handshake for web browser accesses or health checks
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write("<h3>Servidor SMTP INSANO TECH HUB activo y listo para recibir peticiones POST.</h3>".encode('utf-8'))

    def do_POST(self):
        if self.path == '/send-email':
            # Parse request length
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                recipient = data.get('to')
                subject = data.get('subject')
                html_body = data.get('html')
                
                if not recipient or not subject or not html_body:
                    self.send_error_response("Parametros faltantes: to, subject, html")
                    return
                
                # Execute SMTP dispatch
                self.send_real_email(recipient, subject, html_body)
                
                # Send JSON success confirmation
                self.send_success_response({"status": "success", "message": "Correo enviado con exito."})
                
            except Exception as e:
                print(f"Error procesando correo: {e}")
                self.send_error_response(str(e))
        else:
            self.send_response(404)
            self.end_headers()

    def send_real_email(self, to_email, subject, html_content):
        # Cargar credenciales dinámicamente de config.json si existe (permite cambios sin reiniciar el proceso)
        smtp_server = SMTP_SERVER
        smtp_port = SMTP_PORT
        smtp_user = SMTP_USER
        smtp_password = SMTP_PASSWORD

        import os
        import json
        if os.path.exists("config.json"):
            try:
                with open("config.json", "r", encoding="utf-8") as f:
                    config = json.load(f)
                    smtp_server = config.get("SMTP_SERVER", smtp_server)
                    smtp_port = int(config.get("SMTP_PORT", smtp_port))
                    smtp_user = config.get("SMTP_USER", smtp_user)
                    smtp_password = config.get("SMTP_PASSWORD", smtp_password)
            except Exception as e:
                print(f"Error leyendo config.json: {e}")

        # Modo de Demostracion (Mock Mode) si se usan credenciales por defecto
        if smtp_user == "tu_correo@gmail.com" or smtp_password == "tu_contrasena_de_aplicacion":
            import re
            
            # Extraer el numero de pedido
            order_match = re.search(r'#INS-(\d+)', subject)
            order_num = order_match.group(1) if order_match else "temp"
            
            # Crear la carpeta de correos si no existe
            os.makedirs("emails", exist_ok=True)
            filename = f"emails/correo-INS-{order_num}.html"
            
            with open(filename, "w", encoding="utf-8") as f:
                f.write(html_content)
                
            print(f"[DEMO MOCK] Credenciales por defecto. Guardando correo en disco: {filename}")
            return

        # Build multipart message with explicit UTF-8 Header formatting (prevents ascii encode crashes)
        msg = MIMEMultipart('alternative')
        msg['Subject'] = Header(subject, 'utf-8')
        msg['From'] = Header(f"INSANO TECH HUB <{smtp_user}>", 'utf-8')
        msg['To'] = Header(to_email, 'utf-8')
        
        # Attach HTML layout using utf-8 transfer encoding
        part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(part)
        
        # Connect to Gmail SMTP
        print(f"Conectando a {smtp_server}:{smtp_port} para enviar a {to_email}...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        
        # Send message safely supporting all unicode characters
        server.send_message(msg)
        server.quit()
        print("Correo despachado con exito.")

    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def send_error_response(self, message):
        self.send_response(500)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "error", "error": message}).encode('utf-8'))

def run():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), EmailHandler) as httpd:
        print(f"Servidor SMTP INSANO corriendo en: http://localhost:{PORT}")
        print("Listo para recibir peticiones POST de la pasarela web.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nDeteniendo servidor SMTP...")

if __name__ == '__main__':
    run()
