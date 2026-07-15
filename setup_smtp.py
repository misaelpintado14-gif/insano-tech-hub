import json
import os
import getpass

print("=== CONFIGURADOR DE CORREO SMTP - INSANO TECH HUB ===")
print("Este asistente configurara config.json de manera segura.\n")

email = input("Ingresa tu correo de Gmail (ej: misaelpintado14@gmail.com): ").strip()
print("Ingresa tu Contrasena de Aplicacion de Google (16 caracteres).")
print("Nota: Por seguridad, las letras que escribas no se mostraran en pantalla.")
password = getpass.getpass("Contrasena: ").strip()

config = {
  "SMTP_SERVER": "smtp.gmail.com",
  "SMTP_PORT": 587,
  "SMTP_USER": email,
  "SMTP_PASSWORD": password
}

with open("config.json", "w", encoding="utf-8") as f:
  json.dump(config, f, indent=2)

print("\n[OK] ¡Configuracion guardada con exito en config.json!")
print("El servidor SMTP en segundo plano cargara estos datos de forma automatica.")
