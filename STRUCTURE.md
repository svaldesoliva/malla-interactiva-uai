# Project Structure

This document describes the restructured project organization.

## Overview

The project has been reorganized into a cleaner, more maintainable structure with clear separation between source code, static assets, and build outputs.

## Directory Structure

```
.
├── src/                          # All source code
│   ├── js/
│   │   ├── core/                 # Core classes
│   │   │   ├── Malla.js          # Main mesh/grid class
│   │   │   └── Ramo.js           # Subject/course class
│   │   ├── managers/             # Manager classes (empty, ready for future use)
│   │   ├── editors/              # Editor classes (empty, ready for future use)
│   │   └── init/                 # Initialization code
│   │       ├── main.js           # Main entry point (no domain check)
│   │       └── config.js         # Configuration settings
│   ├── css/
│   │   ├── styles.css            # Main styles
│   │   ├── darkMode.css          # Dark mode styles
│   │   └── prettify.css          # Code prettifier styles
│   └── views/
│       ├── header.html           # Header component
│       └── footer.html           # Footer component
│
├── public/                       # Static assets (served directly)
│   ├── index.html                # Main entry point
│   ├── assets/                   # Images, icons, and static files
│   │   ├── favicon.ico
│   │   ├── UAI.svg
│   │   └── ...                   # Various app icons
│   ├── data/                     # JSON data files
│   │   ├── carreras.json         # Careers/degrees data
│   │   ├── data_ICInf.json       # Computer Science curriculum
│   │   ├── colors_ICInf.json     # Color scheme
│   │   └── welcomeTexts.json     # Welcome messages
│   ├── browserconfig.xml         # Browser configuration
│   ├── site.webmanifest          # PWA manifest
│   ├── serviceWorker.js          # Service worker for PWA
│   └── date.txt                  # Last update date
│
├── dist/                         # Build output (gitignored)
│   ├── js/
│   │   ├── main.bundle.js
│   │   ├── ica.bundle.js
│   │   ├── generator.bundle.js
│   │   └── custom.bundle.js
│   ├── css/
│   │   ├── styles.min.css
│   │   └── darkMode.min.css
│   └── *.html
│
├── scripts/                      # Build and utility scripts
│   ├── build.js                  # Node.js build script (cross-platform)
│   ├── dev-server.js             # Development server
│   ├── clean.sh
│   ├── decompress.js
│   └── ...
│
├── .github/                      # GitHub configurations
├── package.json                  # Node.js dependencies
├── Dockerfile                    # Docker configuration
├── README.md                     # Project documentation
└── STRUCTURE.md                  # This file
```

## Key Changes

### Source Code Organization

- **src/js/core/**: Contains the fundamental classes (`Malla.js`, `Ramo.js`) that form the core of the application
- **src/js/init/**: Initialization and configuration code separated from core logic
- **src/js/managers/** and **src/js/editors/**: Empty directories ready for future modular components
- **src/css/**: All CSS files consolidated in one location
- **src/views/**: HTML components/partials

### Static Assets

- **public/**: All static files that are served directly to the browser
- **public/data/**: JSON data files separated from code
- **public/assets/**: Images, icons, and other media files

### Build Output

- **dist/**: Generated/minified files from the build process (not tracked in git)
- Configured in `.gitignore` to avoid committing build artifacts

## Development Workflow

### Running the Development Server

```bash
# Start the development server
node scripts/dev-server.js

# Or with a custom port
PORT=3001 node scripts/dev-server.js
```

The dev server will serve files from the `public/` directory at `http://localhost:3000`

### Building for Production

```bash
# Run the build script
node scripts/build.js

# Output will be in the dist/ directory
```

## Migration Notes

### File Movements

| Old Location | New Location |
|--------------|--------------|
| `js/malla.js` | `src/js/core/Malla.js` |
| `js/ramo.js` | `src/js/core/Ramo.js` |
| `js/init.js` | `src/js/init/main.js` |
| `css/*.css` | `src/css/*.css` |
| `views/*.html` | `src/views/*.html` |
| `index.html` | `public/index.html` |
| `data/*.json` | `public/data/*.json` |
| `assets/*` | `public/assets/*` |

### Removed Files

- `js/min1.js` - Minified file (build artifact)
- Old directory structure (`js/`, `css/`, `views/`, `data/`, `assets/`)

## Benefits

1. **Clear Separation**: Source code, static assets, and build outputs are clearly separated
2. **Scalability**: Empty directories for managers and editors provide clear locations for future features
3. **Maintainability**: Easier to navigate and understand the project structure
4. **Build Process**: Distinct source and output directories support modern build workflows
5. **Version Control**: Build artifacts in `dist/` are gitignored, keeping the repository clean

## Next Steps

- Update import paths in HTML files to reference the new locations
- Configure build tools to output to `dist/` directory
- Implement module bundling for better performance
- Add more specific subdirectories as needed (e.g., `src/js/utils/`, `src/js/components/`)