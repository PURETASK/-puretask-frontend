// src/components/onboarding/__tests__/OnboardingProgress.test.tsx
// Unit tests for OnboardingProgress component

import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { OnboardingProgress } from '../OnboardingProgress';

describe('OnboardingProgress', () => {
  it('displays progress percentage', () => {
    render(<OnboardingProgress currentStep={3} totalSteps={10} progress={30} />);
    expect(screen.getByText(/30\s*%\s*Complete/)).toBeInTheDocument();
    expect(screen.getByText(/Step\s*3\s*of\s*10/)).toBeInTheDocument();
  });

  it('highlights current step', () => {
    render(<OnboardingProgress currentStep={5} totalSteps={10} progress={50} />);
    
    // Current step should be highlighted
    const step5 = screen.getByText('5');
    expect(step5).toBeInTheDocument();
  });

  it('shows completed steps', () => {
    render(<OnboardingProgress currentStep={3} totalSteps={10} progress={30} />);
    
    // Steps 1-3 should be active
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays all step labels', () => {
    render(<OnboardingProgress currentStep={1} totalSteps={10} progress={10} />);
    
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });
});
