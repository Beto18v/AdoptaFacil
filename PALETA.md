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

## 🛠️ Clases Utilitarias Personalizadas

### Espaciado y Layout

```css
/* Contenedores centrados */
min-h-screen               /* Altura completa */
min-h-[60vh]              /* Altura específica */
max-w-6xl mx-auto         /* Ancho máximo centrado */
max-w-2xl mx-auto         /* Ancho de texto centrado */

/* Grid responsive */
grid-cols-1 md:grid-cols-2    /* 1 columna móvil, 2 en desktop */
gap-8 lg:gap-12              /* Espaciado responsive */
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

### Breakpoints de Texto

```css
/* Títulos responsive */
text-4xl md:text-5xl lg:text-6xl

/* Espaciado responsive */
pt-16 pb-8              /* Padding vertical */
px-4 md:px-8           /* Padding horizontal */
mt-6 mb-8              /* Márgenes */
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

- [ ] Gradiente principal de fondo implementado
- [ ] Modo oscuro configurado correctamente
- [ ] Botones usando los gradientes apropiados
- [ ] Tarjetas con sombras y efectos consistentes
- [ ] Texto con jerarquía y colores apropiados
- [ ] Elementos decorativos con transparencias correctas
- [ ] Animaciones y transiciones aplicadas
- [ ] Estados hover y focus implementados
- [ ] Responsividad mantenida
- [ ] Espaciado consistente

---

## 💡 Notas de Uso

1. **Consistencia**: Usar siempre los mismos gradientes y colores definidos
2. **Accesibilidad**: Mantener contraste suficiente en modo claro y oscuro
3. **Performance**: Usar `transform` y `opacity` para animaciones suaves
4. **Responsividad**: Aplicar breakpoints consistentes en toda la plataforma
5. **Jerarquía**: Respetar la escala de sombras y tamaños de texto

---

**Versión**: 1.0  
**Última actualización**: Noviembre 2025  
**Basado en**: Página de Registro de Opciones AdoptaFácil
