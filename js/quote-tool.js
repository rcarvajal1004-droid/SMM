document.addEventListener('DOMContentLoaded', () => {
            
            // --- BTU Calculator Logic ---
            const areaInput = document.getElementById('area');
            const peopleInput = document.getElementById('people');
            const sunSelect = document.getElementById('sun');
            const btuValueDisplay = document.getElementById('btuValue');
            const tonValueDisplay = document.getElementById('tonValue');

            function calculateBTU() {
                const area = parseFloat(areaInput.value) || 0;
                let people = parseInt(peopleInput.value) || 1;
                const sun = sunSelect.value;

                if (area === 0) {
                    btuValueDisplay.textContent = '0';
                    tonValueDisplay.textContent = 'Aprox. 0 Toneladas';
                    return;
                }

                // Base calculation: roughly 600 BTU per square meter
                let btu = area * 600;

                // Adjust for people (add 500 BTU for each person over 2)
                if (people > 2) {
                    btu += (people - 2) * 500;
                }

                // Adjust for sun exposure
                if (sun === 'high') {
                    btu *= 1.15; // +15%
                } else if (sun === 'low') {
                    btu *= 0.90; // -10%
                }

                // Round to nearest 500
                btu = Math.ceil(btu / 500) * 500;
                
                // Calculate Tons (1 Ton = ~12,000 BTU)
                let tons = (btu / 12000).toFixed(1);

                // Format number with commas
                btuValueDisplay.textContent = btu.toLocaleString();
                tonValueDisplay.textContent = `Aprox. ${tons} Toneladas`;
            }

            areaInput.addEventListener('input', calculateBTU);
            peopleInput.addEventListener('input', calculateBTU);
            sunSelect.addEventListener('change', calculateBTU);

            // --- Multi-step Form Logic ---
            let currentStep = 1;
            const totalSteps = 3;

            const btnNext = document.getElementById('btnNext');
            const btnPrev = document.getElementById('btnPrev');
            const btnSubmit = document.getElementById('btnSubmit');
            const progressBar = document.getElementById('progressBar');
            const stepIndicatorText = document.getElementById('stepIndicatorText');
            
            const step1Div = document.getElementById('step1');
            const step2Div = document.getElementById('step2');
            const step3Div = document.getElementById('step3');

            const label1 = document.getElementById('labelStep1');
            const label2 = document.getElementById('labelStep2');
            const label3 = document.getElementById('labelStep3');

            function updateUI() {
                // Update Progress Bar & Text
                progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
                stepIndicatorText.textContent = `Paso ${currentStep} de ${totalSteps}`;

                // Update Labels
                label1.className = currentStep >= 1 ? 'text-primary transition-colors' : 'text-outline transition-colors';
                label2.className = currentStep >= 2 ? 'text-primary transition-colors' : 'text-outline transition-colors';
                label3.className = currentStep >= 3 ? 'text-primary transition-colors' : 'text-outline transition-colors';

                // Handle Buttons
                if (currentStep === 1) {
                    btnPrev.classList.add('hidden');
                    btnNext.classList.remove('hidden');
                    btnSubmit.classList.add('hidden');
                } else if (currentStep === totalSteps) {
                    btnPrev.classList.remove('hidden');
                    btnNext.classList.add('hidden');
                    btnSubmit.classList.remove('hidden');
                    populateSummary();
                } else {
                    btnPrev.classList.remove('hidden');
                    btnNext.classList.remove('hidden');
                    btnSubmit.classList.add('hidden');
                }

                // Handle Step Visibility with smooth transition
                [step1Div, step2Div, step3Div].forEach((el, index) => {
                    if (index + 1 === currentStep) {
                        el.classList.remove('hidden');
                        // Small delay to allow display:block to apply before opacity transition
                        setTimeout(() => el.classList.remove('opacity-0'), 50);
                    } else {
                        el.classList.add('opacity-0');
                        setTimeout(() => el.classList.add('hidden'), 300);
                    }
                });
            }

            function populateSummary() {
                const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
                const propertyType = document.querySelector('input[name="propertyType"]:checked').value;
                const urgency = document.getElementById('urgency').value;
                
                const urgencyMap = {
                    'standard': 'Estándar',
                    'urgent': 'Urgente',
                    'planning': 'Planificación'
                };

                document.getElementById('summaryService').textContent = serviceType === 'hvac' ? 'Sistemas HVAC' : 'Servicios Eléctricos';
                document.getElementById('summaryProperty').textContent = propertyType;
                document.getElementById('summaryUrgency').textContent = urgencyMap[urgency] || urgency;
            }

            btnNext.addEventListener('click', () => {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateUI();
                }
            });

            btnPrev.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateUI();
                }
            });

            btnSubmit.addEventListener('click', () => {
                // Formatting message for WhatsApp
                const service = document.getElementById('summaryService').textContent;
                const property = document.getElementById('summaryProperty').textContent;
                const urgency = document.getElementById('summaryUrgency').textContent;
                const desc = document.getElementById('description').value;

                let message = `Hola ClimaTech, me gustaría solicitar una cotización:\n\n`;
                message += `*Servicio:* ${service}\n`;
                message += `*Propiedad:* ${property}\n`;
                message += `*Urgencia:* ${urgency}\n`;
                if (desc) message += `*Detalles:* ${desc}\n`;

                // Replace with actual company number
                const whatsappNumber = "1234567890"; 
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                
                window.open(whatsappUrl, '_blank');
            });
            
            // Initial call
            updateUI();
        });