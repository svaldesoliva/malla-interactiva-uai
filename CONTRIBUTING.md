# Contributing to Malla Interactiva UAI

Thank you for your interest in contributing to Malla Interactiva UAI! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/malla-interactiva-uai.git
   cd malla-interactiva-uai
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm start
```

This will start a browser-sync server with live reload.

### Building the Project

```bash
npm run build
```

This minifies and optimizes the JavaScript and CSS files.

### Development Build

```bash
npm run devBuild
```

Creates a development build with source maps for debugging.

### Cleaning Up

```bash
npm run cleanDev
```

Removes build artifacts and temporary files.

## Coding Standards

### JavaScript

- Use ES6+ features (classes, arrow functions, const/let)
- Follow consistent naming conventions:
  - Classes: `PascalCase`
  - Variables/functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- Add JSDoc comments for classes and complex functions
- Keep functions focused and single-purpose
- Use meaningful variable names

### Code Formatting

- Use 4 spaces for indentation (configured in .editorconfig)
- Follow the ESLint configuration
- Run linting before committing:
  ```bash
  npm run lint
  ```

### File Organization

- Place JavaScript files in `/js`
- Place CSS files in `/css`
- Place data files (mallas) in `/data`
- Place documentation in `/docs`

## Submitting Changes

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add support for custom course prerequisites
fix: resolve rendering issue on mobile devices
docs: update installation instructions
style: format code according to ESLint rules
refactor: simplify semester calculation logic
test: add tests for course validation
```

Use conventional commit prefixes:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Pull Request Process

1. **Update your branch** with the latest changes from main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes** thoroughly:
   - Verify the development server runs
   - Test in multiple browsers
   - Check responsive design on mobile

3. **Run the build** to ensure no errors:
   ```bash
   npm run build
   ```

4. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Screenshots for UI changes
   - Reference to related issues (e.g., "Fixes #123")

6. **Respond to feedback** from reviewers promptly

### Pull Request Review

- At least one maintainer must approve the PR
- All automated checks must pass
- Code must follow the project's coding standards
- Changes must not break existing functionality

## Reporting Bugs

When reporting bugs, please use the bug report template and include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**:
  - Browser and version
  - Operating system
  - Screen resolution (for UI issues)

## Suggesting Enhancements

When suggesting enhancements, please use the feature request template and include:

- **Description**: Clear description of the feature
- **Use Case**: Why this feature would be useful
- **Proposed Solution**: How you think it should work
- **Alternatives**: Other ways to achieve the same goal
- **Additional Context**: Screenshots, mockups, etc.

## Questions?

If you have questions about contributing, feel free to:
- Open a discussion on GitHub
- Contact the maintainers
- Check existing issues and pull requests

Thank you for contributing to Malla Interactiva UAI! 🎓
