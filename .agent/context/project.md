# Project Context: EjeClick - High-Conversion Platform

## 1. Executive Summary & Core Objective
**EjeClick** lleva tecnología real a pequeñas empresas para que vendan y envíen en automático. Sin tecnicismos, sin promesas falsas, solo herramientas que funcionan.
* **Meta Inmediata:** Construir una Landing Page de conversión masiva en tiempo récord con velocidad y confiabilidad enterprise.
* **Propósito del Archivo:** Actuar como la "fuente única de la verdad" (SSOT) para agentes de IA, asegurando que cada línea de código frontend y backend responda a criterios estrictos de Conversión (CRO), Accesibilidad (WCAG) y Rendimiento.

---

## 2. Technical Stack
El sistema debe ser modular, escalable, ultra-rápido e inmune a la sobrecarga cognitiva.

* **Frontend:** React (Última versión estable) + Vite (para builds instantáneos) + Tailwind CSS (para maquetación Bento Grid fluida).
* **Backend:** FastAPI (Python, última versión) para un manejo asíncrono de alto rendimiento, documentación automática (OpenAPI/Swagger) y enrutamiento veloz.
* **Base de Datos:** PostgreSQL (para almacenamiento analítico, leads, datos geográficos y configuraciones dinámicas).
* **Optimización de Assets:** Imágenes en formato WebP/AVIF con Lazy Loading nativo.

---

## 3. Conversion Engineering Rules (Strict Constraints)
Cualquier componente UI/UX generado por la IA debe cumplir rigurosamente con estas métricas analíticas:

| Métrica / Parámetro | Restricción Técnica / Límite Estricto |
| :--- | :--- |
| **Tiempo de Carga (LCP)** | < 2.4 segundos (Compresión agresiva, scripts diferidos). |
| **Densidad Visual** | Máximo 400 elementos en el DOM para evitar fatiga cognitiva. |
| **Longitud de Copys** | Entre 250 y 725 palabras totales en toda la landing. |
| **Campos de Formulario** | Máximo 3 a 4 campos (Captura progresiva: Nombre, Email, WhatsApp, Negocio). |
| **Tráfico Objetivo** | Mobile-First (80%+ del tráfico estimado proviene de smartphones). |

---

## 4. Persuasive Architecture & UI Components (AIDCA Model)

### Hero Section (Pliegue Inicial - Sin Scroll)
* **Titular:** Enfoque directo en el beneficio (evitar jerga técnica abstracta). Ej: *"Tu negocio local en Internet, vendiendo en automático."*
* **Subtítulo:** Mapeo semántico del valor (ej. *"Llevamos tecnología real a pequeñas empresas para que vendan y envíen en automático"*).
* **CTA Principal:** Botón de alto contraste con texto orientado al beneficio (*"Quiero Digitalizar mi Negocio"*).
* **Fricción Cero:** Texto adyacente: *"Sin contratos forzosos • Diagnóstico inicial gratuito"*.

### Bento Grid Showcase
* Sección modular usando CSS Grid para fragmentar las capacidades de EjeClick (Desarrollo Web, SEO Local, Campañas de Tráfico, Soporte Técnico) en bloques independientes y proporcionales.
* Cada bloque combina micro-animaciones interactivas o capturas de interfaces reales en modo oscuro/claro nativo.

### Social Proof & Credibilidad (Sección Wrike / Aragon AI)
* Tabla comparativa directa que contraste los problemas de las agencias tradicionales lentas vs. la agilidad y soporte directo de **EjeClick**.
* Sección para alojar métricas contundentes o testimonios con validación social en tiempo real.

---

## 5. Accessibility & Performance Standards (POUR)
* **P - Perceptibilidad:** Contraste de color AA/AAA garantizado vía Tailwind. Texto alternativo estricto (`alt=""`) en cada recurso visual.
* **O - Operabilidad:** Navegación por teclado 100% funcional. Formularios interactivos sin trampas de foco. Sticky-bar móvil para mantener el CTA accesible en todo momento.
* **U - Comprensibilidad:** Validaciones de errores en tiempo real en los inputs del backend (FastAPI `Pydantic ValidationError` traducido a mensajes de interfaz claros).
* **R - Robustez:** Código semántico HTML5 válido. Datos estructurados implementados mediante JSON-LD (`FAQPage` y `LocalBusiness` Schema) para indexación SEO inteligente.

---

## 6. Implementation Roadmap (Phases for the Agent)

### Phase 1: Backend & Data Architecture (FastAPI + Postgres)
1. Configurar entorno FastAPI con soporte CORS para el frontend de React.
2. Diseñar modelos de datos en PostgreSQL para la captura de leads, logs de analítica básica y geolocalización por IP.
3. Crear endpoints asíncronos (`/api/v1/leads`) optimizados para respuestas en milisegundos.

### Phase 2: Frontend Core & Bento Architecture (React + Tailwind)
1. Setup de React con Vite y configuración de rutas limpias (recorrido cerrado sin menús de escape).
2. Construcción de la interfaz móvil inteligente y layouts Bento Grid responsivos.
3. Integración de animaciones ligeras disparadas por scroll.

### Phase 3: Sincronización, Personalización Dinámica y Deploy
1. Implementar scripts frontend para ajustar copys o números telefónicos según parámetros de URL o geolocalización (Message Match).
2. Auditoría final de rendimiento con Lighthouse (Objetivo: >95% en Performance y Accesibilidad).
3. Preparación para pruebas A/B de titulares en la fase post-lanzamiento.
