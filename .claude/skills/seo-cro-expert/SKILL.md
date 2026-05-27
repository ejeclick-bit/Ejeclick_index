---
name: seo-cro-expert
description: >
  Especialista en SEO técnico y optimización de conversión (CRO) para
  EjeClick. Optimiza meta tags, schemas JSON-LD, modelo AIDCA, Lighthouse
  scores, analítica (GA4, Meta Pixel) y pruebas A/B.
version: 1.0.0
triggers:
  - seo
  - cro
  - conversion
  - json-ld / schema
  - open graph
  - twitter card
  - lighthouse
  - analitica / analytics
  - ga4 / google analytics
  - meta pixel
  - a/b testing
  - meta tags
  - copy / titular / cta
  - aidca
related_skills:
  - react-expert
  - devops-expert
---

# Skill: seo-cro-expert

## Description

Experto en SEO técnico y optimización de conversión (CRO) para EjeClick. Responsable de mantener meta tags, Open Graph, Twitter Cards, schemas JSON-LD (Organization, LocalBusiness, FAQPage), modelo AIDCA, Lighthouse scores >95, analítica (GA4, Meta Pixel), y pruebas A/B de titulares y CTAs.

## Stack

| Herramienta | Propósito | Estado |
|---|---|---|
| Open Graph | Compartir en redes sociales | ✅ |
| Twitter Cards | Compartir en X/Twitter | ✅ |
| JSON-LD | Rich results en Google | ✅ |
| Google Analytics 4 | Analítica de tráfico | ❌ Pendiente |
| Meta Pixel | Conversión en Facebook/IG | ❌ Pendiente |
| Lighthouse | Auditoría de calidad | ❌ Pendiente medir |

## Estado actual del SEO

```html
<!-- index.html — ya implementado -->
<title>EjeClick — Agencia de Desarrollo Web para Negocios Locales</title>
<meta name="description" content="Diseñamos y desarrollamos sitios web profesionales para microempresas...">
<meta property="og:title" content="EjeClick — Tu Negocio en Internet, Vendiendo en Automático">
<meta property="og:locale" content="es_CO">
<meta name="twitter:card" content="summary_large_image">
```

```json
// JSON-LD: Organization + LocalBusiness (index.html)
// JSON-LD: FAQPage (FAQSection.tsx, dinámico)
```

## Modelo de conversión AIDCA

| Etapa | Sección | Elemento clave | Estado |
|---|---|---|---|
| **A**ttention | Hero | 3D interactivo + Badge (+50 negocios) | ✅ |
| **I**nterest | SocialProof | Métricas (<2.4s, 95+, 7 días) + tabla | ✅ |
| **D**esire | ServicesGrid | Bento con 5 servicios | ✅ |
| **C**onviction | ProcessSection + FAQ | Timeline 4 pasos + 5 FAQs | ✅ |
| **A**ction | ContactSection | Form + CTA "Solicitar Diagnóstico Gratuito" | ✅ |

## Workflow

### Paso 1: Optimizar meta tags por página

```html
<!-- Template para cualquier página nueva -->
<title>EjeClick — {Beneficio Principal para {Audiencia}}</title>
<meta name="description" content="{Beneficio}. {Diferenciador}. {CTA}. [{keywords}]">
<meta property="og:title" content="EjeClick — {Beneficio}">
<meta property="og:description" content="{Misma que description, 2-3 oraciones}">
<meta name="twitter:title" content="EjeClick — {Beneficio}">
<meta name="twitter:description" content="{Misma que og:description}">
```

Reglas:
- Title: 40-60 caracteres
- Description: 120-160 caracteres
- Palabra clave principal en title + description + H1
- `og:image` mínimo 1200x630px

### Paso 2: Verificar schemas JSON-LD

```bash
# Probar con Rich Results Test de Google
# https://search.google.com/test/rich-results

# O con curl
curl -s https://ejeclick.com | grep -o 'application/ld+json">.*</script>' | head -1
```

### Paso 3: Medir Lighthouse

```bash
# Local
npx lighthouse http://localhost:5173 --view --preset=desktop
npx lighthouse http://localhost:5173 --view --preset=desktop --quiet --chrome-flags="--headless"

# Objetivos: Performance >90, Accessibility >95, SEO >95, Best Practices >95
```

### Paso 4: Implementar analítica (cuando se requiera)

```html
<!-- Google Analytics 4 — insertar en index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Meta Pixel — insertar en index.html -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'XXXXXXXXXXXXXXX');
  fbq('track', 'PageView');
</script>
```

## Reglas estrictas

| Regla | Explicación |
|---|---|
| 1 title único por página | `<title>` descriptivo, 40-60 chars |
| 1 description única | 120-160 chars con keyword + CTA |
| Canonical siempre | `<link rel="canonical">` |
| JSON-LD para datos estructurados | Organization, LocalBusiness, FAQPage |
| `lang="es"` en `<html>` | Ya implementado |
| CTA orientado a beneficio | "Digitalizar mi Negocio" ✅ vs "Enviar" ❌ |
| Formulario máx 4 campos | Nombre, Email, WhatsApp, Tipo Negocio |
| Fricción cero junto al CTA | "Sin contratos • Diagnóstico gratuito" |
| Mobile First | Testear todo en 375px |

## Lo que NO está implementado (pendiente)

- [ ] Google Analytics 4 — configurar G-ID
- [ ] Meta Pixel — configurar Pixel ID
- [ ] `og:image` — imagen 1200x630px para redes sociales
- [ ] `twitter:image` — misma imagen que og:image
- [ ] Sitemap.xml — si hay más páginas
- [ ] robots.txt — si hay más páginas
- [ ] Pruebas A/B de titulares del Hero
- [ ] Message Match — copys dinámicos por URL/geolocalización

## Edge Cases

| Situación | Manejo |
|---|---|
| Schema inválido | Validar con https://validator.schema.org |
| Lighthouse Performance bajo | Revisar: imágenes sin optimizar, JS grande, sin code splitting |
| Sin imagen OG | Usar hero.png o crear una con "EjeClick" + gradiente |
| Meta description muy larga | Cortar en 160 caracteres con "..." al final |
| Copy no convierte | Probar variante A/B del titular del Hero |
| GA4 bloqueado por adblocker | No afecta al funcionamiento del sitio |

## Lighthouse Objectives

| Métrica | Objetivo | Mínimo |
|---|---|---|
| Performance | 95+ | 90 |
| Accessibility | 100 | 95 |
| Best Practices | 100 | 95 |
| SEO | 100 | 95 |

## Validation / Definition of Done

- [ ] Title único y descriptivo (40-60 chars)
- [ ] Description única (120-160 chars)
- [ ] Open Graph completo (title, description, image, locale)
- [ ] Twitter Card completo (card, title, description, image)
- [ ] JSON-LD válido (Organization + LocalBusiness + FAQPage)
- [ ] Lighthouse: todas las métricas >95
- [ ] Sin errores en Rich Results Test de Google
- [ ] CTA principal orientado a beneficio
- [ ] Formulario con máximo 4 campos
- [ ] Mobile first verificado en 375px

## Related Skills

- `react-expert` — para implementar cambios en componentes con impacto SEO
- `devops-expert` — para configurar redirects, sitemap, robots.txt en nginx
