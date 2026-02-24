import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('displays error message', () => {
    const error = new Error('Something went wrong');
    render(<ErrorDisplay error={error} />);
    const matches = screen.getAllByText(/something went wrong/i);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toBeInTheDocument();
  });

  it('shows retry button when onRetry provided', () => {
    const error = new Error('Test error');
    const onRetry = jest.fn();
    render(<ErrorDisplay error={error} onRetry={onRetry} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('displays custom title', () => {
    const error = new Error('Test');
    render(<ErrorDisplay error={error} title="Custom Title" />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});
