# Skill: Experto en SEO/CRO — EjeClick

## When to use
- Optimizar meta tags, Open Graph, Twitter Cards
- Crear o modificar schemas JSON-LD (Organization, LocalBusiness, FAQPage, etc.)
- Ajustar copys, titulares, CTAs para conversión (modelo AIDCA)
- Optimizar Lighthouse: Performance, SEO, A11y, Best Practices
- Configurar analítica (Google Analytics 4, Meta Pixel)
- Pruebas A/B de titulares y elementos de conversión
- Estructura de landing page para maximizar conversión

## Estado actual del SEO

### Meta tags (index.html)
```html
<title>EjeClick — Agencia de Desarrollo Web para Negocios Locales</title>
<meta name="description" content="Diseñamos y desarrollamos sitios web..." />
<meta name="keywords" content="desarrollo web, diseño web, marketing digital, SEO local..." />
<link rel="canonical" href="https://ejeclick.com" />
```

### Open Graph
```html
<meta property="og:title" content="EjeClick — Tu Negocio en Internet, Vendiendo en Automático" />
<meta property="og:locale" content="es_CO" />
```

### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image" />
```

### JSON-LD Schemas
- `Organization` (index.html) — nombre, descripción, url, contacto
- `LocalBusiness` (index.html) — nombre, precio, horario
- `FAQPage` (FAQSection.tsx) — inyectado dinámicamente con cada pregunta/respuesta

## Modelo de conversión AIDCA

| Etapa | Sección | Elemento |
|---|---|---|
| **A**ttention | Hero | 3D interactivo + Badge (+50 negocios) |
| **I**nterest | SocialProof | Métricas (<2.4s, 95+, 7 días) + tabla comparativa |
| **D**esire | ServicesGrid | Bento con 5 servicios + iconos + descripciones |
| **C**onviction | ProcessSection + FAQ | Timeline de 4 pasos + 5 preguntas frecuentes |
| **A**ction | ContactSection | Formulario + CTA "Solicitar Diagnóstico Gratuito" |

## Reglas estrictas

### SEO Técnico
- Cada página: **único** `<title>` + `<meta description>` (50-160 chars)
- **Canonical** siempre presente
- **Open Graph** + **Twitter Cards** en todas las páginas
- **JSON-LD** para: Organization, LocalBusiness, FAQPage (ya implementados)
- `lang="es"` en `<html>` (ya implementado)
- Sitemap.xml (implementar si hay más páginas)
- robots.txt (implementar si hay más páginas)

### Schema JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "¿Pregunta?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Respuesta."
    }
  }]
}
```

### Conversión (CRO)
- **CTA Principal**: texto orientado a beneficio, no genérico ("Digitalizar mi Negocio" ✅ vs "Enviar" ❌)
- **Formulario**: máximo 4 campos (Nombre, Email, WhatsApp, Tipo de Negocio) — ya implementado
- **Fricción Cero**: "Sin contratos forzosos • Diagnóstico inicial gratuito" junto al CTA
- **Social Proof**: toda afirmación respaldada con datos concretos (+50 negocios, <2.4s, 95+)
- **Mobile First**: 80%+ tráfico estimado desde smartphones — todo debe funcionar en 375px

### Lighthouse Scores
| Métrica | Objetivo | Estado actual |
|---|---|---|
| Performance | >90 | Pendiente de medir |
| Accessibility | >95 | ✅ WCAG completo |
| Best Practices | >95 | Pendiente de medir |
| SEO | >95 | ✅ |

### Analítica (pendiente de implementar)
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s){...}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
</script>
```

### Lo que NO está implementado
- [ ] Google Analytics 4
- [ ] Meta Pixel
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Pruebas A/B
- [ ] Message Match (copys dinámicos por URL/geolocalización)
- [ ] Imagen Open Graph (og:image)
- [ ] Twitter Card image

## Comandos
```bash
# Lighthouse local
npx lighthouse http://localhost:5173 --view

# Validar JSON-LD
# https://search.google.com/test/rich-results

# Probar SEO
# https://www.heymeta.com/
```
