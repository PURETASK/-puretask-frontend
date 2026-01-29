import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-blue-600');

    rerender(<Button variant="outline">Outline</Button>);
    // Outline variant uses border-2, not just border
    expect(screen.getByText('Outline')).toHaveClass('border-2');
  });

  it('disables when loading', () => {
    render(<Button isLoading>Loading</Button>);
    // Button shows "Loading..." not "Loading"
    const button = screen.getByText(/Loading/i);
    expect(button).toBeDisabled();
  });
});
