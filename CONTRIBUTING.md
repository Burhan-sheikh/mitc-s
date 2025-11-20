# Contributing to MITC Store

Thank you for considering contributing to MITC Store! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Use the issue tracker to create a new bug report
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details

### Suggesting Features

1. Open an issue with the "feature request" label
2. Clearly describe the feature and its benefits
3. Provide use cases and examples

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Follow code standards**
5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push to your fork**
7. **Open a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mitc-s.git
cd mitc-s

# Install dependencies
npm install
cd functions && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm run dev
```

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Avoid `any` type
- Use strict mode

### React

- Functional components with hooks
- Use TypeScript for props
- Follow component composition patterns
- Extract reusable logic into custom hooks

### Styling

- Use Tailwind CSS utility classes
- Follow the design system in `tailwind.config.js`
- Use glassmorphism components consistently
- Ensure dark mode support

### Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useProducts.ts`)
- **Utilities**: camelCase (`imageCompression.ts`)
- **Constants**: UPPER_SNAKE_CASE
- **Types**: PascalCase

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## Testing

### Run Tests

```bash
npm test
```

### Write Tests

- Write unit tests for utilities
- Write integration tests for critical flows
- Test Firestore security rules

## Code Review Process

1. All PRs require at least one approval
2. Address review comments
3. Keep PRs focused and small
4. Update documentation as needed

## Documentation

- Update README.md if adding features
- Document complex logic with comments
- Update ARCHITECTURE.md for structural changes
- Keep CHANGELOG.md updated

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue with the "question" label or contact the maintainers.

---

Thank you for contributing! 🚀