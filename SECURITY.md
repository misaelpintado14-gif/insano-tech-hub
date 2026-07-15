# Security Policy (Política de Seguridad) 🛡️

## Supported Versions (Versiones Soportadas)

| Version | Supported |
| ------- | --------- |
| v2.4x   |   ✅      |
| < v2.4  |   ❌      |

## Reporting a Vulnerability (Reportar una Vulnerabilidad)

Nos tomamos muy en serio la seguridad de la plataforma **INSANO TECH HUB**. Si encuentras alguna vulnerabilidad de seguridad o un fallo que comprometa la integridad de la base de datos o de los datos de los usuarios, por favor **NO abras un Issue público** en GitHub.

En su lugar, sigue el siguiente protocolo de reporte responsable:

1. Envía un correo electrónico directo describiendo detalladamente la vulnerabilidad a:
   - Correo electrónico: **misaelpintado14@gmail.com**
   - Asunto: `[VULNERABILITY REPORT] INSANO TECH HUB`
2. Si es posible, incluye pasos detallados para reproducir el fallo o capturas de pantalla/videos.
3. Te responderemos en un plazo máximo de 24 a 48 horas para confirmar la recepción y coordinar el parche correspondiente.

## Security Practices Enabled (Prácticas de Seguridad Activas)

- **XSS Escaping & Sanitization**: Todas las variables dinámicas se escapan a entidades seguras antes de inyectarse al HTML.
- **Strict Content Security Policy (CSP)**: El sitio restringe la carga de scripts de fuentes no autorizadas.
- **CodeQL Scanning**: Las subidas de código son analizadas automáticamente por el scanner de vulnerabilidades de GitHub.
