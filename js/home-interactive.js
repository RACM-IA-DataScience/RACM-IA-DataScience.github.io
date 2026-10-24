/**
 * Interactive Home Features: Typewriter, Animated Counters, and AI Inference Sandbox
 * RACM - IA & Data Science
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. EFECTO TYPEWRITER EN EL HERO
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const phrases = [
            'Agentes Autónomos & Grafos (LangGraph)',
            'Pipelines de MLOps & APIs Productivas (Docker/FastAPI)',
            'Sistemas RAG Empresariales con Embeddings & Gemini',
            'Deep Learning & Diagnóstico por Visión Artificial',
            'Arquitecturas de Datos Medallion & Minería KDD'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 50;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 25;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 65;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pausa al completar la frase
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400; // Pausa antes de la siguiente frase
            }

            setTimeout(type, typingSpeed);
        }

        type();
    }

    // 2. CONTADORES ANIMADOS AL HACER SCROLL (INTERSECTION OBSERVER)
    const counters = document.querySelectorAll('.metric-number');
    let countersTriggered = false;

    function runCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = target / 40;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current) + suffix;
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target + suffix;
                }
            };

            updateCount();
        });
    }

    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersTriggered) {
                    countersTriggered = true;
                    runCounters();
                }
            });
        }, { threshold: 0.3 });

        const metricsSection = document.querySelector('.metrics-grid');
        if (metricsSection) {
            observer.observe(metricsSection);
        }
    }

    // 3. SANDBOX INTERACTIVO DE INFERENCIA DE IA (TERMINAL)
    const terminalBody = document.getElementById('terminal-content');
    const terminalButtons = document.querySelectorAll('.terminal-btn');

    const DEMOS = {
        churn: {
            title: 'fastapi-mlops: infer --model churn_rf_v2',
            output: `
<span class="terminal-prompt">$ curl -X POST "https://api.racm-ai.io/v1/predict/churn" \\</span>
<span class="terminal-prompt">  -H "Content-Type: application/json" \\</span>
<span class="terminal-prompt">  -d '{"tenure": 2, "monthly_charges": 89.5, "contract": "Month-to-month", "tech_support": false}'</span>

<span class="terminal-success">[200 OK]</span> Inferencia completada en <span class="terminal-metric">23.4 ms</span> (MLflow Run: <span class="terminal-json-key">#run_b84f9a</span>)
<span class="terminal-json-key">{</span>
  <span class="terminal-json-key">"prediction"</span>: <span class="terminal-json-val">"CHURN_DETECTED"</span>,
  <span class="terminal-json-key">"churn_probability"</span>: <span class="terminal-json-num">0.8742</span>,
  <span class="terminal-json-key">"risk_tier"</span>: <span class="terminal-json-val">"HIGH_RISK"</span>,
  <span class="terminal-json-key">"recommended_action"</span>: <span class="terminal-json-val">"AUTOMATED_RETENTION_OFFER_DISCOUNT_30"</span>,
  <span class="terminal-json-key">"model_metadata"</span>: {
    <span class="terminal-json-key">"algorithm"</span>: <span class="terminal-json-val">"RandomForestClassifier"</span>,
    <span class="terminal-json-key">"versioned_dataset"</span>: <span class="terminal-json-val">"dvc://data/churn_v1.parquet"</span>,
    <span class="terminal-json-key">"container_id"</span>: <span class="terminal-json-val">"docker://churn-api:latest"</span>
  }
<span class="terminal-json-key">}</span>`
        },
        rag: {
            title: 'documind-rag: query --vector-db faiss --llm gemini-pro',
            output: `
<span class="terminal-prompt">$ python -m documind.cli query --q "¿Cuáles son las conclusiones clave del reporte clínico?"</span>

<span class="terminal-metric">[FAISS Vector Search]</span> Top-k = 3 fragmentos recuperados en <span class="terminal-metric">14.1 ms</span>
  ├─ Fragmento 1: <span class="terminal-json-val">"Reporte_Clinico_2026.pdf"</span> (Pág. 12, Score de similitud: <span class="terminal-json-num">0.938</span>)
  ├─ Fragmento 2: <span class="terminal-json-val">"Biomarcadores_Metabolicos.pdf"</span> (Pág. 4, Score de similitud: <span class="terminal-json-num">0.892</span>)
  └─ Fragmento 3: <span class="terminal-json-val">"Analisis_Endocrino.pdf"</span> (Pág. 19, Score de similitud: <span class="terminal-json-num">0.875</span>)

<span class="terminal-success">[Gemini Pro Synthesis]</span> Generación RAG contextualizada:
<span class="terminal-json-val">"De acuerdo con los biomarcadores analizados en la pág. 12, se observa una reducción del 34% en marcadores inflamatorios tras la pauta metabólica asistida. Se recomienda mantener el protocolo de monitoreo automatizado."</span>

<span class="terminal-metric">[Métricas RAG]</span> Context Faithfulness: <span class="terminal-json-num">0.98</span> | Answer Relevance: <span class="terminal-json-num">0.96</span>`
        },
        langgraph: {
            title: 'langgraph-agent: dispatch --graph sales_agent_state',
            output: `
<span class="terminal-prompt">$ python -m agents.sales dispatch --session-id "usr_94821"</span>

<span class="terminal-metric">[LangGraph State Machine]</span> Iniciando flujo adaptativo con persistencia PostgreSQL...
  [Nodo 1: parse_intent] ──> Intención: <span class="terminal-json-val">"PROSPECCION_PREMIUM"</span> (Confianza: <span class="terminal-json-num">0.97</span>)
  [Nodo 2: conditional_routing] ──> Evaluación de herramientas requeridas: <span class="terminal-success">SI</span>
  [Nodo 3: tool_calling] ──> Ejecutando: <span class="terminal-json-key">query_crm_inventory(tier='enterprise')</span>
  [Nodo 4: state_update] ──> 3 opciones disponibles encontradas en base de datos.
  [Nodo 5: generate_proposal] ──> Sintetizando propuesta con Google Gemini...

<span class="terminal-success">[Estado Final: COMPLETED]</span>
<span class="terminal-json-val">"Hola. Hemos verificado tu requerimiento empresarial y generado una cotización adaptada a tu escala con arquitectura serverless y soporte MLOps dedicado."</span>`
        }
    };

    function loadDemo(demoKey) {
        if (!terminalBody || !DEMOS[demoKey]) return;
        terminalBody.innerHTML = '<div style="color: #94a3b8; font-style: italic;">Ejecutando pipeline y canalizando inferencia...</div>';
        
        setTimeout(() => {
            terminalBody.innerHTML = DEMOS[demoKey].output;
            const titleElem = document.querySelector('.terminal-title');
            if (titleElem) titleElem.textContent = DEMOS[demoKey].title;
        }, 180);
    }

    terminalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            terminalButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const demoKey = btn.getAttribute('data-demo');
            loadDemo(demoKey);
        });
    });

    // Cargar demo inicial
    loadDemo('churn');
});
