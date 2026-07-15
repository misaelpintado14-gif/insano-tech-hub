# Privacy Policy (Política de Privacidad) 🔒

En **INSANO TECH HUB**, la privacidad de nuestros usuarios y estudiantes es nuestra máxima prioridad. Esta política detalla cómo gestionamos y protegemos la información personal ingresada en la plataforma.

## 1. Recopilación y Uso de Datos
* **Almacenamiento Local (Local Sandbox)**: Toda la información de registro de estudiantes, catálogo de cursos y fichas de matrícula se almacena **localmente en el navegador del usuario** mediante la API de Web Storage. 
* **Cero Servidores Externos**: No enviamos ni guardamos datos académicos en bases de datos externas en la nube. Los datos permanecen dentro de tu propio equipo.
* **Encriptación de Seguridad**: Implementamos la capa `secureStorage` para codificar y ofuscar las bases de datos de LocalStorage en cadenas Base64 Unicode, protegiéndolas contra lecturas de terceros.

## 2. Pasarela de Pagos (Simulada)
* Los datos de tarjetas de crédito o credenciales Yape ingresados en la tienda de hardware y streaming son procesados **100% en memoria temporal del cliente**.
* Ninguna información financiera se registra, guarda o transmite a terceros.

## 3. Despacho de Correo (SMTP local)
* El envío de boletas de pago a través de `server.py` utiliza una conexión directa encriptada TLS/SSL con los servidores oficiales de Gmail (`smtp.gmail.com`). 
* Los correos y archivos HTML no se guardan en servidores intermediarios.

---

Para cualquier duda o aclaración sobre la protección de tus datos, puedes contactarnos en:  
📧 **misaelpintado14@gmail.com**
