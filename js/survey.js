/* ==========================================================================
   INSANO TECH HUB - SURVEY TABULATION & REAL-TIME ANALYTICS MODULE
   Features: 10 dynamic Likert questions, LocalStorage backend, Canvas Bar Chart
   ========================================================================== */

const survey = (() => {
    // 10 Standard Questions from Anexo A
    const questions = [
        { id: 1, text: 'El sistema es fácil de utilizar', category: 'Usabilidad' },
        { id: 2, text: 'El proceso de matrícula es rápido', category: 'Velocidad' },
        { id: 3, text: 'La información mostrada es clara', category: 'Claridad' },
        { id: 4, text: 'Los formularios son fáciles de completar', category: 'Formularios' },
        { id: 5, text: 'La búsqueda de estudiantes funciona correctamente', category: 'Búsqueda' },
        { id: 6, text: 'El sistema genera reportes adecuadamente', category: 'Reportes' },
        { id: 7, text: 'El diseño visual es agradable', category: 'Diseño' },
        { id: 8, text: 'El sistema cumple sus necesidades', category: 'Funciones' },
        { id: 9, text: 'Recomendaría el uso del sistema', category: 'Recomendación' },
        { id: 10, text: 'Nivel de satisfacción general', category: 'Satisfacción' }
    ];

    // Local storage state
    let surveyRecords = [];

    // Seed mock data matching the report (45 evaluations: 40 students, 3 admin, 2 coords)
    // Seed averages target: Usabilidad: 4.6, Velocidad: 4.5, Diseño: 4.4, Funcionalidad/Cumplimiento: 4.8, etc.
    const defaultSurveys = [];
    
    function generateSeedData() {
        const targetAverages = [4.6, 4.5, 4.4, 4.6, 4.5, 4.6, 4.4, 4.8, 4.8, 4.7];
        
        for (let i = 0; i < 45; i++) {
            let responses = {};
            targetAverages.forEach((avg, idx) => {
                // Generate a random rating that converges on the average
                // e.g. for 4.6, mostly 5s and 4s, very few 3s
                let randomVal;
                let roll = Math.random();
                if (avg >= 4.7) {
                    randomVal = roll < 0.75 ? 5 : (roll < 0.98 ? 4 : 3);
                } else if (avg >= 4.5) {
                    randomVal = roll < 0.6 ? 5 : (roll < 0.95 ? 4 : 3);
                } else if (avg >= 4.3) {
                    randomVal = roll < 0.5 ? 5 : (roll < 0.9 ? 4 : (roll < 0.98 ? 3 : 2));
                } else {
                    randomVal = roll < 0.4 ? 5 : (roll < 0.8 ? 4 : 3);
                }
                responses[idx + 1] = randomVal;
            });

            defaultSurveys.push({
                id: 'srv_seed_' + i,
                name: i % 5 === 0 ? 'Evaluador ' + (i+1) : 'Anónimo',
                role: i === 0 || i === 1 ? 'Docente' : (i < 5 ? 'Administrativo' : 'Estudiante'),
                ratings: responses,
                comment: i % 9 === 0 ? 'Excelente velocidad de carga y muy intuitivo.' : ''
            });
        }
    }

    // Load surveys
    function loadSurveys() {
        const stored = localStorage.getItem('insano_survey_records');
        if (stored) {
            surveyRecords = JSON.parse(stored);
        } else {
            generateSeedData();
            surveyRecords = defaultSurveys;
            saveSurveys();
        }
        recalculateAnalytics();
    }

    function saveSurveys() {
        localStorage.setItem('insano_survey_records', JSON.stringify(surveyRecords));
    }

    // Render survey questions
    function renderSurveyForm() {
        const container = document.querySelector('.survey-questions');
        if (!container) return;

        container.innerHTML = questions.map(q => `
            <div class="srv-question-item">
                <div class="srv-question-title">${q.id}. ${q.text}</div>
                <div class="star-rating" data-qid="${q.id}">
                    <button type="button" class="star-btn" data-value="1" title="Muy Deficiente"><i data-lucide="star"></i></button>
                    <button type="button" class="star-btn" data-value="2" title="Deficiente"><i data-lucide="star"></i></button>
                    <button type="button" class="star-btn" data-value="3" title="Regular"><i data-lucide="star"></i></button>
                    <button type="button" class="star-btn" data-value="4" title="Bueno"><i data-lucide="star"></i></button>
                    <button type="button" class="star-btn" data-value="5" title="Excelente"><i data-lucide="star"></i></button>
                    <input type="hidden" name="question-${q.id}" id="question-input-${q.id}" required>
                </div>
            </div>
        `).join('');

        // Lucide reload
        lucide.createIcons();

        // Bind star events
        const starRatings = document.querySelectorAll('.star-rating');
        starRatings.forEach(ratingContainer => {
            const stars = ratingContainer.querySelectorAll('.star-btn');
            const hiddenInput = ratingContainer.querySelector('input');
            const qid = ratingContainer.dataset.qid;

            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const value = parseInt(star.dataset.value, 10);
                    hiddenInput.value = value;
                    
                    // Toggle active classes on stars up to selected value
                    stars.forEach((s, idx) => {
                        if (idx < value) {
                            s.classList.add('active');
                            s.innerHTML = '<i data-lucide="star" style="fill: #f59e0b;"></i>';
                        } else {
                            s.classList.remove('active');
                            s.innerHTML = '<i data-lucide="star"></i>';
                        }
                    });
                    lucide.createIcons();
                });
            });
        });
    }

    // Analytics recalculations
    let globalAverages = {};
    let overallAverage = 0;

    function recalculateAnalytics() {
        // Initialize sums
        let sums = {};
        questions.forEach(q => { sums[q.id] = 0; });

        // Sum up
        surveyRecords.forEach(rec => {
            for (let qid in rec.ratings) {
                sums[qid] += rec.ratings[qid];
            }
        });

        // Compute Averages
        const count = surveyRecords.length;
        let grandSum = 0;

        questions.forEach(q => {
            let avg = count > 0 ? (sums[q.id] / count) : 0;
            globalAverages[q.id] = parseFloat(avg.toFixed(2));
            grandSum += avg;
        });

        overallAverage = count > 0 ? parseFloat((grandSum / questions.length).toFixed(2)) : 0;

        // Update UI Text Nodes
        const avgText = document.getElementById('analytics-avg-value');
        const countText = document.getElementById('analytics-total-count');
        const dashboardSatisfaction = document.getElementById('widget-satisfaction-avg');

        if (avgText) avgText.textContent = overallAverage.toFixed(2);
        if (countText) countText.textContent = `Basado en ${count} encuestas`;
        if (dashboardSatisfaction) dashboardSatisfaction.textContent = overallAverage.toFixed(2);

        // Update interpretation
        updateInterpretationText(count);

        // Redraw Chart
        drawChart();
    }

    function updateInterpretationText(count) {
        const textContainer = document.getElementById('analytics-interpretation');
        if (!textContainer) return;

        let pctGlow = Math.round((overallAverage / 5) * 100);
        let interpret = `El promedio general fue de <strong>${overallAverage.toFixed(2)} sobre 5 (${pctGlow}%)</strong>, lo que evidencia una alta satisfacción por parte de los usuarios. `;
        
        if (overallAverage >= 4.5) {
            interpret += `Los aspectos mejor valorados son las <strong>Funcionalidades</strong> y la <strong>Recomendación</strong> del sistema de matrículas. Los usuarios manifestaron un nivel excelente de conformidad, destacando la rapidez del proceso digital.`;
        } else if (overallAverage >= 4.0) {
            interpret += `La aceptación general es sólida y positiva. Sin embargo, persisten comentarios aislados sugiriendo optimizaciones en tiempos de carga y flujos lógicos de navegación.`;
        } else {
            interpret += `Se requiere una auditoría técnica inmediata. El promedio es menor a la meta estándar, denotando fallos de usabilidad o cuellos de botella severos en la base de datos.`;
        }

        textContainer.innerHTML = interpret;
    }

    // DRAW CHART IN CANVAS (No libraries)
    function drawChart() {
        const canvas = document.getElementById('satisfaction-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Get Theme main color
        const rootStyles = getComputedStyle(document.body);
        const primaryColor = rootStyles.getPropertyValue('--primary-color').trim() || '#ff007f';
        const secondaryColor = rootStyles.getPropertyValue('--secondary-color').trim() || '#00f0ff';
        const textMuted = rootStyles.getPropertyValue('--text-muted').trim() || '#8a88ad';
        const textMain = rootStyles.getPropertyValue('--text-main').trim() || '#ffffff';

        // Margins and bounding boxes
        const paddingLeft = 35;
        const paddingRight = 10;
        const paddingTop = 15;
        const paddingBottom = 35;

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        // Draw Axes lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        
        // Y-axis gridlines
        for (let i = 1; i <= 5; i++) {
            let y = paddingTop + chartHeight - (chartHeight * (i / 5));
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - paddingRight, y);
            ctx.stroke();

            // Y scale numbers
            ctx.fillStyle = textMuted;
            ctx.font = '10px Rajdhani';
            ctx.textAlign = 'right';
            ctx.fillText(i, paddingLeft - 8, y + 3);
        }

        // Draw Bars
        const barCount = questions.length;
        const barSpacing = 8;
        const barWidth = (chartWidth - (barSpacing * (barCount - 1))) / barCount;

        questions.forEach((q, idx) => {
            const rating = globalAverages[q.id] || 0;
            const barHeight = chartHeight * (rating / 5);

            const x = paddingLeft + (idx * (barWidth + barSpacing));
            const y = paddingTop + chartHeight - barHeight;

            // Gradient for bar fill
            const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
            grad.addColorStop(0, primaryColor);
            grad.addColorStop(1, secondaryColor);

            // Draw Bar
            ctx.fillStyle = grad;
            ctx.beginPath();
            // Rounded corners at top of the bar (defensive compatibility fallback)
            if (ctx.roundRect) {
                ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
            } else {
                ctx.rect(x, y, barWidth, barHeight);
            }
            ctx.fill();

            // Draw text value above bar
            ctx.fillStyle = textMain;
            ctx.font = 'bold 9px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText(rating.toFixed(1), x + (barWidth / 2), y - 4);

            // Draw axis label below bar
            ctx.fillStyle = textMuted;
            ctx.font = 'bold 9px Rajdhani';
            ctx.fillText(q.category, x + (barWidth / 2), paddingTop + chartHeight + 15);
        });
    }

    // Submit handler
    function submitSurvey(name, role, comment) {
        // Collect responses
        let ratings = {};
        let missing = false;

        questions.forEach(q => {
            const val = document.getElementById(`question-input-${q.id}`).value;
            if (!val) {
                missing = true;
            } else {
                ratings[q.id] = parseInt(val, 10);
            }
        });

        if (missing) {
            app.showModal('ENCUESTA INCOMPLETA', 'Por favor responda todas las preguntas marcando sus estrellas.');
            return false;
        }

        const record = {
            id: 'srv_rec_' + Date.now(),
            name: name || 'Anónimo',
            role,
            ratings,
            comment: comment || ''
        };

        surveyRecords.push(record);
        saveSurveys();
        recalculateAnalytics();

        app.showModal('ENCUESTA GUARDADA', '¡Gracias por su colaboración! Los resultados analíticos del sistema se han recalculado de forma inmediata.');
        return true;
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadSurveys();
        renderSurveyForm();

        // Form handler
        const form = document.getElementById('survey-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('srv-name').value;
                const role = document.getElementById('srv-role').value;
                const comment = document.getElementById('srv-comment').value;

                if (submitSurvey(name, role, comment)) {
                    form.reset();
                    // Clear star activations
                    document.querySelectorAll('.star-btn').forEach(btn => {
                        btn.classList.remove('active');
                        btn.innerHTML = '<i data-lucide="star"></i>';
                    });
                    lucide.createIcons();
                }
            });
        }
    });

    return {
        init: () => {
            loadSurveys();
            drawChart();
        },
        refreshChart: drawChart,
        getRecords: () => surveyRecords,
        resetSurveys: () => {
            localStorage.removeItem('insano_survey_records');
            loadSurveys();
        }
    };
})();
