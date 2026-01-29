import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('displays error message', () => {
    const error = new Error('Something went wrong');
    render(<ErrorDisplay error={error} />);
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('shows retry button when onRetry provided', () => {
    const error = new Error('Test error');
    const onRetry = jest.fn();
    
    render(<ErrorDisplay error={error} onRetry={onRetry} />);
    
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it('displays custom title', () => {
    const error = new Error('Test');
    render(<ErrorDisplay error={error} title="Custom Title" />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});
