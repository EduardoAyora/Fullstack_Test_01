# Decisiones Técnicas
## Eduardo Ayora

---

## 📋 Información General

- **Nombre del Candidato**: Eduardo Antonio Ayora Ochoa
- **Fecha de Inicio**: 13/12/2025
- **Fecha de Entrega**: 14/12/2025
- **Tiempo Dedicado**: 18 horas

---

## 🛠️ Stack Tecnológico Elegido

### Backend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| Node.js | 21.x | Esta versión es compatible con vite.js |
| Base de Datos | MongoDB | Porque era más natural almacenar ciertos datos dentro de los documentos en lugar de utilizar llaves foráneas, como por ejemplo almacenar los colaboradores dentro de los proyectos |

### Frontend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| Build Tool | Vite | Por su arranque de desarrollo y recarga en caliente rápida |
| Estado Global | Context | El estado global de la aplicación es relativamente simple y no requiere una solución avanzada de gestión de estado |
| Estilos | Tailwind | Permite desarrollar interfaces de forma rápida sin necesidad de escribir CSS personalizado |

---

## 🏗️ Arquitectura

### Estructura del Backend

```
backend/
├── src/
│   ├── [tu estructura]
│   └── ...
```

**Razón de esta estructura:**
[Explica por qué organizaste tu código de esta manera]

### Estructura del Frontend

```
frontend/
├── src/
│   ├── [tu estructura]
│   └── ...
```

**Razón de esta estructura:**
[Explica por qué organizaste tu código de esta manera]

---

## 🗄️ Diseño de Base de Datos

### Elección: MySQL / MongoDB

**Razones:**
- [Razón 1]
- [Razón 2]
- [Razón 3]

### Schema/Modelos

[Describe brevemente tus tablas/colecciones principales]

**Decisiones importantes:**
- **Normalización** (si usas MySQL): [Explica cómo normalizaste]
- **Índices**: [Qué índices agregaste y por qué]
- **Relaciones**: [Cómo manejaste las relaciones entre entidades]

---

## 🔐 Seguridad

### Implementaciones de Seguridad

- [ ] **Hash de contraseñas**: [bcrypt, argon2, etc. - ¿Por qué elegiste este?]
- [ ] **JWT**: [¿Cómo configuraste la expiración? ¿Por qué?]
- [ ] **Validación de inputs**: [¿Qué estrategia usaste?]
- [ ] **CORS**: [¿Cómo lo configuraste?]
- [ ] **Headers de seguridad**: [¿Usaste helmet? ¿Otras medidas?]
- [ ] **Rate limiting**: [Si lo implementaste, ¿cómo?]

### Consideraciones Adicionales

[¿Qué otras medidas de seguridad tomaste? ¿Qué vulnerabilidades consideraste?]

---

## 🎨 Decisiones de UI/UX

### Framework/Librería de UI

**Elegí**: [Ninguna / Material-UI / Ant Design / TailwindCSS / etc.]

**Razón**: [¿Por qué elegiste esto sobre otras opciones?]

### Patrones de Diseño

- **Responsive Design**: [¿Cómo lo abordaste? Mobile-first?]
- **Loading States**: [¿Cómo manejaste los estados de carga?]
- **Error Handling**: [¿Cómo muestras errores al usuario?]
- **Feedback Visual**: [Toasts, modales, etc.]

### Decisiones de UX

[Explica algunas decisiones importantes de experiencia de usuario que tomaste]

---

## 🧪 Testing

### Estrategia de Testing

**Backend:**
- [Tipo de tests que escribiste]
- [¿Por qué elegiste probar estos endpoints/funciones específicamente?]
- [Herramientas usadas]

**Frontend:**
- [Tipo de tests que escribiste]
- [¿Qué componentes decidiste probar y por qué?]
- [Herramientas usadas]

### Cobertura

- **Backend**: [X%]
- **Frontend**: [X%]

[¿Por qué decidiste este nivel de cobertura dado el tiempo disponible?]

---

## 🐳 Docker

### Implementación

- [ ] Dockerfile backend
- [ ] Dockerfile frontend
- [ ] docker-compose.yml

**Decisiones:**
- [¿Por qué elegiste Alpine/Debian como base?]
- [¿Usaste multi-stage builds? ¿Por qué?]
- [¿Cómo optimizaste el tamaño de las imágenes?]

---

## ⚡ Optimizaciones

### Backend

- [Optimización 1 y por qué la implementaste]
- [Optimización 2]
- [etc.]

### Frontend

- [Optimización 1]
- [Optimización 2]
- [etc.]

---

## 🚧 Desafíos y Soluciones

### Desafío 1: [Nombre del desafío]

**Problema:**
[Describe el problema que enfrentaste]

**Solución:**
[Cómo lo resolviste]

**Aprendizaje:**
[Qué aprendiste de esto]

### Desafío 2: [Nombre del desafío]

**Problema:**
[Descripción]

**Solución:**
[Tu solución]

**Aprendizaje:**
[Qué aprendiste]

### Desafío 3: [Nombre del desafío]

**Problema:**
[Descripción]

**Solución:**
[Tu solución]

**Aprendizaje:**
[Qué aprendiste]

---

## 🎯 Trade-offs

### Trade-off 1: [Decisión]

**Opciones consideradas:**
- Opción A: [Descripción]
- Opción B: [Descripción]

**Elegí**: [Opción X]

**Razón:**
[Por qué elegiste esta opción sobre la otra. ¿Qué sacrificaste y qué ganaste?]

### Trade-off 2: [Decisión]

**Opciones consideradas:**
- [...]

**Elegí**: [...]

**Razón:**
[...]

---

## 🔮 Mejoras Futuras

Si tuviera más tiempo, implementaría:

1. **[Mejora 1]**
   - Descripción: [...]
   - Beneficio: [...]
   - Tiempo estimado: [...]

2. **[Mejora 2]**
   - Descripción: [...]
   - Beneficio: [...]
   - Tiempo estimado: [...]

3. **[Mejora 3]**
   - Descripción: [...]
   - Beneficio: [...]
   - Tiempo estimado: [...]

---

## 📚 Recursos Consultados

Lista de recursos que consultaste durante el desarrollo:

- [Documentación oficial de X]
- [Artículo sobre Y]
- [Stack Overflow thread sobre Z]
- [etc.]

---

## 🤔 Reflexión Final

### ¿Qué salió bien?

[Reflexiona sobre qué aspectos del proyecto consideras que hiciste particularmente bien]

### ¿Qué mejorarías?

[Con más tiempo o conocimiento, ¿qué harías diferente?]

### ¿Qué aprendiste?

[¿Qué nuevas habilidades o conocimientos adquiriste durante este proyecto?]

---

## 📸 Capturas de Pantalla

[Opcional: Agrega capturas de pantalla de tu aplicación]

### Login
![Login](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Lista de Proyectos
![Projects](./screenshots/projects.png)

### Detalle de Tareas
![Tasks](./screenshots/tasks.png)

---

**Fecha de última actualización**: [DD/MM/YYYY]
