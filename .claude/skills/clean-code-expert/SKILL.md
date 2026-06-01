---
name: clean-code-expert
description: >
  Especialista en Clean Code, Clean Architecture y calidad de código para
  EjeClick. Aplica principios SOLID, refactorización continua, DRY,
  manejo de errores y tests limpios. No es un skill táctico — es un skill
  de calidad transversal que se aplica SOBRE cualquier otro skill.
when_to_use: >
  clean code, clean architecture, SOLID, refactor, deuda técnica,
  calidad, DRY, boy scout, manejo de errores, principios,
  buenas prácticas, single responsibility, open/closed, liskov,
  interface segregation, dependency inversion, codigo limpio
---

# Skill: clean-code-expert

## Description

Experto en calidad de código para EjeClick. Este skill NO implementa features — **gobierna CÓMO se escribe el código** en cualquier capa del sistema. Se aplica en conjunto con los skills tácticos (react-expert, fastapi-expert, etc.) para asegurar que lo que se construye cumple con estándares profesionales de calidad, mantenibilidad y limpieza.

Citando a Robert C. Martin (Uncle Bob): *"La única manera de ir rápido es ir bien."*

## Stack gobernado

| Principio | Aplica a | Skill relacionado |
|---|---|---|
| Clean Architecture | Frontend + Backend | software-architect |
| SOLID | Backend (Python) + Frontend (TS) | react-expert, fastapi-expert |
| DRY | Todo el código | Todos |
| Boy Scout Rule | Todo el código | Todos |
| Clean Tests | Tests | testing-expert |
| Manejo de Errores | Backend + Frontend | security-expert |

---

## 1. Clean Architecture (Arquitectura Limpia)

### Regla de Dependencias

Las dependencias del código deben apuntar hacia adentro. El código de dominio NUNCA debe depender de frameworks, bases de datos ni detalles de infraestructura.

```
 Capas (de afuera hacia adentro):

 ┌──────────────────────────────────────┐
 │  Frameworks / Drivers  (React, Vite) │  ← Puede cambiar
 ├──────────────────────────────────────┤
 │  Interface Adapters  (API, Routes)   │  ← Conecta el mundo exterior con el caso de uso
 ├──────────────────────────────────────┤
 │  Application / Use Cases            │  ← Lógica de negocio pura
 ├──────────────────────────────────────┤
 │  Domain / Entities                   │  ← Core del negocio (NUNCA CAMBIA)
 └──────────────────────────────────────┘
```

### Aplicación en EjeClick

| Capa | Frontend | Backend |
|---|---|---|
| **Domain** | Tipos/interfaces compartidos (`lib/types.ts`) | Modelos de negocio (`models.py`) |
| **Application** | Hooks personalizados + lógica de estado | Servicios / casos de uso |
| **Interface Adapters** | Componentes (conectan UI con hooks) | Routers (conectan HTTP con servicios) |
| **Frameworks** | React + Vite + Tailwind | FastAPI + SQLAlchemy + PostgreSQL |

### Reglas estrictas

- **Nunca** poner lógica de negocio en un componente React
- **Nunca** poner lógica de negocio en un router de FastAPI
- Los componentes SOLO renderizan y delegan eventos
- Los routers SOLO validan input y llaman servicios
- Los modelos SOLO definen datos, no lógica

---

## 2. Clean Code 2025

### Nombres Significativos

```python
# ❌ Mal
def proc(d):
    pass

# ✅ Bien
def process_payment(transaction: Transaction) -> PaymentResult:
    pass
```

```tsx
// ❌ Mal
const h = (x: any) => x * 2;

// ✅ Bien
const calculateTotalPrice = (basePrice: number) => basePrice * 2;
```

### Funciones Pequeñas

- Una función = una responsabilidad
- Máximo 20 líneas por función
- Máximo 2 parámetros (si necesitas más, usa un objeto)
- Sin efectos secundarios (preferir funciones puras)

### Comentarios

- El código DEBE explicarse solo
- Comentarios solo para POR QUÉ (no para QUÉ o CÓMO)
- Nunca comentar código muerto — borrarlo

### Formateo

- Consistencia en todo el proyecto (Prettier ya configurado)
- Espaciado vertical entre secciones lógicas
- Agrupar imports: externos → internos → estilos

---

## 3. Principios SOLID

### S — Single Responsibility Principle

> Una clase/módulo/función debe tener UNA Y SOLO UNA razón para cambiar.

```python
# ❌ Mal: hace dos cosas
def process_payment_and_send_email(payment_data):
    ...

# ✅ Bien: separado
def process_payment(payment_data) -> PaymentResult:
    ...
def send_confirmation_email(payment: PaymentResult) -> None:
    ...
```

### O — Open/Closed Principle

> Abierto para extensión, cerrado para modificación.

```python
# ✅ Bien: nuevo descuento sin modificar el código existente
DISCOUNT_STRATEGIES: dict[str, Callable] = {
    "regular": lambda p: p * 0.95,
    "vip": lambda p: p * 0.85,
    "holiday": lambda p: p * 0.90,
}

def apply_discount(price: float, customer_type: str) -> float:
    strategy = DISCOUNT_STRATEGIES.get(customer_type, lambda p: p)
    return strategy(price)
```

### L — Liskov Substitution Principle

> Las subclases deben poder sustituir a sus clases base sin alterar el comportamiento.

### I — Interface Segregation Principle

> Muchas interfaces específicas son mejores que una interfaz general.

```tsx
// ❌ Mal
interface UserProps {
  name: string; email: string; onLogin: () => void;
  onLogout: () => void; onUpdateProfile: () => void;
  theme: 'dark' | 'light'; notifications: boolean;
}

// ✅ Bien
interface UserAuth { name: string; email: string; }
interface UserActions { onLogin: () => void; onLogout: () => void; }
interface UserPreferences { theme: 'dark' | 'light'; notifications: boolean; }
```

### D — Dependency Inversion Principle

> Depende de abstracciones, no de implementaciones concretas.

```python
# ❌ Mal: depende de SQLAlchemy directamente
def get_users():
    return db.session.query(User).all()

# ✅ Bien: a través de una abstracción
class UserRepository(ABC):
    @abstractmethod
    def get_all(self) -> list[User]: ...

class SQLAlchemyUserRepository(UserRepository):
    def get_all(self) -> list[User]:
        return db.session.query(User).all()
```

---

## 4. Refactorización Continua (Regla del Boy Scout)

> *"Deja el campamento más limpio de como lo encontraste."*

### Cuándo refactorizar

- Cuando tocas un archivo, déjalo mejor de lo que estaba
- Si ves código que huele mal (code smell), arréglalo AHI MISMO
- No postergues la limpieza para "después" — después nunca llega

### Code Smells comunes en EjeClick

| Smell | Síntoma | Acción |
|---|---|---|
| **Función larga** | >20 líneas | Extraer funciones más pequeñas |
| **Parámetros múltiples** | >3 parámetros | Agrupar en objeto/interface |
| **Código duplicado** | Ctrl+C / Ctrl+V | Extraer a función compartida |
| **Switch/if anidados** | >3 niveles de indentación | Usar polimorfismo o dict dispatch |
| **Comentarios explicativos** | Explican QUÉ hace el código | Renombrar la función para que se explique sola |
| **Código muerto** | Comentado o sin uso | BORRAR (git history lo guarda) |
| **Variable mágica** | Números/strings sin nombre | Constante con nombre descriptivo |

### Proceso de refactorización seguro

1. **Asegurar** que hay tests que cubren el código
2. **Refactorizar** en pasos pequeños (un cambio a la vez)
3. **Ejecutar** tests después de cada paso
4. **Commiter** cada cambio atómico

---

## 5. DRY (Don't Repeat Yourself)

### Tipos de duplicación

| Tipo | Ejemplo | Solución |
|---|---|---|
| Duplicación literal | Mismo código copiado-pegado | Extraer a función |
| Duplicación estructural | Misma estructura con valores diferentes | Parametrizar |
| Duplicación de conocimiento | Misma lógica en capas diferentes | Centralizar en el dominio |

### Reglas

- Si repites código 2 veces → ya deberías haberlo extraído
- Si repites código 3 veces → es OBLIGATORIO refactorizar
- DRY no significa acoplar todo — a veces la duplicación es más barata que la abstracción incorrecta

### Aplicación en EjeClick

```tsx
// ❌ Mal: duplicado en ServiceCard y TestimonialCard
<div className="rounded-xl border border-neutral-800 bg-brand-card p-4">
  {/* ... */}
</div>

// ✅ Bien: componente Card reutilizable
<Card variant="elevated">...</Card>
```

---

## 6. Manejo de Errores y Excepciones

### Reglas generales

- Usar excepciones, no códigos de retorno
- No tragar excepciones silenciosamente (`except: pass`)
- Las excepciones deben ser significativas (no genéricas)
- Propagar errores con contexto suficiente

### Frontend (TypeScript/React)

```tsx
// ✅ Bien
try {
  await api.save(data);
} catch (error) {
  if (error instanceof ApiError) {
    showToast(error.message); // Error visible al usuario
  } else {
    showToast('Error inesperado. Intenta de nuevo.');
    logError(error); // Error oculto, logueado
  }
}
```

```tsx
// ❌ Mal
try {
  await api.save(data);
} catch {
  // Silencio — el usuario nunca sabe que falló
}
```

### Backend (Python/FastAPI)

```python
# ✅ Bien
class PaymentError(Exception):
    def __init__(self, transaction_id: str, reason: str):
        self.transaction_id = transaction_id
        self.reason = reason
        super().__init__(f"Payment failed for {transaction_id}: {reason}")

@router.post("/pay")
def pay(data: PaymentData, db: Session = Depends(get_db)):
    try:
        result = process_payment(data)
        return {"status": "ok", "transaction_id": result.id}
    except PaymentError as e:
        logger.error("payment_failed tx=%s reason=%s", e.transaction_id, e.reason)
        raise HTTPException(status_code=402, detail=e.reason)
    except Exception as e:
        logger.exception("unexpected_error")
        raise HTTPException(status_code=500, detail="Error interno")
```

### Capas de manejo

| Capa | Qué hacer |
|---|---|
| **UI / Componente** | Capturar error, mostrar mensaje al usuario |
| **Hook / Servicio** | Propagar error con contexto |
| **API / Router** | Capturar, loguear, responder HTTP adecuado |
| **Dominio** | Lanzar excepción de dominio (nunca HTTPException) |

---

## 7. Pruebas Automatizadas (Tests Limpios)

### FIRST Principles for Clean Tests

| Letra | Principio | Significado |
|---|---|---|
| **F** | Fast | Los tests deben ser rápidos (ms, no segundos) |
| **I** | Independent | Un test no depende de otro |
| **R** | Repeatable | Mismo resultado siempre, en cualquier entorno |
| **S** | Self-validating | Pass/Fail automático, sin revisión manual |
| **T** | Timely | Escritos justo antes del código (TDD ideal) |

### Estructura de un test limpio

```python
# Arrange (Preparar)
user_data = {"name": "Juan", "email": "juan@test.com"}

# Act (Ejecutar)
result = create_user(user_data)

# Assert (Verificar)
assert result.name == "Juan"
assert result.email == "juan@test.com"
```

```tsx
// Arrange
render(<Button variant="primary">Click</Button>);

// Act
await userEvent.click(screen.getByText('Click'));

// Assert
expect(handleClick).toHaveBeenCalledTimes(1);
```

### Qué NO hacer en tests

- ❌ No probar implementación (probar comportamiento)
- ❌ No usar `console.log` en tests
- ❌ No tener tests que dependen del orden de ejecución
- ❌ No mockear lo que no necesitas
- ❌ No tener tests lentos (si son lentos, no se ejecutan)

---

## Workflow

### Paso 1: Identificar si aplica Clean Code

Este skill APLICA SIEMPRE, en combinación con el skill táctico de la capa que estés modificando. Cuando cargues react-expert para tocar un componente, también debes tener presente clean-code-expert.

Carga este skill EN PARALELO con el skill táctico cuando:
- Estés creando una función o componente nuevo
- Estés refactorizando código existente
- Estés revisando un PR o haciendo code review
- Detectes code smells en el código que tocas

### Paso 2: Antes de escribir código

1. ¿Este código respeta Clean Architecture? (las capas apuntan hacia adentro)
2. ¿Esta función hace UNA sola cosa? (SRP)
3. ¿Estoy duplicando código que ya existe? (DRY)
4. ¿Los nombres son claros y descriptivos?
5. ¿El manejo de errores es explícito?

### Paso 3: Después de escribir código

1. ¿Los tests cubren esta funcionalidad?
2. ¿Dejé el código más limpio de como lo encontré? (Boy Scout)
3. ¿Hay imports no usados?
4. ¿Hay tipos `any` o mal tipados?
5. ¿Hay código comentado?

---

## Validation / Definition of Done

- [ ] Funciones < 20 líneas
- [ ] Parámetros < 3 por función
- [ ] Sin código duplicado (DRY check)
- [ ] Sin `any` types
- [ ] Sin `console.log` (producción)
- [ ] Sin código comentado
- [ ] Manejo de errores explícito (cada error tiene un plan)
- [ ] Tests siguen FIRST principles
- [ ] Nombres descriptivos (una le da el propósito sin leer la implementación)
- [ ] No hay lógica de negocio en componentes ni routers
- [ ] Dejaste el código mejor de como lo encontraste (Boy Scout)

## Related Skills

- `software-architect` — decisiones arquitectónicas de alto nivel
- `react-expert` — implementación limpia en frontend
- `fastapi-expert` — implementación limpia en backend
- `testing-expert` — tests limpios y FIRST principles
- `security-expert` — manejo seguro de errores
