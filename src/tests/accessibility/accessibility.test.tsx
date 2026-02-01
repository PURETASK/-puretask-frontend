// src/tests/accessibility/accessibility.test.tsx
// Accessibility tests using jest-axe

import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { Header } from '@/components/layout/Header';
import { AuthContext } from '@/contexts/AuthContext';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible loading state', async () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('FormField Component', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <FormField label="Email" name="email" required>
          <input type="email" id="email" name="email" />
        </FormField>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible error state', async () => {
      const { container } = render(
        <FormField label="Email" name="email" error="Email is required">
          <input type="email" id="email" name="email" aria-invalid="true" />
        </FormField>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Header Component', () => {
    it('has no accessibility violations', async () => {
      const mockAuth = {
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        isLoading: false,
      };

      const { container } = render(
        <AuthContext.Provider value={mockAuth}>
          <Header />
        </AuthContext.Provider>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
