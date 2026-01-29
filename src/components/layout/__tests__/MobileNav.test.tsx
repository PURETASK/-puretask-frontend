// src/components/layout/__tests__/MobileNav.test.tsx
// Unit tests for MobileNav component

import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNav } from '../MobileNav';
import { AuthContext } from '@/contexts/AuthContext';

const mockLogout = jest.fn();

const mockClientAuth = {
  user: {
    id: 'user-123',
    email: 'client@example.com',
    role: 'client' as const,
  },
  login: jest.fn(),
  logout: mockLogout,
  isLoading: false,
};

const mockCleanerAuth = {
  user: {
    id: 'cleaner-123',
    email: 'cleaner@example.com',
    role: 'cleaner' as const,
  },
  login: jest.fn(),
  logout: mockLogout,
  isLoading: false,
};

describe('MobileNav', () => {
  it('shows role-specific links for client', () => {
    render(
      <AuthContext.Provider value={mockClientAuth}>
        <MobileNav />
      </AuthContext.Provider>
    );

    // Open menu
    const menuButton = screen.getByLabelText(/toggle menu/i);
    fireEvent.click(menuButton);

    expect(screen.getByText(/bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/messages/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('shows role-specific links for cleaner', () => {
    render(
      <AuthContext.Provider value={mockCleanerAuth}>
        <MobileNav />
      </AuthContext.Provider>
    );

    // Open menu
    const menuButton = screen.getByLabelText(/toggle menu/i);
    fireEvent.click(menuButton);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });

  it('closes menu when link is clicked', () => {
    render(
      <AuthContext.Provider value={mockClientAuth}>
        <MobileNav />
      </AuthContext.Provider>
    );

    // Open menu
    const menuButton = screen.getByLabelText(/toggle menu/i);
    fireEvent.click(menuButton);

    // Click a link
    const bookingsLink = screen.getByText(/bookings/i);
    fireEvent.click(bookingsLink);

    // Menu should close (link should not be visible)
    expect(screen.queryByText(/bookings/i)).not.toBeVisible();
  });

  it('toggles menu open/close', () => {
    render(
      <AuthContext.Provider value={mockClientAuth}>
        <MobileNav />
      </AuthContext.Provider>
    );

    const menuButton = screen.getByLabelText(/toggle menu/i);
    
    // Initially closed
    expect(screen.queryByText(/bookings/i)).not.toBeInTheDocument();

    // Open
    fireEvent.click(menuButton);
    expect(screen.getByText(/bookings/i)).toBeInTheDocument();

    // Close
    fireEvent.click(menuButton);
    expect(screen.queryByText(/bookings/i)).not.toBeInTheDocument();
  });

  it('calls logout when logout button clicked', () => {
    render(
      <AuthContext.Provider value={mockClientAuth}>
        <MobileNav />
      </AuthContext.Provider>
    );

    // Open menu
    const menuButton = screen.getByLabelText(/toggle menu/i);
    fireEvent.click(menuButton);

    // Click logout
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
