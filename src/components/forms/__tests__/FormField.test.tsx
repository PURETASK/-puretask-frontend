// src/components/forms/__tests__/FormField.test.tsx
// Unit tests for FormField component

import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { FormField } from '../FormField';

describe('FormField', () => {
  it('displays label', () => {
    render(
      <FormField label="Email Address" name="email">
        <input type="email" id="email" name="email" />
      </FormField>
    );

    expect(screen.getByText(/email address/i)).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <FormField label="Email" name="email" required>
        <input type="email" id="email" name="email" />
      </FormField>
    );

    const label = screen.getByText(/email/i);
    expect(label).toHaveTextContent('*');
  });

  it('shows error message when error prop provided', () => {
    render(
      <FormField label="Email" name="email" error="Email is required">
        <input type="email" id="email" name="email" />
      </FormField>
    );

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toHaveAttribute('role', 'alert');
  });

  it('shows hint when no error', () => {
    render(
      <FormField label="Email" name="email" hint="Enter your email address">
        <input type="email" id="email" name="email" />
      </FormField>
    );

    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
  });

  it('hides hint when error is present', () => {
    render(
      <FormField 
        label="Email" 
        name="email" 
        error="Email is required"
        hint="Enter your email address"
      >
        <input type="email" id="email" name="email" />
      </FormField>
    );

    expect(screen.queryByText(/enter your email address/i)).not.toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <FormField label="Email" name="email">
        <input type="email" id="email" name="email" data-testid="custom-input" />
      </FormField>
    );

    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('uses default Input when no children provided', () => {
    render(
      <FormField label="Email" name="email" />
    );

    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('name', 'email');
  });
});
