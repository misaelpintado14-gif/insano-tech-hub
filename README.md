# INSANO TECH HUB v2.4 🚀

¡Bienvenido al **INSANO TECH HUB**! Un portal web interactivo cyberpunk y neon-themed que ofrece una tienda de hardware, licencias de streaming con panel VIP y un completo sistema de matriculación estudiantil académica.

## Características Principales 🌟

1. **Tienda Cyberpunk Premium**:
   - Catálogo dinámico de hardware de gama alta (PCs de Oficina y Gamer) y licencias de streaming (Netflix, Disney+, HBO, etc.).
   - Panel de filtrado y selector dinámico de planes (Mensual, Anual con Descuento y Permanente).

2. **Pasarela de Pago Segura e Interactiva**:
   - **Tarjeta de Crédito 3D**: Tarjeta interactiva con detección de franquicia (Visa, Mastercard, Amex) y giro en 3D (flip) al enfocar el campo CVV.
   - **Yape QR Scanner**: Código QR integrado con línea láser de escaneo animada en bucle.
   - **Simulación de Transacción**: Carga interactiva con logs en tiempo real del proceso bancario simulado.

3. **Pase VIP INSANO**:
   - Desbloquea el tema dorado **Sunset Amber**.
   - Permite matricularse en cursos con **0 vacantes** (Matrícula Express VIP).
   - Estatus y badge de suscriptor en la barra lateral.

4. **Sistema Académico de Matrículas**:
   - Formulario de inscripción rápida con validación de DNI en tiempo real e indicador de color para duplicados.
   - Panel de base de datos integrado para administrar estudiantes, cursos y matrículas.

5. **Audio y Efectos Sintéticos**:
   - Reproductor Synthwave integrado en la barra lateral con ecualizador visual dinámico de ondas.
   - Sintetizador retro de efectos de sonido (Web Audio API) al pasar el cursor o dar clic en los botones.

6. **Servidor SMTP Integrado**:
   - Envío real de comprobantes electrónicos a través del backend en Python (`server.py`).

---

## Instrucciones de Instalación y Uso 🛠️

### 1. Configuración de Correo SMTP
1. Copia el archivo `config.example.json` y renombralo a `config.json`.
2. Completa tu correo de Gmail y contraseña de aplicación en `config.json`:
   ```json
   {
     "SMTP_SERVER": "smtp.gmail.com",
     "SMTP_PORT": 587,
     "SMTP_USER": "misaelpintado7@gmail.com",
     "SMTP_PASSWORD": "tu_contraseña_de_aplicacion"
   }
   ```

### 2. Iniciar el Servidor de Correo
Ejecuta el servidor en la raíz del proyecto para habilitar el despacho de comprobantes:
```bash
python server.py
```

### 3. Ejecutar la Aplicación
Abre el archivo `index.html` directamente en tu navegador web de preferencia.
