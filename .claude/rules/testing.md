# Testing

Paths: apps/*/src/**/*.test.{ts,tsx}

## Framework

- Vitest + React Testing Library
- Test files next to component: `ComponentName.test.tsx`
- `describe('ComponentName', ...)` block per component
- One assertion per `it` block

## Writing Tests

- Use accessible queries: `getByRole` > `getByLabelText` > `getByTestId`
- Mock `fetch` with `vi.fn()` for API calls
- Use `userEvent` over `fireEvent`
- Wrap async assertions in `waitFor` or `findBy*`
- No `console.log` in tests

## Coverage

Goal: >80% coverage on all components.
