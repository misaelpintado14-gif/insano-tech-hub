/* ==========================================================================
   INSANO TECH HUB - STORE & TECHNICAL SUPPORT MODULE (UPGRADED v2.0)
   Features: Extended catalog (Streaming licenses & hardware), toast notifications
   ========================================================================== */

const store = (() => {
    // Local memory state
    let cart = [];
    let activeSupportOrders = 8;
    let totalSales = 142;
    let lastInvoiceBody = '';
    let lastOrderNumber = '';
    let selectedPlans = {};

    // Upgraded Products Database
    const computers = [
        {
            id: 'gamer-insane',
            name: 'PC Gamer INSANE Extrema',
            specs: 'Intel Core i9-14900K, Liquid Cooler Neon, RTX 4090 24GB, 64GB DDR5, SSD 2TB Gen4, Fuente 1000W 80+ Gold.',
            price: 5200.00,
            badge: 'GAMER PRO',
            image: 'img/gamer-insane.png'
        },
        {
            id: 'rtx5090',
            name: 'Gigabyte GeForce RTX 5090 Windforce',
            specs: '32GB GDDR7, Arquitectura Blackwell de última generación. Ray Tracing extremo y DLSS 4 habilitados.',
            price: 6499.00,
            badge: 'NUEVO HARDWARE',
            image: 'img/rtx5090.png'
        },
        {
            id: 'rtx4070super',
            name: 'ASUS Dual GeForce RTX 4070 Super 12GB',
            specs: 'Edición OC, 12GB GDDR6X, dos ventiladores Axial-tech silenciosos, ideal para trazado de rayos a 1440p.',
            price: 2690.00,
            badge: 'TARJETA VIDEO',
            image: 'img/rtx4070super.png'
        },
        {
            id: 'ryzen7800x3d',
            name: 'Procesador AMD Ryzen 7 5700',
            specs: '8 núcleos, 16 hilos, 4.6 GHz Turbo, Socket AM4, compatible con memoria DDR4. Excelente rendimiento/precio.',
            price: 720.00,
            badge: 'GAMING CPU',
            image: 'img/ryzen7.png'
        },
        {
            id: 'monitor-alienware',
            name: 'Monitor Alienware 34\" QD-OLED',
            specs: 'Curvo 1800R, resolución WQHD, tasa de refresco ultra fluida de 240Hz, respuesta de 0.03ms y HDR True Black 400.',
            price: 2799.00,
            badge: 'GAMING DISPLAY',
            image: 'img/monitor-alienware.png'
        },
        {
            id: 'workstation-pro',
            name: 'Workstation Office Premium',
            specs: 'AMD Ryzen 9 7900X, Disipador Aire BeQuiet, RTX 4070 12GB, 32GB RAM DDR5, SSD 1TB NVMe, Case Space Gray.',
            price: 3599.00,
            badge: 'DISEÑO / ING',
            image: 'img/workstation.png'
        },
        {
            id: 'ssdwd2tb',
            name: 'SSD WD Black SN850X 2TB NVMe',
            specs: 'Velocidades de lectura de hasta 7300MB/s, interfaz PCIe Gen4 x4 M.2 2280 con disipador térmico.',
            price: 590.00,
            badge: 'ALMACENAMIENTO',
            image: 'img/sn850x.png'
        },
        {
            id: 'cyber-keyboard',
            name: 'Teclado Mecánico Cyber-Glow',
            specs: 'Formato TKL 80%, switches ópticos lineales, keycaps translúcidos pudding con retroiluminación RGB direccionable.',
            price: 189.00,
            badge: 'PERIFÉRICOS',
            image: 'img/cyber-keyboard.png'
        },
        {
            id: 'hyperxcloud2',
            name: 'Auriculares HyperX Cloud II Wireless',
            specs: 'Conexión inalámbrica de 2.4 GHz, hasta 30 horas de batería, sonido envolvente 7.1 y almohadillas memory foam.',
            price: 380.00,
            badge: 'PERIFÉRICOS',
            image: 'img/hyperx.png'
        },
        {
            id: 'cyber-deck',
            name: 'Cyber Deck Portable Insano',
            specs: 'Intel Core i7-13620H, Pantalla 16\" OLED, RTX 4060, 16GB RAM, SSD 512GB NVMe, Teclado Mecánico Retroiluminado.',
            price: 2399.00,
            badge: 'ULTRA PORTABLE',
            image: 'img/cyber-deck.jpg'
        }
    ];

    const licenses = [
        {
            id: 'vip-pass',
            name: 'Pase de Acceso VIP INSANO',
            badge: 'VIP PORTAL',
            image: 'img/win11.png',
            specs: 'Desbloquea el tema dorado Sunset Amber, matricula express sin limites de vacantes y comandos ocultos.',
            plans: {
                monthly: { name: 'Pase VIP INSANO (Mensual)', price: 15.00, desc: '30 dias de privilegios VIP exclusivos.' },
                annual: { name: 'Pase VIP INSANO (Anual)', price: 120.00, desc: '12 meses completos de acceso VIP (Ahorra 33%).' },
                permanent: { name: 'Pase VIP INSANO (Permanente)', price: 299.00, desc: 'Pago unico para acceso VIP de por vida.' }
            }
        },
        {
            id: 'netflix',
            name: 'Netflix Premium',
            badge: 'STREAMING VIP',
            image: 'img/netflix.png',
            specs: 'Calidad Ultra HD 4K, soporte para 4 pantallas simultáneas, cuenta privada sin caídas.',
            plans: {
                monthly: { name: 'Netflix Premium (Mensual)', price: 12.00, desc: 'Acceso por 30 días, 4 pantallas 4K.' },
                annual: { name: 'Netflix Premium (Anual)', price: 100.00, desc: 'Ahorras S/. 44.00 (12 meses completos 4K).' },
                permanent: { name: 'Netflix Premium (Permanente)', price: 250.00, desc: 'Activación de por vida (Cuenta privada).' }
            }
        },
        {
            id: 'disney',
            name: 'Disney+ Premium',
            badge: 'STREAMING',
            image: 'img/disney.png',
            specs: 'Audio Dolby Atmos y resolución 4K UHD. Acceso completo a Disney, Pixar, Marvel y Star.',
            plans: {
                monthly: { name: 'Disney+ Premium (Mensual)', price: 10.00, desc: 'Acceso por 30 días en resolución 4K.' },
                annual: { name: 'Disney+ Premium (Anual)', price: 80.00, desc: 'Ahorras S/. 40.00 (12 meses de contenido).' },
                permanent: { name: 'Disney+ Premium (Permanente)', price: 180.00, desc: 'Acceso de por vida sin renovaciones.' }
            }
        },
        {
            id: 'hbo',
            name: 'Max Standard (HBO)',
            badge: 'STREAMING',
            image: 'img/hbo.png',
            specs: 'Plan para 2 pantallas en simultáneo Full HD. Acceso a HBO, Warner Bros y DC.',
            plans: {
                monthly: { name: 'Max Standard (Mensual)', price: 9.00, desc: 'Acceso por 30 días, 2 pantallas.' },
                annual: { name: 'Max Standard (Anual)', price: 72.00, desc: 'Ahorras S/. 36.00 (12 meses de películas).' },
                permanent: { name: 'Max Standard (Permanente)', price: 160.00, desc: 'Acceso ilimitado de por vida.' }
            }
        },
        {
            id: 'primevideo',
            name: 'Amazon Prime Video',
            badge: 'STREAMING',
            image: 'img/prime.png',
            specs: 'Resolución 4K UHD, soporte HDR y descarga offline en múltiples dispositivos.',
            plans: {
                monthly: { name: 'Prime Video (Mensual)', price: 8.00, desc: 'Acceso por 30 días, resolución UHD.' },
                annual: { name: 'Prime Video (Anual)', price: 64.00, desc: 'Ahorras S/. 32.00 (12 meses en alta definición).' },
                permanent: { name: 'Prime Video (Permanente)', price: 140.00, desc: 'Pago único para acceso de por vida.' }
            }
        },
        {
            id: 'ytpremium',
            name: 'YouTube Premium',
            badge: 'STREAMING VIP',
            image: 'img/youtube.png',
            specs: 'Videos sin anuncios, reproducción en segundo plano y descarga offline + YT Music.',
            plans: {
                monthly: { name: 'YouTube Premium (Mensual)', price: 9.00, desc: '30 días de reproducción sin anuncios.' },
                annual: { name: 'YouTube Premium (Anual)', price: 75.00, desc: 'Ahorras S/. 33.00 (12 meses de música y videos).' },
                permanent: { name: 'YouTube Premium (Permanente)', price: 170.00, desc: 'Activación permanente para cuenta personal.' }
            }
        },
        {
            id: 'crunchyroll',
            name: 'Crunchyroll Premium',
            badge: 'STREAMING',
            image: 'img/crunchyroll.png',
            specs: 'Catálogo de anime ilimitado sin anuncios y simulcasts el mismo día que en Japón.',
            plans: {
                monthly: { name: 'Crunchyroll Premium (Mensual)', price: 8.00, desc: '30 días de anime sin publicidad.' },
                annual: { name: 'Crunchyroll Premium (Anual)', price: 65.00, desc: 'Ahorras S/. 31.00 (12 meses en HD offline).' },
                permanent: { name: 'Crunchyroll Premium (Permanente)', price: 130.00, desc: 'Membresía premium de por vida.' }
            }
        },
        {
            id: 'spotify',
            name: 'Spotify Premium',
            badge: 'AUDIO PREMIUM',
            image: 'img/spotify.png',
            specs: 'Música sin anuncios, descargas offline, saltos ilimitados y máxima calidad de audio.',
            plans: {
                monthly: { name: 'Spotify Premium (Mensual)', price: 7.00, desc: 'Acceso por 30 días a música ilimitada.' },
                annual: { name: 'Spotify Premium (Anual)', price: 55.00, desc: 'Ahorras S/. 29.00 (12 meses para cuenta personal).' },
                permanent: { name: 'Spotify Premium (Permanente)', price: 110.00, desc: 'Activación permanente de por vida.' }
            }
        },
        {
            id: 'win11',
            name: 'Windows 11 Professional',
            badge: 'SISTEMA',
            image: 'img/win11.png',
            specs: 'Licencia digital enlazada a placa madre. Activación oficial para 1 PC.',
            plans: {
                permanent: { name: 'Windows 11 Professional Key', price: 25.00, desc: 'Licencia permanente OEM.' }
            }
        },
        {
            id: 'office26',
            name: 'MS Office Professional Plus 2026',
            badge: 'OFIMÁTICA',
            image: 'img/office.png',
            specs: 'Suite completa de oficina (Word, Excel, PowerPoint, Access). Activador oficial de pago único.',
            plans: {
                permanent: { name: 'MS Office Pro Plus 2026 Key', price: 45.00, desc: 'Licencia permanente Office 2026.' }
            }
        },
        {
            id: 'kaspersky',
            name: 'Kaspersky Total Security 2026 (3 PCs)',
            badge: 'SEGURIDAD',
            image: 'img/kaspersky.png',
            specs: 'Antivirus completo, Firewall avanzado y protección contra Ransomware por 1 año.',
            plans: {
                annual: { name: 'Kaspersky Total Security (1 Año)', price: 35.00, desc: 'Suscripción por 1 año para 3 PCs.' }
            }
        }
    ];

    // Initialize Catalog rendering
    function renderCatalog() {
        const computersContainer = document.getElementById('computers-container');
        const licensesContainer = document.getElementById('licenses-container');

        if (computersContainer) {
            computersContainer.innerHTML = computers.map(comp => `
                <div class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${comp.image}" alt="${comp.name}">
                        <span class="product-badge">${comp.badge}</span>
                    </div>
                    <div class="product-info">
                        <h4>${comp.name}</h4>
                        <p class="product-desc">${comp.specs}</p>
                        <div class="product-footer">
                            <span class="product-price">S/. ${comp.price.toFixed(2)}</span>
                            <button class="btn btn-primary btn-sm" onclick="store.addToCart('${comp.id}', 'computer')">Añadir</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (licensesContainer) {
            licensesContainer.innerHTML = licenses.map(lic => {
                const planKeys = Object.keys(lic.plans);
                const hasMultiplePlans = planKeys.length > 1;

                let selectorHTML = '';
                if (hasMultiplePlans) {
                    selectorHTML = `
                        <div class="plan-selector">
                            <button type="button" class="plan-btn active" id="btn-plan-${lic.id}-monthly" onclick="store.selectPlan('${lic.id}', 'monthly')">MENSUAL</button>
                            <button type="button" class="plan-btn" id="btn-plan-${lic.id}-annual" onclick="store.selectPlan('${lic.id}', 'annual')" style="position: relative;">ANUAL <span style="position: absolute; top: -8px; right: -2px; font-size: 7px; background: #eab308; color: #000; padding: 1px 3px; border-radius: 3px; font-family: monospace; font-weight: 900;">Ahorra</span></button>
                            <button type="button" class="plan-btn" id="btn-plan-${lic.id}-permanent" onclick="store.selectPlan('${lic.id}', 'permanent')">PERMANENTE</button>
                        </div>
                    `;
                }

                const defaultPlanKey = hasMultiplePlans ? 'monthly' : planKeys[0];
                const defaultPlan = lic.plans[defaultPlanKey];

                return `
                    <div class="product-card">
                        <div class="product-img-wrapper">
                            <img src="${lic.image}" alt="${lic.name}">
                            <span class="product-badge">${lic.badge}</span>
                        </div>
                        <div class="product-info">
                            <h4>${lic.name}</h4>
                            <p class="product-desc" id="desc-${lic.id}">${defaultPlan.desc}</p>
                            
                            ${selectorHTML}

                            <div class="product-footer" style="margin-top: 10px;">
                                <span class="product-price" id="price-${lic.id}">S/. ${defaultPlan.price.toFixed(2)}</span>
                                <button class="btn btn-primary btn-sm" onclick="store.addLicenseWithPlan('${lic.id}')">Añadir</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Cart Handlers
    function addToCart(productId, type) {
        let db = type === 'computer' ? computers : licenses;
        let item = db.find(p => p.id === productId);
        if (item) {
            cart.push(item);
            updateCartUI();
            
            // Pop dynamic screen toast notification (new intuitive system!)
            app.showToast('CARRITO ACTUALIZADO', `Se ha agregado ${item.name} al carrito.`, 'success');
        }
    }

    function selectPlan(productId, planKey) {
        selectedPlans[productId] = planKey;
        
        const lic = licenses.find(l => l.id === productId);
        if (!lic) return;
        
        const plan = lic.plans[planKey];
        if (!plan) return;
        
        // Update price text
        const priceEl = document.getElementById(`price-${productId}`);
        if (priceEl) priceEl.textContent = `S/. ${plan.price.toFixed(2)}`;
        
        // Update description text
        const descEl = document.getElementById(`desc-${productId}`);
        if (descEl) descEl.textContent = plan.desc;
        
        // Toggle active button class
        const planBtns = ['monthly', 'annual', 'permanent'];
        planBtns.forEach(key => {
            const btn = document.getElementById(`btn-plan-${productId}-${key}`);
            if (btn) {
                if (key === planKey) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });

        app.showToast('PLAN CAMBIADO', `Seleccionaste el plan ${planKey.toUpperCase()} para ${lic.name}.`, 'info');
    }

    function addLicenseWithPlan(productId) {
        const lic = licenses.find(l => l.id === productId);
        if (!lic) return;
        
        const planKey = selectedPlans[productId] || Object.keys(lic.plans)[0];
        const plan = lic.plans[planKey];
        
        // Create custom cart item
        const cartItem = {
            id: `${productId}-${planKey}`,
            name: plan.name,
            price: plan.price,
            badge: lic.badge,
            image: lic.image
        };
        
        cart.push(cartItem);
        updateCartUI();
        app.showToast('CARRITO ACTUALIZADO', `Se ha agregado ${plan.name} al carrito.`, 'success');
    }

    function buyLicenseDirect(licId) {
        addLicenseWithPlan(licId);
        toggleCart(true);
    }

    function removeFromCart(index) {
        let item = cart[index];
        cart.splice(index, 1);
        updateCartUI();
        app.showToast('PRODUCTO REMOVIDO', `${item.name} eliminado del carrito.`, 'info');
    }

    function updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.textContent = cart.length;

        const container = document.getElementById('cart-items-container');
        const subtotalValue = document.getElementById('cart-subtotal-value');
        const igvValue = document.getElementById('cart-igv-value');
        const ipmValue = document.getElementById('cart-ipm-value');
        const totalValue = document.getElementById('cart-total-value');

        if (cart.length === 0) {
            container.innerHTML = `<div class="empty-cart-msg">Tu carrito está vacío. ¡Agrega unas computadoras insanas!</div>`;
            if (subtotalValue) subtotalValue.textContent = 'S/. 0.00';
            if (igvValue) igvValue.textContent = 'S/. 0.00';
            if (ipmValue) ipmValue.textContent = 'S/. 0.00';
            if (totalValue) totalValue.textContent = 'S/. 0.00';
            return;
        }

        container.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">S/. ${item.price.toFixed(2)}</div>
                </div>
                <button class="btn-icon-danger" onclick="store.removeFromCart(${idx})" title="Eliminar del carrito">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `).join('');

        // Re-create icons inside dynamic cart
        lucide.createIcons();

        // Calculate total, subtotal, 16% IGV and 2% IPM
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const subtotal = total / 1.18;
        const igv = subtotal * 0.16;
        const ipm = subtotal * 0.02;

        if (subtotalValue) subtotalValue.textContent = `S/. ${subtotal.toFixed(2)}`;
        if (igvValue) igvValue.textContent = `S/. ${igv.toFixed(2)}`;
        if (ipmValue) ipmValue.textContent = `S/. ${ipm.toFixed(2)}`;
        if (totalValue) totalValue.textContent = `S/. ${total.toFixed(2)}`;
    }

    function toggleCart(forceOpen = null) {
        const cartPanel = document.getElementById('cart-panel');
        if (!cartPanel) return;

        if (forceOpen === true) {
            cartPanel.classList.add('active');
        } else if (forceOpen === false) {
            cartPanel.classList.remove('active');
        } else {
            cartPanel.classList.toggle('active');
        }
    }

    function updatePaymentDetails(method) {
        const container = document.getElementById('pay-details-container');
        if (!container) return;

        if (method === 'yape') {
            container.innerHTML = `
                <div style="font-size: 13px; line-height: 1.5; color: var(--text-main);">
                    <!-- Glowing Scanner QR code -->
                    <div style="text-align: center; margin-bottom: 12px;">
                        <div style="display: inline-block; padding: 8px; background: #fff; border-radius: 8px; box-shadow: 0 0 15px rgba(0,255,136,0.3); border: 2px solid #00ff88; margin-bottom: 8px; position: relative; overflow: hidden; width: 110px; height: 110px;">
                            <!-- Simulated Neon QR Code Grid -->
                            <div style="width: 110px; height: 110px; background: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect x=%220%22 y=%220%22 width=%2225%22 height=%2225%22 fill=%22black%22/><rect x=%225%22 y=%225%22 width=%2215%22 height=%2215%22 fill=%22white%22/><rect x=%2275%22 y=%220%22 width=%2225%22 height=%2225%22 fill=%22black%22/><rect x=%2280%22 y=%225%22 width=%2215%22 height=%2215%22 fill=%22white%22/><rect x=%220%22 y=%2275%22 width=%2225%22 height=%2225%22 fill=%22black%22/><rect x=%225%22 y=%2280%22 width=%2215%22 height=%2215%22 fill=%22white%22/><rect x=%2235%22 y=%2235%22 width=%2230%22 height=%2230%22 fill=%22black%22/><rect x=%2240%22 y=%2240%22 width=%2220%22 height=%2220%22 fill=%22white%22/><rect x=%2210%22 y=%2235%22 width=%2215%22 height=%2210%22 fill=%22black%22/><rect x=%2235%22 y=%2210%22 width=%2215%22 height=%2210%22 fill=%22black%22/><rect x=%2260%22 y=%2215%22 width=%2210%22 height=%2215%22 fill=%22black%22/><rect x=%2215%22 y=%2260%22 width=%2215%22 height=%2210%22 fill=%22black%22/><rect x=%2260%22 y=%2270%22 width=%2215%22 height=%2210%22 fill=%22black%22/></svg>') no-repeat; background-size: cover; width: 100%; height: 100%;"></div>
                            <!-- Scanning Laser Line Animation -->
                            <div style="position: absolute; top: 8px; left: 8px; width: 110px; height: 2px; background: #00ff88; box-shadow: 0 0 8px #00ff88; animation: qrScan 2s infinite ease-in-out;"></div>
                        </div>
                        <div>
                            <strong style="color: #00ff88; font-size: 15px;">ESCANEAR QR YAPEAR</strong><br>
                            <span style="font-size: 10px; color: var(--text-muted);">Titular: Misael P. | Celular: 910 489 887</span>
                        </div>
                    </div>

                    <p style="margin-bottom:10px; font-size:12px; color: var(--text-muted); text-align: center;">Yapea por el monto exacto. Luego, ingresa tu número y el código de verificación para validar.</p>
                    <div style="display:flex; gap:10px; margin-top:8px;">
                        <div style="width:50%;">
                            <label style="font-size:10px; display:block; margin-bottom:4px; color:var(--text-muted); text-transform:uppercase;">Código Yape (4 dígitos)</label>
                            <input type="text" id="pay-yape-code" maxlength="4" placeholder="Ej: 8492" required style="width:100%; padding:8px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none; font-family: monospace;">
                        </div>
                        <div style="width:50%;">
                            <label style="font-size:10px; display:block; margin-bottom:4px; color:var(--text-muted); text-transform:uppercase;">Número Celular</label>
                            <input type="text" id="pay-yape-phone" maxlength="9" placeholder="9XXXXXXXX" required style="width:100%; padding:8px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none; font-family: monospace;">
                        </div>
                    </div>
                </div>
            `;
        } else if (method === 'transfer') {
            container.innerHTML = `
                <div style="font-size: 12px; line-height: 1.6; color: var(--text-main);">
                    <p style="margin-bottom:8px; font-weight:bold; color:var(--secondary-color); text-transform:uppercase; letter-spacing:0.5px;">Cuentas Oficiales de Recepción:</p>
                    <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:4px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.03); font-family: monospace;">
                        <strong>BCP Soles:</strong> 47514533911076<br>
                        <strong>CCI Interbancaria:</strong> 0024751145339110762121
                    </div>
                    <p style="margin-bottom:8px; color: var(--text-muted);">Realiza la transferencia interbancaria o directa. Luego ingresa el número de operación:</p>
                    <div>
                        <label style="font-size:10px; display:block; margin-bottom:4px; color:var(--text-muted); text-transform:uppercase;">Número de Operación</label>
                        <input type="text" id="pay-trans-op" placeholder="Ej: OP-8374829" required style="width:100%; padding:8px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none;">
                    </div>
                </div>
            `;
        } else if (method === 'card') {
            container.innerHTML = `
                <!-- Credit Card Visualizer -->
                <div class="credit-card-wrapper" id="card-vis-wrapper" style="width: 280px; height: 155px; margin: 0 auto 12px auto; perspective: 1000px; font-family: monospace;">
                    <div class="credit-card-inner" id="card-vis-inner" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.6s; transform-style: preserve-3d; transform: rotateY(0deg);">
                        <!-- FRONT -->
                        <div class="card-front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, #1d1b26, #3b2c63); border: 1px solid var(--primary-color); border-radius: 8px; padding: 12px; color: #fff; text-align: left; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.2);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 8px; font-weight: bold; letter-spacing: 1px; color: var(--primary-color);">PASARELA SEGURA</span>
                                <span id="vis-logo" style="font-size: 11px; font-weight: bold; font-style: italic; color: #999;">CARD</span>
                            </div>
                            <div style="font-size: 10px; background: #eab308; width: 22px; height: 16px; border-radius: 3px; margin: 8px 0 3px 0; box-shadow: 0 0 5px #eab308;"></div>
                            <div id="vis-num" style="font-size: 14px; font-family: monospace; letter-spacing: 2px; text-shadow: 0 0 3px #000;">•••• •••• •••• ••••</div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 8px; font-family: monospace;">
                                <div>
                                    <span style="display: block; font-size: 5px; color: var(--text-muted); text-transform: uppercase;">Titular</span>
                                    <span id="vis-name" style="color: #fff;">INSANO GUEST</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 5px; color: var(--text-muted); text-transform: uppercase;">Vence</span>
                                    <span id="vis-exp" style="color: #fff;">MM/YY</span>
                                </div>
                            </div>
                        </div>
                        <!-- BACK -->
                        <div class="card-back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, #1d1b26, #0e0d13); border: 1px solid var(--secondary-color); border-radius: 8px; color: #fff; box-sizing: border-box; transform: rotateY(180deg); display: flex; flex-direction: column; justify-content: space-between; padding: 12px 0; box-shadow: 0 0 15px rgba(var(--secondary-rgb), 0.2);">
                            <div style="background: #000; height: 30px; width: 100%;"></div>
                            <div style="padding: 0 15px; text-align: right;">
                                <span style="font-size: 6px; color: var(--text-muted); display: block; text-transform: uppercase; margin-bottom: 2px;">CVV</span>
                                <div style="background: #fff; color: #000; font-family: monospace; font-size: 10px; font-weight: bold; padding: 3px 6px; border-radius: 2px; display: inline-block; width: 30px; text-align: center;" id="vis-cvv">•••</div>
                            </div>
                            <div style="font-size: 6px; color: var(--text-muted); padding: 0 15px; font-family: monospace; text-align: center; letter-spacing: 0.5px;">CONEXIÓN ENCRIPTADA DE POR VIDA</div>
                        </div>
                    </div>
                </div>

                <div style="font-size: 12px; color: var(--text-main);">
                    <div style="margin-bottom: 8px;">
                        <label style="font-size: 10px; display:block; margin-bottom:4px; color:var(--text-muted); text-transform:uppercase; font-weight: 600;">Nombre del Titular</label>
                        <input type="text" id="pay-card-name" placeholder="Ej: Misael Pintado" required style="width:100%; padding:8px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none; font-family: monospace;">
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label style="font-size: 10px; display:block; margin-bottom:4px; color:var(--text-muted); text-transform:uppercase; font-weight: 600;">Número de Tarjeta</label>
                        <input type="text" id="pay-card-num" maxlength="19" placeholder="4000 1234 5678 9010" required style="width:100%; padding:8px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none; font-family: monospace;">
                    </div>
                    <div style="display:flex; gap:10px;">
                        <div style="width:50%;">
                            <label style="font-size: 10px; display:block; margin-bottom:4px; color:var(--text-muted); text-transform:uppercase; font-weight: 600;">Vencimiento</label>
                            <input type="text" id="pay-card-exp" maxlength="5" placeholder="MM/YY" required style="width:100%; padding:8px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none; font-family: monospace;">
                        </div>
                        <div style="width:50%;">
                            <label style="font-size: 10px; display:block; margin-bottom:4px; color:var(--text-muted); text-transform:uppercase; font-weight: 600;">Código CVV</label>
                            <input type="password" id="pay-card-cvv" maxlength="3" placeholder="XXX" required style="width:100%; padding:8px; background:rgba(0,0,0,0.3); border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none; font-family: monospace;">
                        </div>
                    </div>
                </div>
            `;

            // Bind live visualizer listeners!
            const visWrapper = document.getElementById('card-vis-wrapper');
            const visLogo = document.getElementById('vis-logo');
            const visNum = document.getElementById('vis-num');
            const visName = document.getElementById('vis-name');
            const visExp = document.getElementById('vis-exp');
            const visCvv = document.getElementById('vis-cvv');

            const inputName = document.getElementById('pay-card-name');
            const inputNum = document.getElementById('pay-card-num');
            const inputExp = document.getElementById('pay-card-exp');
            const inputCvv = document.getElementById('pay-card-cvv');

            if (inputName) {
                inputName.addEventListener('input', (e) => {
                    visName.textContent = e.target.value.toUpperCase() || 'INSANO GUEST';
                });
            }
            if (inputNum) {
                inputNum.addEventListener('input', (e) => {
                    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                    let matches = val.match(/\d{4,16}/g);
                    let match = matches && matches[0] || '';
                    let parts = [];
                    for (let i=0, len=match.length; i<len; i+=4) {
                        parts.push(match.substring(i, i+4));
                    }
                    if (parts.length > 0) {
                        e.target.value = parts.join(' ');
                    } else {
                        e.target.value = val;
                    }
                    visNum.textContent = e.target.value || '•••• •••• •••• ••••';

                    // Logo detection
                    if (val.startsWith('4')) {
                        visLogo.textContent = 'VISA';
                        visLogo.style.color = '#3b82f6';
                    } else if (val.startsWith('5')) {
                        visLogo.textContent = 'MASTERCARD';
                        visLogo.style.color = '#f97316';
                    } else if (val.startsWith('3')) {
                        visLogo.textContent = 'AMEX';
                        visLogo.style.color = '#06b6d4';
                    } else {
                        visLogo.textContent = 'CARD';
                        visLogo.style.color = '#999';
                    }
                });
            }
            if (inputExp) {
                inputExp.addEventListener('input', (e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) {
                        e.target.value = val.substring(0,2) + '/' + val.substring(2,4);
                    }
                    visExp.textContent = e.target.value || 'MM/YY';
                });
            }
            if (inputCvv) {
                inputCvv.addEventListener('focus', () => {
                    visWrapper.classList.add('flipped');
                });
                inputCvv.addEventListener('blur', () => {
                    visWrapper.classList.remove('flipped');
                });
                inputCvv.addEventListener('input', (e) => {
                    visCvv.textContent = e.target.value || '•••';
                });
            }
        }
    }

    function processPayment(orderNumber, total, subtotal, igv, ipm) {
        const emailInput = document.getElementById('pay-email');
        const email = emailInput ? emailInput.value.trim() : '';

        if (!email || !email.includes('@')) {
            app.showToast('EMAIL INVALIDO', 'Por favor ingresa un correo electronico valido para enviarte las cuentas.', 'error');
            return;
        }

        const methodSelect = document.getElementById('pay-method');
        const method = methodSelect ? methodSelect.value : 'yape';

        let paymentDetailStr = '';
        if (method === 'yape') {
            const yapeCode = document.getElementById('pay-yape-code').value.trim();
            const yapePhone = document.getElementById('pay-yape-phone').value.trim();
            if (!yapeCode || !yapePhone) {
                app.showToast('CAMPOS VACIOS', 'Debe completar el codigo de verificacion Yape y numero.', 'error');
                return;
            }
            paymentDetailStr = `Yape (Cel: ${yapePhone}, Código: ${yapeCode})`;
        } else if (method === 'transfer') {
            const transOp = document.getElementById('pay-trans-op').value.trim();
            if (!transOp) {
                app.showToast('OPERACION REQUERIDA', 'Debe ingresar el numero de operacion de la transferencia.', 'error');
                return;
            }
            paymentDetailStr = `Transferencia Operación: ${transOp}`;
        } else if (method === 'card') {
            const cardName = document.getElementById('pay-card-name') ? document.getElementById('pay-card-name').value.trim() : '';
            const cardNum = document.getElementById('pay-card-num').value.trim();
            const cardExp = document.getElementById('pay-card-exp').value.trim();
            const cardCvv = document.getElementById('pay-card-cvv').value.trim();
            if (!cardName || !cardNum || !cardExp || !cardCvv) {
                app.showToast('TARJETA INCOMPLETA', 'Debe completar todos los campos de la tarjeta.', 'error');
                return;
            }
            paymentDetailStr = `Tarjeta de Crédito / Débito (Terminada en: ${cardNum.substring(cardNum.length - 4)})`;
        }

        // Check if VIP Pass is inside the cart!
        let boughtVIP = cart.some(item => item.name && item.name.toLowerCase().includes('vip'));

        // Target modal body to display high-tech processing loader simulation!
        const modalBodyContent = document.getElementById('modal-body-content');
        if (modalBodyContent) {
            modalBodyContent.innerHTML = `
                <div style="text-align: center; padding: 25px 10px; font-family: monospace;">
                    <div style="width: 45px; height: 45px; border: 3px solid rgba(0,255,136,0.1); border-top-color: #00ff88; border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 15px auto;"></div>
                    <h4 style="color: #00ff88; font-size: 13px; margin-bottom: 12px; letter-spacing: 1px; text-transform: uppercase;">PROCESANDO TRÁMITE FINANCIERO</h4>
                    <div id="payment-status-log" style="font-size: 11px; color: var(--text-muted); line-height: 1.6; min-height: 50px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 4px;">
                        Inicializando túnel seguro de encriptación TLS 1.3...
                    </div>
                </div>
            `;
            
            // Step-by-step logs simulation
            setTimeout(() => {
                const log = document.getElementById('payment-status-log');
                if (log) log.innerHTML = 'Verificando firmas de autorización bancaria...<br><span style="color:#00ff88;">[OK] Conexión establecida.</span>';
            }, 900);

            setTimeout(() => {
                const log = document.getElementById('payment-status-log');
                if (log) log.innerHTML = 'Autenticando transacción en base de datos central...<br><span style="color:#eab308;">Validando libro mayor BCP/Interbank...</span>';
            }, 1800);

            setTimeout(() => {
                const log = document.getElementById('payment-status-log');
                if (log) log.innerHTML = 'Registrando transacción en base de datos local...<br><span style="color:#00ff88;">[APROBADO] Fondos confirmados.</span>';
            }, 2700);

            setTimeout(() => {
                // Finalize payment!
                executeFinalPayment(orderNumber, total, subtotal, igv, ipm, email, paymentDetailStr, boughtVIP);
            }, 3500);
        } else {
            // Fallback if modal body content element is missing
            executeFinalPayment(orderNumber, total, subtotal, igv, ipm, email, paymentDetailStr, boughtVIP);
        }
    }

    function executeFinalPayment(orderNumber, total, subtotal, igv, ipm, email, paymentDetailStr, boughtVIP) {
        // Save states for download
        lastOrderNumber = orderNumber;
        
        const invoiceContentHTML = `
            <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">RECIBO DE COMPRA - INSANO TECH HUB</div>
            <div>------------------------------------------</div>
            <div>ORDEN ID: #INS-${orderNumber}</div>
            <div>FECHA: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
            <div>CLIENTE EMAIL: ${app.escapeHTML(email)}</div>
            <div>PAGO REGISTRADO: ${app.escapeHTML(paymentDetailStr)}</div>
            <div>ESTADO: EN PROCESO DE ACTIVACIÓN</div>
            <div>------------------------------------------</div>
            <div style="margin: 10px 0;">
                ${cart.map(item => `<div>* ${app.escapeHTML(item.name)} - S/. ${item.price.toFixed(2)}</div>`).join('')}
            </div>
            <div>------------------------------------------</div>
            <div style="font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span>VALOR VENTA (Subtotal):</span>
                <span>S/. ${subtotal.toFixed(2)}</span>
            </div>
            <div style="font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 3px;">
                <span>IGV PERÚ (16%):</span>
                <span>S/. ${igv.toFixed(2)}</span>
            </div>
            <div style="font-size: 12px; display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>IPM MUNICIPAL (2%):</span>
                <span>S/. ${ipm.toFixed(2)}</span>
            </div>
            <div style="font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; border-top: 1px dashed #bbb; padding-top: 5px;">
                <span>TOTAL COMPRA:</span>
                <span>S/. ${total.toFixed(2)}</span>
            </div>
            <div style="margin-top: 15px; padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 4px; font-size: 12px; text-align: center; color: #f87171; font-weight: bold; line-height: 1.5; font-family: monospace;">
                📧 COMPROBANTE ENVIADO A: <strong>${app.escapeHTML(email)}</strong><br>
                <span style="color: #fca5a5; font-size: 11px;">⚠️ NOTA IMPORTANTE: Si el correo no aparece en tu bandeja principal, por favor revisa tu carpeta de <strong>SPAM o Correo No Deseado</strong>. Los filtros de Gmail a veces clasifican las boletas automáticas de este modo.</span>
            </div>
        `;
        
        lastInvoiceBody = invoiceContentHTML;

        // Show Toast showing email dispatch
        app.showToast('DESPACHO SMTP', `Enviando confirmación de compra a ${email}...`, 'info');

        // Trigger mailto link for real client-side email composition (fallback)!
        const subjectMail = encodeURIComponent("¡Muchas gracias por tu compra en INSANO TECH HUB! - Pedido #INS-" + orderNumber);
        const bodyMail = encodeURIComponent(
            "Estimado cliente,\n\n" +
            "¡Muchas gracias por tu compra en INSANO TECH HUB!\n\n" +
            "Tu orden #" + orderNumber + " ha sido recibida con éxito.\n\n" +
            "--- DETALLE DEL PEDIDO ---\n" +
            cart.map(item => "* " + item.name + " - S/. " + item.price.toFixed(2)).join("\n") + "\n\n" +
            "Subtotal (Valor Venta): S/. " + subtotal.toFixed(2) + "\n" +
            "IGV (16%): S/. " + igv.toFixed(2) + "\n" +
            "IPM (2%): S/. " + ipm.toFixed(2) + "\n" +
            "TOTAL PAGADO: S/. " + total.toFixed(2) + "\n" +
            "--------------------------\n\n" +
            "MÉTODO DE PAGO REGISTRADO:\n" +
            paymentDetailStr + "\n\n" +
            "INSTRUCCIONES DE ACCESO:\n" +
            "Tus credenciales de acceso (cuentas, licencias y enlaces oficiales) serán activadas y enviadas a este mismo correo Gmail en un lapso de 5 a 15 minutos.\n\n" +
            "Si tienes alguna duda o deseas agilizar la entrega, puedes escribir directamente a nuestro canal de soporte técnico.\n\n" +
            "¡Gracias por tu preferencia!\n\n" +
            "Atentamente,\n" +
            "Misael P. - Administración INSANO TECH HUB\n" +
            "Celular Yape: 910 489 887\n" +
            "BCP Soles: 47514533911076\n" +
            "Interbank CCI: 0024751145339110762121"
        );

        const mailtoUrl = `mailto:${email}?subject=${subjectMail}&body=${bodyMail}`;
        const mailtoFrame = document.createElement('iframe');
        mailtoFrame.style.display = 'none';
        mailtoFrame.src = mailtoUrl;
        document.body.appendChild(mailtoFrame);
        setTimeout(() => mailtoFrame.remove(), 2000);

        // Formatted Cyberpunk HTML email for Python Backend SMTP (real design)
        const emailHTML = `
            <div style="background-color: #020906; padding: 30px 10px; font-family: 'Courier New', Courier, monospace; color: #e2f5ec; text-align: center;">
                <div style="max-width: 550px; margin: 0 auto; background-color: #05140d; border: 1px solid #00ff88; border-radius: 8px; padding: 25px; text-align: left; box-shadow: 0 4px 20px rgba(0, 255, 136, 0.15); box-sizing: border-box;">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 255, 136, 0.2); padding-bottom: 20px;">
                        <div style="display: inline-block; background-color: #00ff88; color: #020906; font-weight: bold; font-size: 24px; padding: 5px 15px; border-radius: 4px; margin-bottom: 10px; font-family: Arial, sans-serif;">I</div>
                        <h2 style="margin: 0; color: #00ff88; font-size: 22px; letter-spacing: 2px; text-transform: uppercase;">INSANO TECH HUB</h2>
                        <span style="font-size: 11px; color: #6b8f7d; letter-spacing: 1px;">COMPROBANTE ELECTRONICO DE PAGO</span>
                    </div>

                    <!-- Body -->
                    <p style="font-size: 14px; line-height: 1.5; color: #e2f5ec;">Estimado cliente,</p>
                    <p style="font-size: 14px; line-height: 1.5; color: #e2f5ec;">Muchas gracias por su compra en <strong>INSANO TECH HUB</strong>. Su orden de compra ha sido procesada con exito y se encuentra en estado de activacion.</p>

                    <!-- Invoice Details Box -->
                    <div style="background-color: #081e14; border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 6px; padding: 15px; margin: 20px 0; font-size: 13px; line-height: 1.6; color: #e2f5ec;">
                        <div style="color: #00ff88; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">⚡ RESUMEN DE LA TRANSACCION</div>
                        <table style="width:100%; border-collapse:collapse; font-size:13px; color:#e2f5ec;">
                            <tr style="border-bottom: 1px dashed rgba(0, 255, 136, 0.1);">
                                <td style="padding: 5px 0; color: #6b8f7d;">ORDEN ID:</td>
                                <td style="padding: 5px 0; text-align: right; color: #00ff88; font-weight: bold;">#INS-${orderNumber}</td>
                            </tr>
                            <tr style="border-bottom: 1px dashed rgba(0, 255, 136, 0.1);">
                                <td style="padding: 5px 0; color: #6b8f7d;">FECHA:</td>
                                <td style="padding: 5px 0; text-align: right;">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</td>
                            </tr>
                            <tr style="border-bottom: 1px dashed rgba(0, 255, 136, 0.1);">
                                <td style="padding: 5px 0; color: #6b8f7d;">CLIENTE:</td>
                                <td style="padding: 5px 0; text-align: right; color: #00e5ff;">${email}</td>
                            </tr>
                            <tr style="border-bottom: 1px dashed rgba(0, 255, 136, 0.1);">
                                <td style="padding: 5px 0; color: #6b8f7d;">REGISTRO PAGO:</td>
                                <td style="padding: 5px 0; text-align: right;">${paymentDetailStr}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #6b8f7d;">ESTADO:</td>
                                <td style="padding: 5px 0; text-align: right;"><span style="background-color: rgba(0,255,136,0.1); color: #00ff88; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 11px;">EN PROCESO DE ACTIVACION</span></td>
                            </tr>
                        </table>
                    </div>

                    <!-- Products Table -->
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
                        <thead>
                            <tr style="border-bottom: 2px solid #00ff88; color: #00ff88; text-align: left;">
                                <th style="padding: 8px 0; text-transform: uppercase;">Producto Adquirido</th>
                                <th style="padding: 8px 0; text-align: right; text-transform: uppercase;">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.map(item => `
                                <tr style="border-bottom: 1px solid rgba(0, 255, 136, 0.1);">
                                    <td style="padding: 10px 0; font-weight: bold; color: #e2f5ec;">${item.name}</td>
                                    <td style="padding: 10px 0; text-align: right; color: #00e5ff; font-weight: bold;">S/. ${item.price.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Pricing Summary -->
                    <div style="margin-left: auto; max-width: 250px; font-size: 12px; line-height: 1.6; border-top: 1px solid rgba(0, 255, 136, 0.1); padding-top: 10px;">
                        <table style="width:100%; border-collapse:collapse; font-size:12px; color:#e2f5ec;">
                            <tr>
                                <td style="padding: 3px 0; color: #6b8f7d;">VALOR VENTA:</td>
                                <td style="padding: 3px 0; text-align: right;">S/. ${subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 3px 0; color: #6b8f7d;">IGV PERU (16%):</td>
                                <td style="padding: 3px 0; text-align: right;">S/. ${igv.toFixed(2)}</td>
                            </tr>
                            <tr style="border-bottom: 1px dashed rgba(0, 255, 136, 0.2); padding-bottom: 5px;">
                                <td style="padding: 3px 0; color: #6b8f7d;">IPM MUNICIPAL (2%):</td>
                                <td style="padding: 3px 0; text-align: right; padding-bottom: 5px;">S/. ${ipm.toFixed(2)}</td>
                            </tr>
                            <tr style="color: #00ff88; font-weight: bold; font-size: 14px;">
                                <td style="padding: 8px 0;">TOTAL COMPRA:</td>
                                <td style="padding: 8px 0; text-align: right;">S/. ${total.toFixed(2)}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Instructions Info Alert -->
                    <div style="background-color: rgba(0, 229, 255, 0.05); border-left: 4px solid #00e5ff; padding: 12px; border-radius: 0 4px 4px 0; margin: 25px 0; font-size: 12px; line-height: 1.5; color: #e2f5ec;">
                        <strong style="color: #00e5ff;">📧 ENTREGAS Y ACCESO:</strong> Sus credenciales de streaming, claves de activacion y manuales de instalacion seran despachados a este correo en un lapso de <strong>5 a 15 minutos</strong>. Por favor revise su carpeta de Recibidos o Spam.
                    </div>

                    <!-- Corporate info -->
                    <div style="font-size: 11px; color: #6b8f7d; border-top: 1px solid rgba(0, 255, 136, 0.2); padding-top: 15px; text-align: center; line-height: 1.5;">
                        <strong>SOPORTE TECNICO E INFORMACION CORPORATIVA:</strong><br>
                        Administracion INSANO TECH HUB (Misael P.)<br>
                        Yape Celular: <strong>910 489 887</strong><br>
                        BCP Soles: <strong>47514533911076</strong> | CCI: <strong>0024751145339110762121</strong>
                    </div>

                </div>
            </div>
        `;

        // POST request to Python Local SMTP Backend
        fetch('http://localhost:8080/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: email,
                subject: `¡Muchas gracias por tu compra en INSANO TECH HUB! - Pedido #INS-${orderNumber}`,
                html: emailHTML
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json().then(res => {
                    app.showToast('SMTP COMPLETO', `Mensaje enviado con exito a ${email} (Servidor Real).`, 'success');
                });
            } else {
                return response.json().then(errData => {
                    console.error('SMTP server error:', errData.error);
                    app.showToast('FALLO CREDENCIALES', 'Servidor activo, pero fallo la autenticacion SMTP (Configura tu correo/clave real en server.py).', 'error');
                    throw new Error('SMTP Error');
                }).catch((e) => {
                    if (e.message !== 'SMTP Error') {
                        app.showToast('FALLO SERVIDOR', 'El servidor de correo local retorno un error interno.', 'error');
                        throw new Error('Server Error');
                    }
                    throw e;
                });
            }
        })
        .catch(err => {
            if (err.message !== 'SMTP Error' && err.message !== 'Server Error') {
                console.log('Local SMTP backend not running, using mailto composer as fallback.', err);
                app.showToast('SMTP INACTIVO', 'Servidor de correo local inactivo o inaccesible. Usando gestor alternativo...', 'warning');
                
                // Launch mail composer as fallback
                const mailtoAnchor = document.createElement('a');
                mailtoAnchor.href = mailtoUrl;
                mailtoAnchor.target = '_blank';
                document.body.appendChild(mailtoAnchor);
                mailtoAnchor.click();
                document.body.removeChild(mailtoAnchor);
            }
        });

        // Set VIP status if bought!
        if (boughtVIP) {
            secureStorage.save('isVIPActive', 'true');
            app.checkVIP();
            app.showToast('VIP ACTIVADO', '¡Felicidades! Has desbloqueado el acceso VIP INSANO en toda la plataforma.', 'success');
        }

        // Restore OK button in modal footer
        const okBtn = document.getElementById('modal-ok-btn');
        if (okBtn) okBtn.style.display = 'block';

        let invoiceHTML = `
            <div style="font-family: monospace; font-size: 13px; color: #222; text-align: left; background: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #ddd; margin-top:10px;">
                ${invoiceContentHTML}
                <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center; border-top: 1px dashed #ccc; padding-top:12px;">
                    <button type="button" onclick="store.downloadInvoice()" style="background:#10b981; color:#fff; padding:8px 14px; border:none; border-radius:4px; font-weight:bold; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:5px;">📥 Descargar Comprobante</button>
                    <button type="button" onclick="store.printInvoice()" style="background:#4b5563; color:#fff; padding:8px 14px; border:none; border-radius:4px; font-weight:bold; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:5px;">🖨️ Imprimir PDF</button>
                </div>
            </div>
        `;

        app.showModal('¡PEDIDO DE COMPRA RECIBIDO!', `
            <p style="margin-bottom: 10px;">¡Gracias por tu compra! Tu transacción ha sido recibida y está siendo procesada de forma segura.</p>
            ${invoiceHTML}
        `);

        // Increment sales stat
        totalSales += cart.length;
        document.getElementById('widget-sales-count').textContent = totalSales;

        // Clear cart
        cart = [];
        updateCartUI();
        toggleCart(false);
    }

    function checkout() {
        if (cart.length === 0) {
            app.showToast('CARRITO VACÍO', 'Agrega algún producto antes de realizar el pago.', 'warning');
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const subtotal = total / 1.18;
        const igv = subtotal * 0.16;
        const ipm = subtotal * 0.02;
        const orderNumber = Math.floor(Math.random() * 900000) + 100000;

        // Hide default OK button in modal footer for checkout form
        const okBtn = document.getElementById('modal-ok-btn');
        if (okBtn) okBtn.style.display = 'none';

        const modalBody = `
            <div class="checkout-form-modal" style="color: var(--text-main); text-align: left;">
                <p class="subtitle" style="margin-bottom: 15px; font-size: 13px;">Completa tus datos para pagar un total de <strong>S/. ${total.toFixed(2)}</strong>.</p>
                
                <div class="form-group" style="margin-bottom: 12px;">
                    <label for="pay-email" style="display:block; margin-bottom:5px; font-size:11px; text-transform:uppercase; color:var(--text-muted); font-family:var(--font-tech); font-weight:600;">Correo Electrónico (Gmail)</label>
                    <input type="email" id="pay-email" placeholder="ejemplo@gmail.com" required style="width:100%; padding:10px; background:rgba(0,0,0,0.4); border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none; font-family:var(--font-ui);">
                </div>

                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="pay-method" style="display:block; margin-bottom:5px; font-size:11px; text-transform:uppercase; color:var(--text-muted); font-family:var(--font-tech); font-weight:600;">Método de Pago Real</label>
                    <select id="pay-method" style="width:100%; padding:10px; background:#0b0816; border:1px solid var(--border-color); color:#fff; border-radius:4px; outline:none; font-family:var(--font-ui);">
                        <option value="yape">Yape (Pago Móvil Inmediato)</option>
                        <option value="transfer">Transferencia Bancaria BCP/Interbank</option>
                        <option value="card">Tarjeta de Crédito / Débito</option>
                    </select>
                </div>

                <!-- Dynamic details container -->
                <div id="pay-details-container" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                </div>

                <div class="checkout-actions" style="display:flex; gap:10px; justify-content:flex-end; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px;">
                    <button class="btn btn-secondary btn-sm" id="btn-cancel-pay">Cancelar</button>
                    <button class="btn btn-glow btn-sm" id="btn-confirm-pay">Confirmar y Pagar</button>
                </div>
            </div>
        `;

        app.showModal('PASARELA DE PAGO SEGURA', modalBody);

        // Update active payment method HTML
        updatePaymentDetails('yape');

        // Bind events inside the modal
        const methodSelect = document.getElementById('pay-method');
        if (methodSelect) {
            methodSelect.addEventListener('change', (e) => {
                updatePaymentDetails(e.target.value);
            });
        }

        const btnCancel = document.getElementById('btn-cancel-pay');
        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                const okBtnRestore = document.getElementById('modal-ok-btn');
                if (okBtnRestore) okBtnRestore.style.display = 'block';
                app.closeModal();
            });
        }

        const btnConfirm = document.getElementById('btn-confirm-pay');
        if (btnConfirm) {
            btnConfirm.addEventListener('click', () => {
                processPayment(orderNumber, total, subtotal, igv, ipm);
            });
        }
    }

    // Technical Support Diagnostic
    function runDiagnosis() {
        const clientEl = document.getElementById('rep-client');
        const modelEl = document.getElementById('rep-model');
        const brandSelect = document.getElementById('rep-brand');

        if (!clientEl || !modelEl || !brandSelect) return;

        const client = clientEl.value.trim();
        const model = modelEl.value.trim();
        const deviceType = brandSelect.options[brandSelect.selectedIndex].text;

        if (!client || !model) {
            app.showToast('CAMPOS VACÍOS', 'Debe completar el nombre de cliente y modelo de equipo.', 'error');
            return;
        }

        const symptomsChecked = Array.from(document.querySelectorAll('input[name="symptom"]:checked'));
        if (symptomsChecked.length === 0) {
            app.showToast('FALTA SÍNTOMAS', 'Seleccione al menos un síntoma para el análisis.', 'warning');
            return;
        }

        // Show scanning state
        const idle = document.getElementById('diag-idle');
        const scanning = document.getElementById('diag-scanning');
        const result = document.getElementById('diag-result');
        const terminalFeed = document.getElementById('scan-terminal');

        idle.classList.add('hidden');
        result.classList.add('hidden');
        scanning.classList.remove('hidden');

        // Typing log simulation
        const logs = [
            'Inicializando bus de comunicaciones PCI...',
            'Escaneando módulos de memoria RAM físicos...',
            'Analizando sectores lógicos de almacenamiento...',
            'Ejecutando diagnóstico térmico en CPU/GPU...',
            'Correlacionando bases de datos de fallos...',
            'Estructurando estimación económica...'
        ];

        let logIndex = 0;
        terminalFeed.textContent = logs[0];
        const logTimer = setInterval(() => {
            logIndex++;
            if (logIndex < logs.length) {
                terminalFeed.textContent = logs[logIndex];
            } else {
                clearInterval(logTimer);
                showDiagnosisReport(client, deviceType + ' ' + model, symptomsChecked);
            }
        }, 400);
    }

    function showDiagnosisReport(client, fullDeviceName, symptoms) {
        const scanning = document.getElementById('diag-scanning');
        const result = document.getElementById('diag-result');

        scanning.classList.add('hidden');
        result.classList.remove('hidden');

        let rawCost = 0;
        let rawDays = 0;
        let symptomNames = [];

        symptoms.forEach(chk => {
            rawCost += parseFloat(chk.getAttribute('data-cost'));
            rawDays += parseInt(chk.getAttribute('data-time'), 10);
            symptomNames.push(chk.parentNode.textContent.trim().split('(+')[0]);
        });

        // Priority Multiplier
        const prioritySelect = document.getElementById('rep-priority');
        const mult = parseFloat(prioritySelect.options[prioritySelect.selectedIndex].getAttribute('data-mult'));
        const priorityVal = prioritySelect.value;

        let finalCost = rawCost * mult;
        let subtotal = finalCost / 1.18;
        let igv = subtotal * 0.16;
        let ipm = subtotal * 0.02;
        let finalDays = rawDays;

        if (priorityVal === 'express') {
            finalDays = Math.max(1, Math.ceil(rawDays * 0.5));
        } else if (priorityVal === 'insane') {
            finalDays = 1;
        }

        // Fill HTML output
        document.getElementById('res-device').textContent = fullDeviceName;
        document.getElementById('res-client').textContent = client;
        document.getElementById('res-symptoms').textContent = symptomNames.join(', ');
        document.getElementById('res-subtotal').textContent = `S/. ${subtotal.toFixed(2)}`;
        document.getElementById('res-igv').textContent = `S/. ${igv.toFixed(2)}`;
        document.getElementById('res-ipm').textContent = `S/. ${ipm.toFixed(2)}`;
        document.getElementById('res-cost').textContent = `S/. ${finalCost.toFixed(2)}`;
        document.getElementById('res-time').textContent = `${finalDays} ${finalDays === 1 ? 'Día' : 'Días'}`;

        result.dataset.client = client;
        result.dataset.device = fullDeviceName;
        result.dataset.cost = finalCost.toFixed(2);
    }

    function confirmServiceOrder() {
        const resultPanel = document.getElementById('diag-result');
        const client = resultPanel.dataset.client;
        const device = resultPanel.dataset.device;
        const cost = resultPanel.dataset.cost;

        app.showModal('ORDEN CONFIRMADA', `
            <p>La orden de servicio técnico ha sido ingresada a la central de soporte.</p>
            <p>Dispositivo: <strong>${device}</strong><br>Cliente: <strong>${client}</strong><br>Costo pactado: <strong>S/. ${cost} (con IGV)</strong></p>
            <p>Un técnico especializado se pondrá en contacto pronto. ¡Código de orden: INS-REP-${Math.floor(Math.random()*9000)+1000}!</p>
        `);

        activeSupportOrders++;
        document.getElementById('widget-repair-count').textContent = activeSupportOrders;

        resetDiagnosis();
    }

    function resetDiagnosis() {
        document.getElementById('repair-form').reset();
        document.getElementById('diag-result').classList.add('hidden');
        document.getElementById('diag-scanning').classList.add('hidden');
        document.getElementById('diag-idle').classList.remove('hidden');
    }

    function downloadInvoice() {
        if (!lastInvoiceBody || !lastOrderNumber) {
            app.showToast('ERROR', 'No hay ningún comprobante reciente para descargar.', 'error');
            return;
        }

        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante INSANO TECH HUB #${lastOrderNumber}</title>
    <style>
        body { font-family: monospace; background: #fafafa; padding: 20px; color: #222; }
        .receipt { max-width: 450px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 6px; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
    <div class="receipt">
        ${lastInvoiceBody}
    </div>
</body>
</html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = `comprobante-INS-${lastOrderNumber}.html`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        app.showToast('DESCARGA COMPLETADA', 'El comprobante ha sido descargado en tu equipo.', 'success');
    }

    function printInvoice() {
        if (!lastInvoiceBody || !lastOrderNumber) {
            app.showToast('ERROR', 'No hay ningun comprobante reciente para imprimir.', 'error');
            return;
        }

        const printArea = document.getElementById('printable-receipt');
        if (printArea) {
            // Inject cleaner markup specifically styled for the receipt print preview
            printArea.innerHTML = `
                <div style="max-width: 450px; margin: 0 auto; padding: 20px; font-family: monospace; line-height: 1.5; color: #000; background: #fff;">
                    ${lastInvoiceBody}
                </div>
            `;
            
            // Trigger native print dialog (which only targets #printable-receipt via media query)
            window.print();
            
            // Clear content after printing to reset state
            printArea.innerHTML = '';
        } else {
            app.showToast('ERROR', 'No se encontro el area de impresion del comprobante.', 'error');
        }
    }

    // Set triggers
    document.addEventListener('DOMContentLoaded', () => {
        const btnDiag = document.getElementById('btn-diagnostico');
        if (btnDiag) btnDiag.addEventListener('click', runDiagnosis);

        const btnConfirm = document.getElementById('btn-confirmar-servicio');
        if (btnConfirm) btnConfirm.addEventListener('click', confirmServiceOrder);

        const btnCancel = document.getElementById('btn-cancelar-diagnostico');
        if (btnCancel) btnCancel.addEventListener('click', resetDiagnosis);

        const checkoutBtn = document.getElementById('cart-checkout-btn');
        if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    });

    const publicAPI = {
        init: () => {
            renderCatalog();
            updateCartUI();
        },
        addToCart,
        buyLicenseDirect,
        removeFromCart,
        toggleCart,
        downloadInvoice,
        printInvoice,
        selectPlan,
        addLicenseWithPlan
    };
    Object.freeze(publicAPI);
    return publicAPI;
})();
