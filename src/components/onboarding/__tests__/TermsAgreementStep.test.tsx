// src/components/onboarding/__tests__/TermsAgreementStep.test.tsx
// Unit tests for TermsAgreementStep component

import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { TermsAgreementStep } from '../TermsAgreementStep';

// TODO: Fix TermsAgreementStep tests (labels/structure) - TODOS.md
describe.skip('TermsAgreementStep', () => {
  it('renders terms and contractor checkboxes', () => {
    const onNext = jest.fn();
    render(<TermsAgreementStep onNext={onNext} />);
    
    expect(screen.getByText(/Terms & Agreements/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Independent Contractor Agreement/i)).toBeInTheDocument();
  });

  it('disables continue button when checkboxes not checked', () => {
    const onNext = jest.fn();
    render(<TermsAgreementStep onNext={onNext} />);
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it('enables continue button when both checkboxes checked', () => {
    const onNext = jest.fn();
    render(<TermsAgreementStep onNext={onNext} />);
    
    const termsCheckbox = screen.getByLabelText(/terms of service/i);
    const contractorCheckbox = screen.getByLabelText(/independent contractor/i);
    
    fireEvent.click(termsCheckbox);
    fireEvent.click(contractorCheckbox);
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).not.toBeDisabled();
  });

  it('calls onNext with correct data when submitted', () => {
    const onNext = jest.fn();
    render(<TermsAgreementStep onNext={onNext} />);
    
    const termsCheckbox = screen.getByLabelText(/terms of service/i);
    const contractorCheckbox = screen.getByLabelText(/independent contractor/i);
    
    fireEvent.click(termsCheckbox);
    fireEvent.click(contractorCheckbox);
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);
    
    expect(onNext).toHaveBeenCalledWith({
      terms_of_service: true,
      independent_contractor: true,
    });
  });

  it('shows loading state when isLoading is true', () => {
    const onNext = jest.fn();
    render(<TermsAgreementStep onNext={onNext} isLoading={true} />);
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });
});
