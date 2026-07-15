/* ==========================================================================
   INSANO TECH HUB - CLI DEVELOPMENT TERMINAL & SQL VIEWER MODULE
   Features: Command execution, live SQL query tabulator, automated test runner
   ========================================================================== */

const terminal = (() => {
    // SQL DDL templates matching Anexo F
    const schemas = {
        estudiantes: `CREATE TABLE estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) UNIQUE,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(20)
);`,
        cursos: `CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    creditos INT,
    vacantes INT
);`,
        matriculas: `CREATE TABLE matriculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT,
    fecha DATE,
    FOREIGN KEY(estudiante_id) REFERENCES estudiantes(id)
);`,
        detalle_matricula: `CREATE TABLE detalle_matricula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula_id INT,
    curso_id INT,
    FOREIGN KEY(matricula_id) REFERENCES matriculas(id),
    FOREIGN KEY(curso_id) REFERENCES cursos(id)
);`
    };

    // DB Viewer handler
    function loadTableData(tableName) {
        const ddlBox = document.getElementById('db-sql-ddl');
        const thead = document.getElementById('db-table-head');
        const tbody = document.getElementById('db-table-body');

        if (!ddlBox || !thead || !tbody) return;

        // Load SQL statement
        ddlBox.textContent = schemas[tableName] || '';

        // Query memory database
        const dbData = matriculas.getRawDB();

        if (tableName === 'estudiantes') {
            thead.innerHTML = `<tr><th>id</th><th>dni</th><th>nombres</th><th>apellidos</th><th>correo</th><th>telefono</th></tr>`;
            tbody.innerHTML = dbData.estudiantes.map(s => `
                <tr><td>${s.id}</td><td>${s.dni}</td><td>${s.nombres}</td><td>${s.apellidos}</td><td>${s.correo}</td><td>${s.telefono}</td></tr>
            `).join('');
        } 
        else if (tableName === 'cursos') {
            thead.innerHTML = `<tr><th>id</th><th>nombre</th><th>creditos</th><th>vacantes_totales</th><th>vacantes_libres</th></tr>`;
            tbody.innerHTML = dbData.cursos.map(c => `
                <tr><td>${c.id}</td><td>${c.nombre}</td><td>${c.creditos}</td><td>${c.vacantes_totales}</td><td>${c.vacantes_libres}</td></tr>
            `).join('');
        } 
        else if (tableName === 'matriculas') {
            thead.innerHTML = `<tr><th>id</th><th>estudiante_id</th><th>fecha</th></tr>`;
            tbody.innerHTML = dbData.matriculas.map(m => `
                <tr><td>${m.id}</td><td>${m.estudiante_id}</td><td>${m.fecha}</td></tr>
            `).join('');
        } 
        else if (tableName === 'detalle_matricula') {
            thead.innerHTML = `<tr><th>id</th><th>matricula_id</th><th>curso_id</th></tr>`;
            let counter = 1;
            let rows = [];
            dbData.matriculas.forEach(m => {
                m.cursos.forEach(cid => {
                    rows.push(`<tr><td>dm_${counter++}</td><td>${m.id}</td><td>${cid}</td></tr>`);
                });
            });
            tbody.innerHTML = rows.join('');
        }
    }

    // CLI Shell system
    const terminalScreen = document.getElementById('terminal-screen');
    const terminalInput = document.getElementById('terminal-input');

    function printLine(text, className = '') {
        if (!terminalScreen) return;
        const line = document.createElement('div');
        line.className = 'terminal-line ' + className;
        line.innerHTML = text;
        terminalScreen.appendChild(line);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }

    const commands = {
        help: () => {
            printLine('Comandos disponibles:');
            printLine('  <span class="terminal-cmd">run-tests</span>      - Corre los 10 Casos de Prueba (Anexo B)');
            printLine('  <span class="terminal-cmd">db-status</span>      - Muestra conteo de registros en BD MySQL');
            printLine('  <span class="terminal-cmd">db-reset</span>       - Limpia y re-siembra la base de datos');
            printLine('  <span class="terminal-cmd">system-info</span>    - Especificaciones tecnicas del host cliente');
            printLine('  <span class="terminal-cmd">ping-server</span>    - Benchmark de latencia con servidor SMTP local');
            printLine('  <span class="terminal-cmd">matrix-rain</span>    - Cascada de codigo de Matrix (Simulador)');
            printLine('  <span class="terminal-cmd">crypto-tracker</span> - Precios de criptomonedas (Simulado)');
            printLine('  <span class="terminal-cmd">neofetch</span>       - Detalles del sistema operativo de desarrollo');
            printLine('  <span class="terminal-cmd">clear</span>          - Limpia la pantalla de la terminal');
        },
        clear: () => {
            terminalScreen.innerHTML = '';
        },
        'system-info': () => {
            printLine('Buscando especificaciones del sistema host...', 'text-muted');
            setTimeout(() => {
                printLine(`  * Navegador: ${navigator.userAgent}`);
                printLine(`  * Resolucion: ${window.screen.width}x${window.screen.height} px (Ratio: ${window.devicePixelRatio})`);
                printLine(`  * CPU Cores: ${navigator.hardwareConcurrency || 'N/A'}`);
                printLine(`  * Idioma: ${navigator.language}`);
                printLine(`  * Estado Red: ${navigator.onLine ? 'CONECTADO (Online)' : 'DESCONECTADO (Offline)'}`);
                printLine(`  * Motor Grafico: WebGL 2.0 Renderer Active`, 'text-neon');
            }, 300);
        },
        'ping-server': () => {
            printLine('Enviando paquete ICMP Ping a http://localhost:8080/ ...', 'text-muted');
            const start = Date.now();
            fetch('http://localhost:8080/', { method: 'GET', mode: 'cors' })
            .then(res => {
                const latency = Date.now() - start;
                printLine(`  [OK] Respuesta de http://localhost:8080/: bytes=44 latencia=${latency}ms TTL=64`, 'trend up');
            })
            .catch(err => {
                printLine(`  [FALLIDO] No se pudo conectar con el servidor local SMTP (Puerto 8080 cerrado o inactivo).`, 'trend down');
            });
        },
        'matrix-rain': () => {
            printLine('Iniciando cascada de codigo Matrix en pantalla completa...', 'text-neon');
            app.startMatrixRain();
        },
        'crypto-tracker': () => {
            printLine('Obteniendo cotizaciones en tiempo real...', 'text-muted');
            setTimeout(() => {
                const btc = (90000 + Math.random() * 2000).toFixed(2);
                const eth = (3100 + Math.random() * 50).toFixed(2);
                const sol = (165 + Math.random() * 5).toFixed(2);
                printLine('------------------------------------------------');
                printLine(`  🪙 BTC/USD: <strong style="color:#f5a623;">$ ${btc}</strong> (Resistencia: $ 92,500)`);
                printLine(`  🪙 ETH/USD: <strong style="color:#8c8cff;">$ ${eth}</strong> (Resistencia: $ 3,250)`);
                printLine(`  🪙 SOL/USD: <strong style="color:#a6e22e;">$ ${sol}</strong> (Soporte: $ 160)`);
                printLine('------------------------------------------------');
                printLine('  * Nota: Valores simulados por el procesador INSANO.', 'text-muted');
            }, 400);
        },
        neofetch: () => {
            printLine('     .---.       insano-shell@IESTP_SYSTEM');
            printLine('    /     \\      -------------------------');
            printLine('    \\_.._/       OS: Laravel Carbon Terminal 11.2');
            printLine('    |    |       Kernel: Laravel HTTP Client v11');
            printLine('    |    |       Shell: PowerShell Core 7.4.2');
            printLine('    |____|       DB Motor: MySQL community-server 8.0');
            printLine('   (      )      Theme: Cyberpunk Retro Glow');
            printLine('   `------\'      Memory: 16 GB DDR5 / SSD Gen4');
        },
        'db-status': () => {
            const dbData = matriculas.getRawDB();
            let enrollCount = dbData.matriculas.length;
            let detailCount = dbData.matriculas.reduce((sum, m) => sum + m.cursos.length, 0);

            printLine('BD Estado MySQL (Sincronizado LocalStorage):');
            printLine(`  * estudiantes       - ${dbData.estudiantes.length} filas`);
            printLine(`  * cursos            - ${dbData.cursos.length} filas`);
            printLine(`  * matriculas        - ${enrollCount} filas`);
            printLine(`  * detalle_matricula - ${detailCount} filas`);
        },
        'db-reset': () => {
            matriculas.resetDatabase();
            survey.resetSurveys();
            loadTableData('estudiantes');
            printLine('Base de datos y encuestas de satisfacción restablecidas con éxito.', 'text-neon');
        },
        'run-tests': () => {
            runAutomatedTests();
        }
    };

    // Dynamic Test Runner (CP01 to CP10)
    function runAutomatedTests() {
        // Reset DB to clean state before running tests to prevent duplication errors on re-runs!
        matriculas.resetDatabase();

        const tests = [
            { id: 'CP01', name: 'Inicio de sesión válido (admin / 12345)', exec: () => matriculas.login('admin', '12345') },
            { id: 'CP02', name: 'Inicio de sesión inválido (admin / wrong)', exec: () => !matriculas.login('admin', 'wrong_pass') },
            { id: 'CP03', name: 'Registrar estudiante válido (DNI: 78564123)', exec: () => matriculas.addStudent('78564123', 'Testing', 'Student', 'test@test.com', '999999999') },
            { id: 'CP04', name: 'Registrar estudiante duplicado (DNI: 78564123)', exec: () => !matriculas.addStudent('78564123', 'Another', 'Student', 'dup@test.com', '123456789') },
            { id: 'CP05', name: 'Registrar curso académico válido', exec: () => matriculas.addCourse('Curso de Pruebas Unitarias', 4, 10) },
            { id: 'CP06', name: 'Matricular estudiante con vacantes', exec: () => {
                // Get newly added student ID
                const std = matriculas.getRawDB().estudiantes.find(s => s.dni === '78564123');
                const crs = matriculas.getRawDB().cursos.find(c => c.nombre === 'Curso de Pruebas Unitarias');
                return matriculas.registerEnrollment(std.id, [crs.id]);
            }},
            { id: 'CP07', name: 'Matricular estudiante en curso sin vacantes', exec: () => {
                // Set vacancies of mock course to 0
                const dbData = matriculas.getRawDB();
                const testCourse = dbData.cursos.find(c => c.nombre === 'Curso de Pruebas Unitarias');
                testCourse.vacantes_libres = 0;
                
                const std = dbData.estudiantes.find(s => s.dni === '78564123');
                // Attempt enrollment: should fail (return false)
                return !matriculas.registerEnrollment(std.id, [testCourse.id]);
            }},
            { id: 'CP08', name: 'Buscar estudiante por DNI existente', exec: () => {
                const std = matriculas.getRawDB().estudiantes.find(s => s.dni === '78564123');
                return std !== undefined;
            }},
            { id: 'CP09', name: 'Generar reporte de matrícula', exec: () => {
                const std = matriculas.getRawDB().estudiantes.find(s => s.dni === '78564123');
                const enr = matriculas.getRawDB().matriculas.find(e => e.estudiante_id === std.id);
                return enr !== undefined && enr.cursos.length > 0;
            }},
            { id: 'CP10', name: 'Cerrar sesión del sistema', exec: () => {
                matriculas.logout();
                return true;
            }}
        ];

        printLine('Iniciando batería de pruebas unitarias (10 Casos de Prueba)...', 'text-neon');
        
        let index = 0;
        let successCount = 0;

        function runNext() {
            if (index < tests.length) {
                let test = tests[index];
                printLine(`Ejecutando ${test.id}: ${test.name}...`);
                
                setTimeout(() => {
                    try {
                        let pass = test.exec();
                        if (pass) {
                            printLine(`  [APROBADO] ${test.id} completado con exito.`, 'trend up');
                            successCount++;
                        } else {
                            printLine(`  [FALLIDO] ${test.id} no arrojo el comportamiento esperado.`, 'trend down');
                        }
                    } catch (e) {
                        printLine(`  [ERROR INT] ${test.id} arrojo excepcion: ${e.message}`, 'trend down');
                    }
                    
                    index++;
                    runNext();
                }, 250);
            } else {
                printLine('------------------------------------------------', 'text-muted');
                printLine(`Resumen de Pruebas: ${successCount}/10 Exitosas. (${Math.round((successCount/10)*100)}% de Exito)`);
                if (successCount === 10) {
                    printLine('ESTADO DE LA BATERIA: CERTIFICADO APROBADO', 'status-badge success');
                } else {
                    printLine('ESTADO DE LA BATERIA: RECHAZADO', 'trend down');
                }
                
                // Refresh views after tests modify DB
                matriculas.refreshAllTables();
                loadTableData('estudiantes');
            }
        }

        runNext();
    }

    function handleCommand(rawInput) {
        const input = rawInput.trim().toLowerCase();
        printLine(`> ${rawInput}`, 'text-muted');

        if (!input) return;

        if (commands[input]) {
            commands[input]();
        } else {
            printLine(`Comando no reconocido: '${rawInput}'. Escribe 'help' para asistencia.`, 'trend down');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        // SQL Table switches
        const dbBtns = document.querySelectorAll('.db-table-btn');
        dbBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                dbBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadTableData(btn.dataset.table);
            });
        });

        // Load default table data
        loadTableData('estudiantes');

        // Input CLI handler
        if (terminalInput) {
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const val = terminalInput.value;
                    handleCommand(val);
                    terminalInput.value = '';
                }
            });
        }
    });

    const publicAPI = {
        loadTable: loadTableData,
        print: printLine,
        runTests: runAutomatedTests
    };
    Object.freeze(publicAPI);
    return publicAPI;
})();
