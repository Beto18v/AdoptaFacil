# Integración React para Generador de Descripciones de Mascotas

Este directorio contiene los componentes React necesarios para integrar el microservicio de descripciones de mascotas con aplicaciones React/Laravel.

## 📁 Archivos incluidos

- **`useDescripcionIA.ts`** - Hook personalizado para manejar la comunicación con la API
- **`GeneradorDescripcion.tsx`** - Componente React para la interfaz de usuario
- **`package.json`** - Dependencias necesarias
- **`types.ts`** - Definiciones de tipos TypeScript

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install react react-dom @types/react @types/react-dom
```

### 2. Configurar TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "react-integration"]
}
```

### 3. Configurar Laravel (si usas Laravel + React)

En tu archivo `resources/js/app.jsx`:

```jsx
import { GeneradorDescripcion } from "./components/GeneradorDescripcion";

// Registrar el componente globalmente
window.GeneradorDescripcion = GeneradorDescripcion;
```

## 🔧 Uso del componente

### Ejemplo básico

```jsx
import React, { useState } from "react";
import { GeneradorDescripcion } from "./GeneradorDescripcion";

const FormularioMascota = () => {
  const [mascota, setMascota] = useState({
    nombre: "",
    especie: "",
    raza: "",
    sexo: "",
    ciudad: "",
    descripcion: "",
  });

  const handleDescripcionGenerada = (nuevaDescripcion) => {
    setMascota((prev) => ({
      ...prev,
      descripcion: nuevaDescripcion,
    }));
  };

  return (
    <form>
      {/* Campos del formulario */}
      <input
        value={mascota.nombre}
        onChange={(e) =>
          setMascota((prev) => ({ ...prev, nombre: e.target.value }))
        }
        placeholder="Nombre de la mascota"
      />

      <textarea
        value={mascota.descripcion}
        onChange={(e) =>
          setMascota((prev) => ({ ...prev, descripcion: e.target.value }))
        }
        placeholder="Descripción de la mascota"
      />

      {/* Generador de descripción con IA */}
      <GeneradorDescripcion
        nombre={mascota.nombre}
        especie={mascota.especie}
        raza={mascota.raza}
        sexo={mascota.sexo}
        ciudad={mascota.ciudad}
        descripcionActual={mascota.descripcion}
        onDescripcionGenerada={handleDescripcionGenerada}
        className="mt-4"
        mostrarPreview={true}
      />
    </form>
  );
};
```

### Con Inertia.js (Laravel)

```jsx
import React from "react";
import { useForm } from "@inertiajs/react";
import { GeneradorDescripcion } from "../components/GeneradorDescripcion";

const CrearMascota = () => {
  const { data, setData, post, processing, errors } = useForm({
    nombre: "",
    especie: "",
    raza: "",
    sexo: "",
    ciudad: "",
    descripcion: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/mascotas");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={data.nombre}
        onChange={(e) => setData("nombre", e.target.value)}
        placeholder="Nombre"
      />

      <textarea
        value={data.descripcion}
        onChange={(e) => setData("descripcion", e.target.value)}
        placeholder="Descripción"
      />

      <GeneradorDescripcion
        nombre={data.nombre}
        especie={data.especie}
        raza={data.raza}
        sexo={data.sexo}
        ciudad={data.ciudad}
        descripcionActual={data.descripcion}
        onDescripcionGenerada={(desc) => setData("descripcion", desc)}
      />

      <button type="submit" disabled={processing}>
        Guardar Mascota
      </button>
    </form>
  );
};
```

## 🎨 Personalización de estilos

El componente usa clases de Tailwind CSS por defecto, pero puedes personalizar los estilos:

```jsx
<GeneradorDescripcion
  className="mi-clase-personalizada"
  // ... otras props
/>
```

### CSS personalizado

```css
.generador-descripcion {
  /* Estilos base */
}

.generador-descripcion button {
  /* Estilos de botones */
}

.generador-descripcion .descripcion-preview {
  /* Estilos del preview */
}
```

## 🔗 Configuración del backend

Asegúrate de que las rutas estén configuradas en Laravel:

```php
// routes/api.php
Route::prefix('descripciones')->group(function () {
    Route::post('/generar', [DescripcionMascotaController::class, 'generarDescripcion']);
    Route::get('/verificar-servicio', [DescripcionMascotaController::class, 'verificarServicio']);
});
```

Y que el microservicio FastAPI esté corriendo en `http://localhost:8001`.

## 🐛 Solución de problemas

### El servicio no está disponible

1. Verificar que el microservicio FastAPI esté corriendo
2. Verificar las variables de entorno (API keys)
3. Verificar la configuración de CORS

### Errores de TypeScript

1. Instalar tipos: `npm install @types/react @types/react-dom`
2. Configurar tsconfig.json correctamente

### Errores de CSRF

1. Asegurarse de incluir `@csrf` en el template Blade
2. Verificar que el meta tag esté presente:

```html
<meta name="csrf-token" content="{{ csrf_token() }}" />
```

## 📝 Ejemplo completo

Ver el archivo `example-usage.jsx` para un ejemplo completo de implementación.
