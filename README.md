# Mobile-Friendly React Web App with Vite

A fast, responsive React application built with Vite and TypeScript. Optimized for mobile-first development with modern tooling and best practices.

## Features

- ⚡ **Vite** - Lightning-fast bundler and dev server
- ⚛️ **React 18** - Latest React with hooks and concurrent features
- 📘 **TypeScript** - Full type safety and IntelliSense
- 📱 **Mobile-First** - Responsive design that works on all devices
- 🎨 **CSS Variables** - Flexible theming and styling
- 🌙 **Dark Mode Support** - Automatic light/dark theme detection
- 🚀 **Performance** - Optimized for production deployment

## Getting Started

### Prerequisites
- Node.js 16+ (preferably 18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── main.tsx          # Entry point
├── App.tsx           # Main App component
├── App.css           # App-specific styles
└── index.css         # Global styles with mobile-first CSS
```

## Mobile-Friendly Features

- Viewport meta tag for mobile devices
- Touch-friendly button sizes (minimum 44px)
- Responsive typography that scales with screen size
- Flexible grid/flexbox layouts
- Dark mode support
- Fast load times with Vite

## Customization

### Color Scheme
Edit the CSS variables in `src/index.css`:

```css
:root {
  --color-primary: #4CAF50;
  --color-secondary: #2196F3;
  /* ... more variables */
}
```

### Add New Components
Create new components in the `src/` directory:

```tsx
// src/components/Header.tsx
export function Header() {
  return <header>Your content</header>
}
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Code Splitting** - Vite automatically splits code for optimal loading
2. **Lazy Loading** - Use React.lazy() for route-based components
3. **Image Optimization** - Use next-gen formats (WebP)
4. **CSS Modules** - Consider CSS-in-JS or module scoping for scalability

## Next Steps

1. Replace the placeholder content with your own features
2. Add more components to `src/components/`
3. Consider adding a router for navigation
4. Deploy to Vercel, Netlify, or your preferred platform

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Mobile Web Best Practices](https://web.dev/mobile/)

## License

MIT
