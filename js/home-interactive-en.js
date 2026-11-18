/**
 * Interactive Home Features (English): Typewriter, Animated Counters, and AI Inference Sandbox
 * RACM - AI & Data Science
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. HERO TYPEWRITER EFFECT
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const phrases = [
            'Autonomous Agents & Graphs (LangGraph)',
            'MLOps Pipelines & Production APIs (Docker/FastAPI)',
            'Enterprise RAG Systems with Embeddings & Gemini',
            'Deep Learning & Computer Vision Diagnostics',
            'Medallion Data Architectures & KDD Mining'
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
                typingSpeed = 30;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 65;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(type, typingSpeed);
        }

        type();
    }

    // 2. ANIMATED SCROLL COUNTERS (INTERSECTION OBSERVER)
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

    // 3. INTERACTIVE AI INFERENCE SANDBOX (TERMINAL)
    const terminalBody = document.getElementById('terminal-content');
    const terminalButtons = document.querySelectorAll('.terminal-btn');

    const DEMOS = {
        churn: {
            title: 'fastapi-mlops: infer --model churn_rf_v2',
            output: `
<span class="terminal-prompt">$ curl -X POST "https://api.racm-ai.io/v1/predict/churn" \\</span>
<span class="terminal-prompt">  -H "Content-Type: application/json" \\</span>
<span class="terminal-prompt">  -d '{"tenure": 2, "monthly_charges": 89.5, "contract": "Month-to-month", "tech_support": false}'</span>

<span class="terminal-success">[200 OK]</span> Inference completed in <span class="terminal-metric">23.4 ms</span> (MLflow Run: <span class="terminal-json-key">#run_b84f9a</span>)
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
<span class="terminal-prompt">$ python -m documind.cli query --q "What are the key findings of the clinical report?"</span>

<span class="terminal-metric">[FAISS Vector Search]</span> Top-k = 3 chunks retrieved in <span class="terminal-metric">14.1 ms</span>
  ├─ Chunk 1: <span class="terminal-json-val">"Clinical_Report_2026.pdf"</span> (Page 12, Similarity Score: <span class="terminal-json-num">0.938</span>)
  ├─ Chunk 2: <span class="terminal-json-val">"Metabolic_Biomarkers.pdf"</span> (Page 4, Similarity Score: <span class="terminal-json-num">0.892</span>)
  └─ Chunk 3: <span class="terminal-json-val">"Endocrine_Analysis.pdf"</span> (Page 19, Similarity Score: <span class="terminal-json-num">0.875</span>)

<span class="terminal-success">[Gemini Pro Synthesis]</span> Contextualized RAG generation:
<span class="terminal-json-val">"Based on the biomarkers analyzed on page 12, a 34% reduction in inflammatory markers is observed following the assisted metabolic protocol. Maintaining automated monitoring is recommended."</span>

<span class="terminal-metric">[RAG Metrics]</span> Context Faithfulness: <span class="terminal-json-num">0.98</span> | Answer Relevance: <span class="terminal-json-num">0.96</span>`
        },
        langgraph: {
            title: 'langgraph-agent: dispatch --graph sales_agent_state',
            output: `
<span class="terminal-prompt">$ python -m agents.sales dispatch --session-id "usr_94821"</span>

<span class="terminal-metric">[LangGraph State Machine]</span> Starting adaptive workflow with PostgreSQL persistence...
  [Node 1: parse_intent] ──> Intent: <span class="terminal-json-val">"ENTERPRISE_PROSPECTING"</span> (Confidence: <span class="terminal-json-num">0.97</span>)
  [Node 2: conditional_routing] ──> Tool calls required: <span class="terminal-success">YES</span>
  [Node 3: tool_calling] ──> Executing: <span class="terminal-json-key">query_crm_inventory(tier='enterprise')</span>
  [Node 4: state_update] ──> 3 available options found in database.
  [Node 5: generate_proposal] ──> Synthesizing proposal with Google Gemini...

<span class="terminal-success">[Final State: COMPLETED]</span>
<span class="terminal-json-val">"Hello! We have reviewed your enterprise requirements and generated a custom proposal tailored to your scale with serverless architecture and dedicated MLOps support."</span>`
        }
    };

    function loadDemo(demoKey) {
        if (!terminalBody || !DEMOS[demoKey]) return;
        terminalBody.innerHTML = '<div style="color: #94a3b8; font-style: italic;">Running pipeline and routing inference...</div>';

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

    // Load initial demo
    loadDemo('churn');

    // 4. FAQ ACCORDION
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });

            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
});
