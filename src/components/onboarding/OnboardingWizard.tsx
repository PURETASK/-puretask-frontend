'use client';

import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface OnboardingWizardProps {
  steps: Step[];
  onComplete: () => void;
  onSkip?: () => void;
  className?: string;
}

export function OnboardingWizard({
  steps,
  onComplete,
  onSkip,
  className,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    // Allow clicking on completed steps or next step
    if (index <= currentStep || completedSteps.has(steps[index].id)) {
      setCurrentStep(index);
    }
  };

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar value={progress} showLabel label={`Step ${currentStep + 1} of ${steps.length}`} />
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id) || index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = index <= currentStep || isCompleted;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => isClickable && handleStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center gap-2 flex-1',
                  !isClickable && 'cursor-not-allowed opacity-50'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                    isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      'text-xs font-medium',
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2',
                    index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          <div className="min-h-[400px]">
            {steps[currentStep].component}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip Tutorial
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              {!isFirstStep && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              <Button variant="primary" onClick={handleNext}>
                {isLastStep ? 'Complete' : 'Next'}
                {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
