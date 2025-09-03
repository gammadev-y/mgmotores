# MGMotores - Refactored Website

This is a refactored version of the MGMotores website, converted from React to a simpler implementation using only HTML, CSS, and JavaScript.

## Project Structure

```
refactored/
├── index.html
├── styles/
│   ├── main.css
│   ├── components.css
│   └── sections.css
├── scripts/
│   └── main.js
├── package.json
└── README.md
```

## Key Changes Made

1. **Removed React dependencies**: All React components have been converted to semantic HTML
2. **Simplified state management**: Used vanilla JavaScript for interactivity instead of React hooks
3. **Separated concerns**: CSS is now in separate files rather than being embedded in JSX
4. **Maintained functionality**: All interactive elements work the same way as in the original
5. **Preserved design**: Kept the same visual design and layout

## Features

- Responsive navigation with mobile menu
- Banner system with localStorage persistence
- Smooth scrolling to sections
- Product showcase
- Services display
- Calculator for pump recommendations
- Contact form with validation
- Footer with quick links

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```
   The website will be available at http://localhost:3000

3. **Build for production**:
   ```bash
   npm run build
   ```
   The built files will be in the `dist` directory

4. **Preview the production build**:
   ```bash
   npm run preview
   ```

## Browser Support

This website uses modern JavaScript features and CSS properties. For older browsers, you may need to add polyfills or use a transpiler like Babel.

## Future Improvements

- Add server-side form handling for the contact form
- Implement the download feature for calculator results
- Add database integration for products and banners
- Improve accessibility with better ARIA attributes
- Add loading states for better UX

## License

This project is licensed under the MIT License.