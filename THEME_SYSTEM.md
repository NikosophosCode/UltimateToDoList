# Sistema de Temas - Ultimate To-Do List

## 🎨 Características Implementadas

### Temas Disponibles
- **Tema Oscuro (Dark)**: Diseño elegante con tonos morados y oscuros
- **Tema Claro (Light)**: Diseño limpio con fondo blanco y texto oscuro

### Colores de Acento
6 opciones de gradientes personalizables:
1. **Purple**: Morado a Rosa (predeterminado)
2. **Blue**: Azul a Cian
3. **Green**: Verde a Turquesa
4. **Orange**: Naranja a Rojo
5. **Rose**: Rosa a Rosa Fuerte
6. **Indigo**: Índigo a Morado

## 📁 Estructura de Archivos

```
src/
├── context/
│   └── ThemeContext.jsx          # Contexto y lógica del tema
├── pages/
│   ├── SettingsPage.jsx          # Configuración de temas
│   └── ...
├── components/
│   └── ...
└── index.css                      # Variables CSS del tema
```

## 🔧 Uso del Sistema de Temas

### En Componentes

```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, accentColor, toggleTheme, changeAccentColor } = useTheme();
  
  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={toggleTheme}>Cambiar Tema</button>
    </div>
  );
}
```

### Variables CSS Disponibles

```css
/* Colores de fondo */
--bg-primary        /* Fondo principal */
--bg-secondary      /* Fondo secundario */
--bg-tertiary       /* Fondo terciario */
--bg-card           /* Fondo de tarjetas */
--bg-hover          /* Color de hover */
--border-color      /* Color de bordes */

/* Colores de texto */
--text-primary      /* Texto principal */
--text-secondary    /* Texto secundario */
--text-tertiary     /* Texto terciario */

/* Colores de acento */
--accent-from       /* Color inicial del gradiente */
--accent-to         /* Color final del gradiente */
```

### Clases Tailwind Personalizadas

```jsx
// Usar en className
className="bg-card"          // Fondo de tarjeta
className="text-primary"     // Texto principal
className="text-secondary"   // Texto secundario
className="border-theme"     // Borde temático
className="bg-hover"         // Fondo hover
className="bg-accent"        // Gradiente de acento
className="text-accent"      // Texto con gradiente
```

## 💾 Persistencia

El sistema guarda automáticamente las preferencias en `localStorage`:
- `theme`: 'light' o 'dark'
- `accentColor`: ID del color seleccionado

Las preferencias se mantienen entre sesiones y recargas de página.

## 🎯 Configuración desde Settings

1. Ve a la página de **Settings** (icono de engranaje)
2. En la sección **Appearance**:
   - **Theme**: Selecciona entre Light y Dark
   - **Accent Color**: Elige entre 6 colores diferentes
3. Los cambios se aplican inmediatamente y se guardan automáticamente

## 🚀 Ventajas del Sistema

✅ **Modular**: Fácil de extender con nuevos temas y colores
✅ **Performante**: Usa CSS variables nativas
✅ **Persistente**: Guarda preferencias del usuario
✅ **Accesible**: Soporta ambos temas para diferentes condiciones de luz
✅ **Type-safe**: Valores centralizados y constantes exportadas
✅ **Responsive**: Se adapta a todos los componentes automáticamente

## 🔄 Agregar Nuevos Colores de Acento

Edita `ThemeContext.jsx`:

```jsx
export const accentColors = [
  // Colores existentes...
  { 
    id: 'nuevo-color', 
    name: 'Nuevo Color', 
    from: '#hexcode1', 
    to: '#hexcode2', 
    class: 'from-color-500 to-color2-500' 
  },
];
```

## 📝 Notas de Desarrollo

- Los componentes usan clases de utilidad como `text-primary` en lugar de colores hardcoded
- Los gradientes de acento se aplican mediante variables CSS
- El tema se sincroniza con el atributo `data-theme` en `<html>`
- Fast Refresh puede mostrar warnings en desarrollo (no afectan producción)
