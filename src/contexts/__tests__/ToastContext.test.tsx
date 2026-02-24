// src/contexts/__tests__/ToastContext.test.tsx
// Unit tests for ToastContext

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';
import { act } from 'react';

// Test component that uses toast
const TestComponent = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Test message', 'success')}>
        Show Toast
      </button>
    </div>
  );
};

// TODO: Fix async/timer mocks for toast visibility (TODOS.md)
describe.skip('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('displays toast when showToast is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText(/show toast/i);
    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByText(/test message/i)).toBeInTheDocument();
    });
  });

  it('auto-dismisses toast after timeout', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText(/show toast/i);
    act(() => {
      button.click();
    });

    await waitFor(() => {
      expect(screen.getByText(/test message/i)).toBeInTheDocument();
    });

    // Advance timer past default timeout (usually 5000ms)
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByText(/test message/i)).not.toBeInTheDocument();
    });
  });

  it('shows different toast types', async () => {
    const TestTypes = () => {
      const { showToast } = useToast();

      return (
        <div>
          <button onClick={() => showToast('Success', 'success')}>Success</button>
          <button onClick={() => showToast('Error', 'error')}>Error</button>
          <button onClick={() => showToast('Info', 'info')}>Info</button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestTypes />
      </ToastProvider>
    );

    act(() => {
      screen.getByText(/success/i).click();
    });

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
