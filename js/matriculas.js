/* ==========================================================================
   INSANO TECH HUB - IESTP HERMANOS CÁRCAMO WEB ENROLLMENT SYSTEM (v2.0)
   Features: Real-time inline input validations (DNI checker), LocalStorage db,
             academic credit progress bar indicator
   ========================================================================== */

const matriculas = (() => {
    // Database structure (persisted via LocalStorage)
    let db = {
        estudiantes: [],
        cursos: [],
        matriculas: []
    };

    // Default Seed Data
    const defaultStudents = [
        { id: '1', dni: '70654321', nombres: 'Carlos Alberto', apellidos: 'Gomez Purizaca', correo: 'carlos.gomez@gmail.com', telefono: '965412356' },
        { id: '2', dni: '75321489', nombres: 'María Elena', apellidos: 'Cárcamo Nunura', correo: 'maria.carcamo@gmail.com', telefono: '948712365' },
        { id: '3', dni: '71245896', nombres: 'Jorge Luis', apellidos: 'Pingo Amaya', correo: 'jorge.pingo@outlook.com', telefono: '921475896' }
    ];

    const defaultCourses = [
        { id: 'c1', nombre: 'Desarrollo Web Integrado', creditos: 4, vacantes_totales: 30, vacantes_libres: 28 },
        { id: 'c2', nombre: 'Base de Datos Avanzada', creditos: 3, vacantes_totales: 25, vacantes_libres: 24 },
        { id: 'c3', nombre: 'Modelamiento de Sistemas', creditos: 4, vacantes_totales: 20, vacantes_libres: 19 },
        { id: 'c4', nombre: 'Soporte TI y Mantenimiento', creditos: 3, vacantes_totales: 15, vacantes_libres: 13 },
        { id: 'c5', nombre: 'Taller de Programación en Laravel', creditos: 5, vacantes_totales: 2, vacantes_libres: 2 }
    ];

    const defaultEnrollments = [
        { id: 'e1', estudiante_id: '1', cursos: ['c1', 'c2'], fecha: '2026-07-10' },
        { id: 'e2', estudiante_id: '2', cursos: ['c3', 'c4'], fecha: '2026-07-11' }
    ];

    let session = {
        isAuthenticated: false
    };

    // Load Database from storage
    function loadDB() {
        const stored = localStorage.getItem('insano_academic_db');
        if (stored) {
            db = JSON.parse(stored);
        } else {
            db.estudiantes = defaultStudents;
            db.cursos = defaultCourses;
            db.matriculas = defaultEnrollments;
            saveDB();
        }
        updateDashboardWidget();
    }

    function saveDB() {
        localStorage.setItem('insano_academic_db', JSON.stringify(db));
        updateDashboardWidget();
    }

    function updateDashboardWidget() {
        const widgetCount = document.getElementById('widget-student-count');
        if (widgetCount) {
            widgetCount.textContent = db.matriculas.length;
        }
    }

    // AUTH MODULE (RF01, CP01, CP02)
    function login(username, password) {
        if (username === 'admin' && password === '12345') {
            session.isAuthenticated = true;
            document.getElementById('enrollment-login-container').classList.add('hidden');
            document.getElementById('enrollment-system-dashboard').classList.remove('hidden');
            document.getElementById('login-error-msg').classList.add('hidden');
            
            refreshAllTables();
            app.showToast('SESIÓN INICIADA', 'Acceso concedido al panel académico del IESTP.', 'success');
            return true;
        } else {
            document.getElementById('login-error-msg').classList.remove('hidden');
            app.showToast('ACCESO DENEGADO', 'Credenciales del sistema incorrectas.', 'error');
            return false;
        }
    }

    function logout() {
        session.isAuthenticated = false;
        document.getElementById('enrollment-login-form').reset();
        document.getElementById('enrollment-login-container').classList.remove('hidden');
        document.getElementById('enrollment-system-dashboard').classList.add('hidden');
        app.showToast('SESIÓN CERRADA', 'Se ha desconectado del portal académico.', 'info');
    }

    // REAL-TIME INLINE INPUT VALIDATION FOR DNI CHECKER (New User Experience!)
    function bindRealtimeValidation() {
        const dniInput = document.getElementById('std-dni');
        const indicator = document.getElementById('dni-validation-indicator');
        const submitBtn = document.getElementById('btn-save-student');

        if (!dniInput || !indicator) return;

        dniInput.addEventListener('input', () => {
            const val = dniInput.value.trim();

            // Clear styling on empty
            if (val.length === 0) {
                dniInput.className = '';
                indicator.className = 'validation-badge neutral';
                indicator.textContent = 'Requerido';
                if (submitBtn) submitBtn.disabled = false;
                return;
            }

            // Only allow numbers
            if (!/^\d*$/.test(val)) {
                dniInput.className = 'invalid';
                indicator.className = 'validation-badge invalid';
                indicator.textContent = 'Solo Números';
                if (submitBtn) submitBtn.disabled = true;
                return;
            }

            if (val.length < 8) {
                // Too short DNI validation
                dniInput.className = 'invalid';
                indicator.className = 'validation-badge invalid';
                indicator.textContent = 'Incompleto';
                if (submitBtn) submitBtn.disabled = true;
            } 
            else if (val.length === 8) {
                // Check database duplication (CP04)
                const exists = db.estudiantes.some(s => s.dni === val);
                
                if (exists) {
                    dniInput.className = 'warning';
                    indicator.className = 'validation-badge warning';
                    indicator.textContent = 'DNI Duplicado';
                    if (submitBtn) submitBtn.disabled = true;
                } else {
                    dniInput.className = 'valid';
                    indicator.className = 'validation-badge valid';
                    indicator.textContent = 'Disponible';
                    if (submitBtn) submitBtn.disabled = false;
                }
            }
        });
    }

    // STUDENTS MODULE (RF02, CP03, CP04)
    function addStudent(dni, nombres, apellidos, correo, telefono) {
        if (!/^\d{8}$/.test(dni)) {
            app.showToast('DNI INVALIDO', 'El DNI debe tener exactamente 8 caracteres numericos.', 'error');
            return false;
        }

        const duplicate = db.estudiantes.find(std => std.dni === dni);
        if (duplicate) {
            app.showToast('REGISTRO DUPLICADO', `El DNI ${dni} ya está en la base de datos.`, 'warning');
            return false;
        }

        const newStudent = {
            id: 'std_' + Date.now(),
            dni,
            nombres,
            apellidos,
            correo,
            telefono
        };

        db.estudiantes.push(newStudent);
        saveDB();
        refreshAllTables();
        
        // Reset indicator visually
        const indicator = document.getElementById('dni-validation-indicator');
        const dniInput = document.getElementById('std-dni');
        if (indicator) {
            indicator.className = 'validation-badge neutral';
            indicator.textContent = 'Requerido';
        }
        if (dniInput) dniInput.className = '';

        app.showToast('REGISTRO EXITOSO', `${nombres} ${apellidos} ha sido guardado correctamente.`, 'success');
        return true;
    }

    function deleteStudent(id) {
        const std = db.estudiantes.find(s => s.id === id);
        db.estudiantes = db.estudiantes.filter(std => std.id !== id);
        db.matriculas = db.matriculas.filter(enr => enr.estudiante_id !== id);
        saveDB();
        refreshAllTables();
        if (std) {
            app.showToast('ESTUDIANTE ELIMINADO', `Registro de ${std.nombres} removido de la base de datos.`, 'info');
        }
    }

    // COURSES MODULE (RF03, CP05)
    function addCourse(nombre, creditos, vacantes) {
        const newCourse = {
            id: 'c_' + Date.now(),
            nombre,
            creditos: parseInt(creditos, 10),
            vacantes_totales: parseInt(vacantes, 10),
            vacantes_libres: parseInt(vacantes, 10)
        };

        db.cursos.push(newCourse);
        saveDB();
        refreshAllTables();
        app.showToast('CURSO CREADO', `El curso ${nombre} ha sido añadido al pensum académico.`, 'success');
        return true;
    }

    function deleteCourse(id) {
        db.cursos = db.cursos.filter(crs => crs.id !== id);
        saveDB();
        refreshAllTables();
        app.showToast('CURSO ELIMINADO', `Asignatura removida con éxito.`, 'info');
    }

    // ENROLLMENT MODULE (RF04, RF05, CP06, CP07)
    function registerEnrollment(studentId, courseIds) {
        if (!studentId) {
            app.showToast('FALTA ESTUDIANTE', 'Debe seleccionar un alumno para procesar la matrícula.', 'warning');
            return false;
        }
        if (!courseIds || courseIds.length === 0) {
            app.showToast('SIN CURSOS', 'Marque al menos una asignatura para matricular.', 'warning');
            return false;
        }

        let totalCredits = 0;
        let selectedCourses = [];
        for (let cid of courseIds) {
            let course = db.cursos.find(c => c.id === cid);
            if (course) {
                totalCredits += course.creditos;
                selectedCourses.push(course);
            }
        }

        if (totalCredits > 20) {
            app.showToast('EXCESO DE CREDITOS', `La carga de ${totalCredits} creditos excede el limite permitido de 20.`, 'error');
            return false;
        }

        // Check vacancy availability (RF05, CP07)
        for (let course of selectedCourses) {
            if (course.vacantes_libres <= 0) {
                if (localStorage.getItem('isVIPActive') === 'true') {
                    app.showToast('VIP EXPRESS', `Pase VIP detectado: Saltando limite de vacantes para ${course.nombre}.`, 'success');
                } else {
                    app.showToast('SIN VACANTES', `El curso ${course.nombre} se encuentra completamente lleno.`, 'error');
                    return false;
                }
            }
        }

        const existingIndex = db.matriculas.findIndex(enr => enr.estudiante_id === studentId);

        if (existingIndex !== -1) {
            // Restore old vacancies
            let prev = db.matriculas[existingIndex];
            prev.cursos.forEach(cid => {
                let course = db.cursos.find(c => c.id === cid);
                if (course) {
                    course.vacantes_libres = Math.min(course.vacantes_totales, course.vacantes_libres + 1);
                }
            });
            db.matriculas[existingIndex].cursos = courseIds;
            db.matriculas[existingIndex].fecha = new Date().toISOString().split('T')[0];
        } else {
            const newEnroll = {
                id: 'enr_' + Date.now(),
                estudiante_id: studentId,
                cursos: courseIds,
                fecha: new Date().toISOString().split('T')[0]
            };
            db.matriculas.push(newEnroll);
        }

        // Deduct vacancies
        selectedCourses.forEach(course => {
            course.vacantes_libres = Math.max(0, course.vacantes_libres - 1);
        });

        saveDB();
        refreshAllTables();
        
        const student = db.estudiantes.find(s => s.id === studentId);
        app.showToast('MATRICULA PROCESADA', `${student.nombres} matriculado con exito (${totalCredits} creditos).`, 'success');
        
        // Reset forms
        document.getElementById('enrollment-registration-form').reset();
        document.getElementById('enroll-summary-credits').textContent = '0';
        document.getElementById('enroll-summary-count').textContent = '0';
        document.getElementById('credit-progress-fill').style.width = '0%';
        
        return true;
    }

    // TABLES REFERSHER
    function refreshAllTables() {
        refreshStudentsTable();
        refreshCoursesTable();
        refreshEnrollmentForm();
        refreshReportsDropdown();
    }

    function refreshStudentsTable() {
        const tbody = document.getElementById('students-table-body');
        if (!tbody) return;

        const searchInput = document.getElementById('student-search-input');
        const filter = searchInput ? searchInput.value.toLowerCase() : '';

        let filtered = db.estudiantes;
        if (filter) {
            filtered = db.estudiantes.filter(std => 
                std.dni.includes(filter) || 
                std.nombres.toLowerCase().includes(filter) || 
                std.apellidos.toLowerCase().includes(filter)
            );
        }

        tbody.innerHTML = filtered.map(std => `
            <tr>
                <td>${app.escapeHTML(std.dni)}</td>
                <td><strong>${app.escapeHTML(std.apellidos)}, ${app.escapeHTML(std.nombres)}</strong></td>
                <td>${app.escapeHTML(std.correo)}</td>
                <td>${app.escapeHTML(std.telefono)}</td>
                <td>
                    <button class="btn-icon-danger" onclick="matriculas.deleteStudent('${std.id}')" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    function refreshCoursesTable() {
        const tbody = document.getElementById('courses-table-body');
        if (!tbody) return;

        tbody.innerHTML = db.cursos.map(crs => `
            <tr>
                <td>${app.escapeHTML(crs.id)}</td>
                <td><strong>${app.escapeHTML(crs.nombre)}</strong></td>
                <td>${crs.creditos}</td>
                <td>${crs.vacantes_totales}</td>
                <td class="${crs.vacantes_libres === 0 ? 'text-danger' : 'text-neon'}">${crs.vacantes_libres}</td>
                <td>
                    <button class="btn-icon-danger" onclick="matriculas.deleteCourse('${crs.id}')" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    function refreshEnrollmentForm() {
        const stdSelect = document.getElementById('enroll-student-select');
        const coursesDiv = document.getElementById('enroll-courses-list');

        if (stdSelect) {
            stdSelect.innerHTML = `<option value="">-- Seleccionar Estudiante --</option>` + 
                db.estudiantes.map(s => `<option value="${s.id}">${s.apellidos}, ${s.nombres} (DNI: ${s.dni})</option>`).join('');
        }

        if (coursesDiv) {
            coursesDiv.innerHTML = db.cursos.map(crs => `
                <div class="course-check-item">
                    <label class="course-check-label">
                        <input type="checkbox" name="academic-course" value="${crs.id}" data-credits="${crs.creditos}" ${(crs.vacantes_libres <= 0 && localStorage.getItem('isVIPActive') !== 'true') ? 'disabled' : ''}>
                        <span>${crs.nombre}</span>
                    </label>
                    <div class="course-check-info">
                        <span>(${crs.creditos} Cred)</span> | Vacantes: <span class="vacancies-count">${crs.vacantes_libres}/${crs.vacantes_totales}</span>
                    </div>
                </div>
            `).join('');

            // Hook credit calculation trigger
            const checkboxes = document.querySelectorAll('input[name="academic-course"]');
            checkboxes.forEach(chk => {
                chk.addEventListener('change', () => {
                    let totalCredits = 0;
                    let count = 0;
                    checkboxes.forEach(c => {
                        if (c.checked) {
                            totalCredits += parseInt(c.dataset.credits, 10);
                            count++;
                        }
                    });
                    
                    const credSpan = document.getElementById('enroll-summary-credits');
                    const countSpan = document.getElementById('enroll-summary-count');
                    const progressFill = document.getElementById('credit-progress-fill');
                    
                    if (credSpan) credSpan.textContent = totalCredits;
                    if (countSpan) countSpan.textContent = count;

                    // Progress bar calculation (Max 20 credits load)
                    if (progressFill) {
                        const pct = Math.min(100, (totalCredits / 20) * 100);
                        progressFill.style.width = `${pct}%`;
                        
                        if (totalCredits > 20) {
                            progressFill.classList.add('danger');
                            if (credSpan) credSpan.style.color = '#ff3333';
                        } else {
                            progressFill.classList.remove('danger');
                            if (credSpan) credSpan.style.color = '';
                        }
                    }
                });
            });
        }
    }

    function refreshReportsDropdown() {
        const select = document.getElementById('report-student-search');
        if (!select) return;

        const enrolledStudents = db.matriculas.map(enr => {
            return db.estudiantes.find(std => std.id === enr.estudiante_id);
        }).filter(std => std !== undefined);

        select.innerHTML = `<option value="">-- Seleccione Estudiante Matriculado --</option>` +
            enrolledStudents.map(s => `<option value="${s.id}">${s.apellidos}, ${s.nombres} (DNI: ${s.dni})</option>`).join('');
    }

    // PRINT REPORT HANDLER
    function loadReport() {
        const select = document.getElementById('report-student-search');
        if (!select) return;

        const studentId = select.value;
        if (!studentId) {
            app.showToast('ALERTA', 'Seleccione un estudiante de la lista.', 'warning');
            return;
        }

        const student = db.estudiantes.find(s => s.id === studentId);
        const enrollment = db.matriculas.find(enr => enr.estudiante_id === studentId);

        if (!student || !enrollment) return;

        document.getElementById('p-std-dni').textContent = student.dni;
        document.getElementById('p-std-names').textContent = student.nombres;
        document.getElementById('p-std-lastnames').textContent = student.apellidos;
        document.getElementById('p-std-email').textContent = student.correo;
        document.getElementById('p-std-phone').textContent = student.telefono;
        document.getElementById('p-enroll-date').textContent = enrollment.fecha;

        const tbody = document.getElementById('p-courses-tbody');
        let totalCredits = 0;

        tbody.innerHTML = enrollment.cursos.map((cid, idx) => {
            const course = db.cursos.find(c => c.id === cid);
            if (course) {
                totalCredits += course.creditos;
                return `
                    <tr>
                        <td>CURS-${idx+1}</td>
                        <td>${app.escapeHTML(course.nombre)}</td>
                        <td style="text-align: center;">${course.creditos}</td>
                    </tr>
                `;
            }
            return '';
        }).join('');

        document.getElementById('p-total-credits').textContent = totalCredits;
        document.getElementById('report-preview-panel').classList.remove('hidden');
        app.showToast('FICHA GENERADA', 'Reporte cargado. Listo para imprimir en PDF.', 'success');
    }

    // Listeners setup
    document.addEventListener('DOMContentLoaded', () => {
        loadDB();
        bindRealtimeValidation();

        // Login Handler
        const loginForm = document.getElementById('enrollment-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = document.getElementById('enrollment-user').value;
                const pass = document.getElementById('enrollment-pass').value;
                login(user, pass);
            });
        }

        const logoutBtn = document.getElementById('btn-academic-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // Student register
        const studentForm = document.getElementById('student-form');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const dni = app.sanitizeInput(document.getElementById('std-dni').value.trim());
                const names = app.sanitizeInput(document.getElementById('std-names').value.trim());
                const lastnames = app.sanitizeInput(document.getElementById('std-lastnames').value.trim());
                const email = app.sanitizeInput(document.getElementById('std-email').value.trim());
                const phone = app.sanitizeInput(document.getElementById('std-phone').value.trim());

                if (addStudent(dni, names, lastnames, email, phone)) {
                    studentForm.reset();
                }
            });
        }

        const studentSearch = document.getElementById('student-search-input');
        if (studentSearch) {
            studentSearch.addEventListener('input', refreshStudentsTable);
        }

        // Course register
        const courseForm = document.getElementById('course-form');
        if (courseForm) {
            courseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = app.sanitizeInput(document.getElementById('crs-name').value.trim());
                const credits = app.sanitizeInput(document.getElementById('crs-credits').value.trim());
                const vacancies = app.sanitizeInput(document.getElementById('crs-vacancies').value.trim());

                if (addCourse(name, credits, vacancies)) {
                    courseForm.reset();
                }
            });
        }

        // Student select change triggers checkbox reset
        const stdSelect = document.getElementById('enroll-student-select');
        if (stdSelect) {
            stdSelect.addEventListener('change', () => {
                const checkboxes = document.querySelectorAll('input[name="academic-course"]');
                checkboxes.forEach(c => { c.checked = false; });
                
                const credSpan = document.getElementById('enroll-summary-credits');
                const countSpan = document.getElementById('enroll-summary-count');
                const progressFill = document.getElementById('credit-progress-fill');
                
                if (credSpan) {
                    credSpan.textContent = '0';
                    credSpan.style.color = '';
                }
                if (countSpan) countSpan.textContent = '0';
                if (progressFill) {
                    progressFill.style.width = '0%';
                    progressFill.classList.remove('danger');
                }
            });
        }

        // Matricula transaction submit
        const enrollForm = document.getElementById('enrollment-registration-form');
        if (enrollForm) {
            enrollForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const studentId = document.getElementById('enroll-student-select').value;
                const checkedBoxes = Array.from(document.querySelectorAll('input[name="academic-course"]:checked'));
                const courseIds = checkedBoxes.map(c => c.value);

                registerEnrollment(studentId, courseIds);
            });
        }

        // Report actions
        const btnLoadRep = document.getElementById('btn-load-report');
        if (btnLoadRep) {
            btnLoadRep.addEventListener('click', loadReport);
        }

        const btnPrintRep = document.getElementById('btn-print-report');
        if (btnPrintRep) {
            btnPrintRep.addEventListener('click', () => {
                window.print();
            });
        }
    });

    return {
        login,
        logout,
        addStudent,
        deleteStudent,
        addCourse,
        deleteCourse,
        registerEnrollment,
        refreshAllTables,
        getRawDB: () => db,
        resetDatabase: () => {
            localStorage.removeItem('insano_academic_db');
            loadDB();
            refreshAllTables();
        }
    };
})();
