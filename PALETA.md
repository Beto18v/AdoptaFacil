# 🎨 Paleta de Colores AdoptaFácil

Este documento define la paleta de colores oficial de AdoptaFácil para mantener consistencia visual en toda la plataforma.

## 📋 Índice

- [Colores Principales](#colores-principales)
- [Gradientes](#gradientes)
- [Colores de Fondo](#colores-de-fondo)
- [Colores de Texto](#colores-de-texto)
- [Colores de Tarjetas](#colores-de-tarjetas)
- [Efectos y Decoraciones](#efectos-y-decoraciones)
- [Estados Interactivos](#estados-interactivos)
- [Botones](#botones)
- [Sombras](#sombras)
- [Modo Oscuro](#modo-oscuro)
- [Animaciones](#animaciones)

---

## 🖼️ Logos

### Uso de Logos por Modo

```tsx
/* Modo claro */
src = { Logo }; /* Logo.png - Logo principal */
className = "dark:hidden"; /* Ocultar en modo oscuro */

/* Modo oscuro */
src = { LogoWhite }; /* LogoWhite.png - Logo blanco */
className = "hidden dark:block"; /* Mostrar solo en modo oscuro */
```

### Estructura de Logos

```tsx
{/* Logo responsive por modo */}
<img
    src={Logo}
    alt="Logo AdoptaFácil"
    className="mx-auto h-36 w-56 drop-shadow-2xl transition-transform duration-300 hover:scale-105 dark:hidden"
/>
<img
    src={LogoWhite}
    alt="Logo AdoptaFácil"
    className="mx-auto h-36 w-56 drop-shadow-2xl transition-transform duration-300 hover:scale-105 hidden dark:block"
/>
```

### Archivos de Logo Disponibles

- `Logo.png` - Logo principal (modo claro)
- `LogoWhite.png` - Logo blanco (modo oscuro)
- `LogoGray.png` - Logo gris (usos especiales)
- `LogoGreen.png` - Logo verde (usos especiales)

---

## 🌈 Colores Principales

### Verde Primario

```css
/* Verde claro */
from-green-400  /* #4ade80 */
to-green-600    /* #16a34a */

/* Verde oscuro (dark mode) */
from-green-600  /* #16a34a */
to-green-700    /* #15803d */
```

### Azul Primario

```css
/* Azul claro */
from-blue-500   /* #3b82f6 */
to-blue-700     /* #1d4ed8 */
via-blue-500    /* #3b82f6 */

/* Azul oscuro (dark mode) */
from-blue-600   /* #2563eb */
to-blue-700     /* #1d4ed8 */
via-blue-700    /* #1d4ed8 */
```

### Púrpura Secundario

```css
/* Púrpura claro */
to-purple-600   /* #9333ea */

/* Púrpura oscuro (dark mode) */
to-purple-800   /* #6b21a8 */
```

---

## 🌅 Gradientes

### Gradiente Principal (Fondo de Página)

```css
/* Modo claro */
bg-gradient-to-br from-green-400 via-blue-500 to-purple-600

/* Modo oscuro */
dark:from-green-600 dark:via-blue-700 dark:to-purple-800
```

### Gradientes para Títulos

```css
/* Texto con gradiente */
bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent

/* Líneas decorativas */
bg-gradient-to-r from-transparent via-white/60 to-transparent
```

### Gradientes para Botones y Elementos

```css
/* Botón Amigo AdoptaFácil */
bg-gradient-to-r from-blue-500 to-blue-700

/* Botón Aliado AdoptaFácil */
bg-gradient-to-r from-green-500 to-green-700

/* Decoraciones circulares */
bg-gradient-to-br from-white/10 to-transparent
bg-gradient-to-tr from-white/5 to-transparent
```

---

## 🎭 Colores de Fondo

### Fondos Principales

```css
/* Fondo de página */
bg-gradient-to-br from-green-400 via-blue-500 to-purple-600
dark:from-green-600 dark:via-blue-700 dark:to-purple-800

/* Elementos decorativos de fondo */
bg-white/5          /* Círculos grandes */
bg-blue-300/10      /* Círculos medianos */
bg-purple-300/10    /* Círculos pequeños */
```

### Fondos de Tarjetas

```css
/* Tarjetas principales */
bg-white            /* Modo claro */
dark:bg-gray-800    /* Modo oscuro */

/* Tarjetas secundarias o contenedores */
bg-gray-100         /* Modo claro */
dark:bg-gray-900    /* Modo oscuro */
```

---

## 📝 Colores de Texto

### Texto Principal

```css
/* Títulos principales */
text-white                      /* Sobre fondos oscuros/gradientes */
bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent

/* Texto de contenido */
text-gray-800       /* Modo claro */
dark:text-white     /* Modo oscuro */

/* Texto secundario */
text-gray-600       /* Modo claro */
dark:text-gray-300  /* Modo oscuro */

/* Texto sobre fondos con transparencia */
text-white/90       /* Subtítulos y descripciones */
```

### Jerarquía de Texto

```css
/* H1 - Títulos principales */
text-4xl font-bold md:text-5xl lg:text-6xl
bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent

/* H2 - Subtítulos */
text-2xl font-bold tracking-tight

/* H3 - Títulos de sección */
text-xl font-semibold

/* Párrafos principales */
text-xl leading-relaxed font-medium

/* Párrafos secundarios */
text-base leading-relaxed
```

---

## 🃏 Colores de Tarjetas

### Tarjetas de Registro

```css
/* Contenedor principal */
bg-white shadow-2xl rounded-3xl
dark:bg-gray-800 dark:text-white

/* Estados hover */
hover:shadow-3xl
ring-4 ring-white/50    /* Cuando está activa */

/* Elementos decorativos internos */
bg-gradient-to-br from-white/10 to-transparent  /* Esquina superior */
bg-gradient-to-tr from-white/5 to-transparent   /* Esquina inferior */
```

### Íconos en Tarjetas

```css
/* Contenedor de ícono Amigo AdoptaFácil */
bg-gradient-to-r from-blue-500 to-blue-700
text-4xl text-white shadow-xl rounded-2xl

/* Contenedor de ícono Aliado AdoptaFácil */
bg-gradient-to-r from-green-500 to-green-700
text-4xl text-white shadow-xl rounded-2xl
```

---

## ✨ Efectos y Decoraciones

### Elementos Decorativos Flotantes

```css
/* Puntos animados */
bg-white/20 animate-pulse        /* Puntos grandes */
bg-white/30 animate-ping         /* Puntos medianos */
bg-white/10 animate-pulse        /* Puntos grandes suaves */
bg-white/25 animate-ping         /* Puntos pequeños */
```

### Efectos de Profundidad

```css
/* Sombras de elementos */
drop-shadow-2xl     /* Logo */
drop-shadow-lg      /* Títulos principales */

/* Desenfoque de fondo */
blur-3xl            /* Círculos grandes */
blur-2xl            /* Círculos medianos */
blur-xl             /* Círculos pequeños */
```

---

## 🔘 Estados Interactivos

### Hover States

```css
/* Escalado */
hover:scale-105         /* Botones */
hover:scale-110         /* Íconos */
group-hover:scale-110   /* Elementos dentro de grupos */
scale-[1.02]           /* Tarjetas activas */

/* Rotación */
group-hover:rotate-3    /* Íconos en hover del grupo */

/* Opacidad y overlays */
hover:opacity-100       /* Efectos de brillo */
bg-white/20 opacity-0 hover:opacity-100  /* Overlay de botones */
```

### Focus States

```css
/* Anillos de enfoque */
focus:outline-none focus:ring-4 focus:ring-blue-300/50

/* Estados activos */
ring-4 ring-white/50    /* Tarjeta seleccionada */
```

---

## 🎯 Botones

### Botón Primario (Amigo AdoptaFácil)

```css
bg-gradient-to-r from-blue-500 to-blue-700
text-white font-semibold
rounded-xl px-8 py-4
shadow-lg hover:shadow-xl hover:scale-105
focus:outline-none focus:ring-4 focus:ring-blue-300/50
transition-all duration-300
```

### Botón Secundario (Aliado AdoptaFácil)

```css
bg-gradient-to-r from-green-500 to-green-700
text-white font-semibold
rounded-xl px-8 py-4
shadow-lg hover:shadow-xl hover:scale-105
focus:outline-none focus:ring-4 focus:ring-green-300/50
transition-all duration-300
```

### Efectos de Botón

```css
/* Overlay en hover */
.button-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  opacity: 0;
  transition: opacity 0.3s;
}
.button:hover .button-overlay {
  opacity: 1;
}
```

---

## 🌑 Sombras

### Jerarquía de Sombras

```css
/* Sombras de elementos */
shadow-lg           /* Sombra ligera */
shadow-xl           /* Sombra media */
shadow-2xl          /* Sombra fuerte - tarjetas */
shadow-3xl          /* Sombra máxima - hover */

/* Sombras de imagen */
drop-shadow-2xl     /* Logo principal */
drop-shadow-lg      /* Títulos importantes */
```

---

## 🌙 Modo Oscuro

### Conversiones Automáticas

```css
/* Fondos */
bg-white → dark:bg-gray-800
bg-gray-100 → dark:bg-gray-900

/* Texto */
text-gray-800 → dark:text-white
text-gray-600 → dark:text-gray-300

/* Gradientes principales */
from-green-400 via-blue-500 to-purple-600 →
dark:from-green-600 dark:via-blue-700 dark:to-purple-800
```

---

## 🎬 Animaciones

### Transiciones Principales

```css
/* Duración estándar */
transition-transform duration-300    /* Escalado rápido */
transition-all duration-300         /* Estados generales */
transition-all duration-500         /* Tarjetas principales */
transition-opacity duration-500     /* Efectos de brillo */
transition-transform duration-1000  /* Animaciones lentas */
```

### Animaciones CSS

```css
/* Animaciones incorporadas */
animate-pulse       /* Pulsación suave */
animate-ping        /* Pulsación expansiva */

/* Efectos personalizados */
-skew-x-12          /* Inclinación para efectos de brillo */
translate-x-[-100%] /* Posición inicial de brillo */
group-hover:translate-x-[200%] /* Movimiento de brillo */
```

---

## � Sistema de Espaciado

### Espaciado Vertical (Padding y Margin)

```css
/* Espaciado de secciones principales */
pt-12 pb-4               /* Header compacto */
pt-16 pb-8               /* Header estándar */
pt-20 pb-12              /* Header amplio */

/* Espaciado entre elementos */
mb-2                     /* Espaciado mínimo (8px) */
mb-4                     /* Espaciado pequeño (16px) */
mb-6                     /* Espaciado medio (24px) */
mb-8                     /* Espaciado grande (32px) */
mb-12                    /* Espaciado extra grande (48px) */

/* Márgenes superiores progresivos */
mt-2                     /* Muy cerca (8px) */
mt-4                     /* Cerca (16px) */
mt-6                     /* Estándar (24px) */
mt-8                     /* Separado (32px) */
mt-12                    /* Muy separado (48px) */

/* Padding interno de elementos */
p-4                      /* Padding pequeño - inputs, botones pequeños */
p-6                      /* Padding medio - tarjetas secundarias */
p-8                      /* Padding estándar - tarjetas principales */
p-12                     /* Padding grande - contenedores principales */
```

### Espaciado Horizontal

```css
/* Padding horizontal responsive */
px-4                     /* Móvil estándar (16px) */
px-6 md:px-8            /* Tablet a desktop (24px → 32px) */
px-8 lg:px-12           /* Desktop grande (32px → 48px) */

/* Márgenes laterales */
mx-auto                  /* Centrado automático */
ml-auto                  /* Alineación derecha */
mr-auto                  /* Alineación izquierda */

/* Espaciado entre elementos horizontales */
space-x-2               /* Muy cerca (8px) - iconos pequeños */
space-x-3               /* Cerca (12px) - checkbox + label */
space-x-4               /* Estándar (16px) - botones relacionados */
space-x-6               /* Separado (24px) - elementos independientes */
```

### Grid y Flex Spacing

```css
/* Grid gaps responsive */
gap-4                   /* Gap pequeño (16px) */
gap-6                   /* Gap medio (24px) */
gap-8                   /* Gap estándar (32px) */
gap-8 lg:gap-10        /* Gap responsive estándar */
gap-8 lg:gap-12        /* Gap responsive amplio */

/* Flex spacing */
flex gap-2             /* Elementos muy unidos */
flex gap-4             /* Elementos cercanos */
flex gap-6             /* Elementos separados */
```

---

## 🛠️ Clases Utilitarias Personalizadas

### Contenedores y Layout

```css
/* Contenedores centrados con espaciado */
min-h-screen px-4                    /* Altura completa con padding móvil */
min-h-[45vh] px-4                   /* Sección compacta */
min-h-[60vh] px-4                   /* Sección estándar */
max-w-5xl mx-auto                   /* Ancho compacto centrado */
max-w-6xl mx-auto                   /* Ancho máximo centrado */
max-w-2xl mx-auto px-4              /* Ancho de texto centrado */

/* Grid responsive con espaciado óptimo */
grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10    /* Layout compacto */
grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12    /* Layout estándar */
```

### Espaciado de Componentes Específicos

```css
/* Formularios */
.form-group {
  margin-bottom: 24px;
} /* mb-6 - Entre campos */
.form-field {
  margin-bottom: 8px;
} /* mb-2 - Label a input */
.form-error {
  margin-top: 4px;
} /* mt-1 - Error debajo de input */
.form-button {
  margin-top: 24px;
} /* mt-6 - Botón de envío */

/* Tarjetas */
.card-padding {
  padding: 32px;
} /* p-8 - Padding interno estándar */
.card-spacing {
  margin-bottom: 32px;
} /* mb-8 - Entre tarjetas */
.card-content {
  margin-bottom: 32px;
} /* mb-8 - Último elemento antes de botón */

/* Headers */
.header-logo {
  margin-bottom: 24px;
} /* mb-6 - Logo a título */
.header-title {
  margin-top: 8px;
  margin-bottom: 16px;
} /* mt-2 mb-4 */
.header-subtitle {
  margin-top: 16px;
} /* mt-4 - Descripción */
.header-divider {
  margin-top: 24px;
} /* mt-6 - Línea decorativa */

/* Botones */
.button-group {
  gap: 16px;
} /* gap-4 - Entre botones relacionados */
.button-icon {
  gap: 8px;
} /* gap-2 - Icono y texto */
```

### Posicionamiento

```css
/* Elementos absolutos decorativos */
absolute inset-0              /* Cobertura completa */
absolute top-1/4 left-1/4     /* Posicionamiento fraccionario */
relative z-10                 /* Capa de contenido */
pointer-events-none           /* Sin interacción */
overflow-hidden               /* Ocultar desbordamiento */
```

---

## 📱 Responsive Design

### Espaciado Responsive por Dispositivo

```css
/* Móvil (hasta 768px) */
px-4 py-6               /* Padding conservador */
gap-4                   /* Gaps menores */
mb-4                    /* Márgenes compactos */
text-base               /* Texto base */

/* Tablet (768px - 1024px) */
px-6 py-8               /* Padding intermedio */
gap-6                   /* Gaps intermedios */
mb-6                    /* Márgenes medios */
text-lg                 /* Texto más grande */

/* Desktop (1024px+) */
px-8 py-12              /* Padding amplio */
gap-8                   /* Gaps amplios */
mb-8                    /* Márgenes amplios */
text-xl                 /* Texto grande */
```

### Breakpoints de Texto y Espaciado

```css
/* Títulos con espaciado responsive */
text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6    /* Título principal */
text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4    /* Subtítulo */
text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3     /* Título de sección */

/* Contenedores responsive */
pt-12 pb-4 md:pt-16 md:pb-8 lg:pt-20 lg:pb-12   /* Header escalable */
px-4 md:px-8 lg:px-12                            /* Padding horizontal */
max-w-md md:max-w-2xl lg:max-w-4xl               /* Ancho máximo */

/* Grid y espaciado responsive */
gap-4 md:gap-6 lg:gap-8                          /* Gap escalable */
space-y-4 md:space-y-6 lg:space-y-8              /* Espaciado vertical */
```

### Grid Responsive

```css
/* Layout de tarjetas */
grid-cols-1 md:grid-cols-2     /* 1 col móvil, 2 desktop */
gap-8 lg:gap-12               /* Espaciado adaptativo */
max-w-6xl                     /* Ancho máximo */
```

---

## 🎨 Paleta Hexadecimal de Referencia

```css
/* Verdes */
--green-400: #4ade80;
--green-500: #22c55e;
--green-600: #16a34a;
--green-700: #15803d;

/* Azules */
--blue-100: #dbeafe;
--blue-300: #93c5fd;
--blue-500: #3b82f6;
--blue-600: #2563eb;
--blue-700: #1d4ed8;

/* Púrpuras */
--purple-300: #c084fc;
--purple-600: #9333ea;
--purple-800: #6b21a8;

/* Grises */
--gray-100: #f3f4f6;
--gray-300: #d1d5db;
--gray-600: #4b5563;
--gray-800: #1f2937;
--gray-900: #111827;

/* Blanco con transparencias */
--white-5: rgba(255, 255, 255, 0.05);
--white-10: rgba(255, 255, 255, 0.1);
--white-20: rgba(255, 255, 255, 0.2);
--white-25: rgba(255, 255, 255, 0.25);
--white-30: rgba(255, 255, 255, 0.3);
--white-50: rgba(255, 255, 255, 0.5);
--white-60: rgba(255, 255, 255, 0.6);
--white-90: rgba(255, 255, 255, 0.9);
```

---

## 📋 Checklist de Implementación

Al aplicar esta paleta en otras páginas, verificar:

- [ ] **Logos**: Logo correcto por modo (Logo.png claro, LogoWhite.png oscuro)
- [ ] **Espaciado**: Usar sistema de espaciado consistente (4px, 8px, 16px, 24px, 32px, 48px)
- [ ] **Responsive**: Espaciado escalable por dispositivo (móvil → tablet → desktop)
- [ ] **Componentes**: Espaciado específico para formularios, tarjetas, headers
- [ ] Gradiente principal de fondo implementado
- [ ] Modo oscuro configurado correctamente
- [ ] Botones usando los gradientes apropiados
- [ ] Tarjetas con sombras y efectos consistentes
- [ ] Texto con jerarquía y colores apropiados
- [ ] Elementos decorativos con transparencias correctas
- [ ] Animaciones y transiciones aplicadas
- [ ] Estados hover y focus implementados
- [ ] Grid gaps y flex spacing apropiados

---

## 🎯 Assets y Recursos

### Importación de Logos

```tsx
// Importaciones necesarias
import Logo from "../../../../public/Logo/Logo.png";
import LogoWhite from "../../../../public/Logo/LogoWhite.png";

// Uso en componente
const LogoComponent = () => (
  <div className="logo-container">
    {/* Logo modo claro */}
    <img
      src={Logo}
      alt="Logo AdoptaFácil"
      className="h-36 w-56 drop-shadow-2xl dark:hidden"
    />
    {/* Logo modo oscuro */}
    <img
      src={LogoWhite}
      alt="Logo AdoptaFácil"
      className="h-36 w-56 drop-shadow-2xl hidden dark:block"
    />
  </div>
);
```

### Efectos de Logo

```css
/* Efectos estándar para logos */
.logo-effects {
  drop-shadow: drop-shadow-2xl;
  transition: transform 0.3s ease;
}

.logo-effects:hover {
  transform: scale(1.05);
}

/* Tamaños responsive */
.logo-sm {
  height: 24px;
  width: auto;
} /* h-6 */
.logo-md {
  height: 36px;
  width: auto;
} /* h-9 */
.logo-lg {
  height: 144px;
  width: 224px;
} /* h-36 w-56 */
.logo-xl {
  height: 192px;
  width: 288px;
} /* h-48 w-72 */
```

### Ejemplos Prácticos de Espaciado

```tsx
/* Formulario Login con espaciado óptimo */
<div className="p-8 space-y-6">                    {/* Contenedor principal */}
  <div className="mb-6">                           {/* Logo section */}
    <img className="mb-6 h-28 w-44" />            {/* Logo con margen */}
  </div>

  <form className="space-y-6">                     {/* Formulario */}
    <div className="space-y-2">                    {/* Campo individual */}
      <label className="mb-2" />                   {/* Label */}
      <input className="px-4 py-3" />             {/* Input con padding */}
    </div>

    <button className="mt-6 px-8 py-4" />         {/* Botón con espaciado */}
  </form>
</div>

/* Tarjetas de registro con espaciado responsive */
<div className="grid gap-8 lg:gap-10 max-w-5xl">  {/* Grid con gaps */}
  <div className="p-8 space-y-6">                 {/* Tarjeta individual */}
    <div className="mb-6" />                      {/* Icono section */}
    <h3 className="mb-4" />                       {/* Título */}
    <p className="mb-8" />                        {/* Descripción */}
    <button className="px-8 py-4" />              {/* Botón de acción */}
  </div>
</div>

/* Header responsive con espaciado escalable */
<div className="pt-12 pb-4 md:pt-16 md:pb-6 lg:pt-20 lg:pb-8">
  <div className="mb-6 md:mb-8">                  {/* Logo section */}
    <img className="mb-6" />
  </div>
  <h1 className="mt-2 mb-4" />                    {/* Título principal */}
  <p className="mt-4" />                          {/* Descripción */}
  <div className="mt-6" />                        {/* Línea decorativa */}
</div>
```

---

## � Tabla de Referencia de Espaciado

| Uso              | Clase Tailwind         | Píxeles | Cuándo Usar              |
| ---------------- | ---------------------- | ------- | ------------------------ |
| **Muy Pequeño**  | `space-1, p-1, m-1`    | 4px     | Ajustes mínimos, iconos  |
| **Pequeño**      | `space-2, p-2, m-2`    | 8px     | Labels, elementos unidos |
| **Estándar**     | `space-4, p-4, m-4`    | 16px    | Campos de formulario     |
| **Medio**        | `space-6, p-6, m-6`    | 24px    | Secciones relacionadas   |
| **Grande**       | `space-8, p-8, m-8`    | 32px    | Separación principal     |
| **Extra Grande** | `space-12, p-12, m-12` | 48px    | Secciones independientes |

### Espaciado por Tipo de Componente

| Componente      | Padding Interno | Margen Entre Elementos    | Gap en Grid       |
| --------------- | --------------- | ------------------------- | ----------------- |
| **Botones**     | `px-8 py-4`     | `space-x-4`               | -                 |
| **Inputs**      | `px-4 py-3`     | `space-y-2` (label-input) | -                 |
| **Tarjetas**    | `p-8`           | `space-y-6` (interno)     | `gap-8 lg:gap-10` |
| **Formularios** | `p-8`           | `space-y-6` (campos)      | -                 |
| **Headers**     | `pt-12 pb-4`    | `space-y-4` (elementos)   | -                 |
| **Grid Layout** | -               | -                         | `gap-8 lg:gap-12` |

---

## �💡 Notas de Uso

1. **Espaciado**: Usar múltiplos de 4px (4, 8, 16, 24, 32, 48px) para consistencia
2. **Logos**: Siempre usar Logo.png para modo claro y LogoWhite.png para modo oscuro
3. **Consistencia**: Usar siempre los mismos gradientes y colores definidos
4. **Responsive**: Escalar espaciado progresivamente: móvil < tablet < desktop
5. **Accesibilidad**: Mantener contraste suficiente y espaciado táctil (44px mínimo)
6. **Performance**: Usar `transform` y `opacity` para animaciones suaves
7. **Jerarquía**: Respetar la escala de sombras, tamaños de texto y espaciado
8. **Componentes**: Seguir patrones de espaciado específicos por tipo de elemento
9. **Assets**: Precargar logos importantes para mejor rendimiento

---

**Versión**: 1.0  
**Última actualización**: Noviembre 2025  
**Basado en**: Página de Registro de Opciones AdoptaFácil
