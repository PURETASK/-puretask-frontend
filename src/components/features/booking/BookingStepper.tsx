'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export interface BookingStepperProps {
  currentStep: number;
  steps: { label: string }[];
  className?: string;
}

/**
 * Animated stepper: progress bar fills with spring, step circles transition, labels below.
 */
export function BookingStepper({ currentStep, steps, className }: BookingStepperProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center justify-between">
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const isActive = currentStep >= stepNum;
          const isCurrent = currentStep === stepNum;
          return (
            <React.Fragment key={stepNum}>
              <div className="flex items-center flex-1">
                <motion.div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0',
                    isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  )}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.08 : 1,
                    transition: motionTokens.spring.soft,
                  }}
                  transition={motionTokens.spring.soft}
                >
                  {stepNum}
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 rounded-full bg-gray-300 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-blue-600"
                      initial={false}
                      animate={{ width: currentStep > stepNum ? '100%' : '0%' }}
                      transition={motionTokens.spring.medium}
                      style={{ originX: 0 }}
                    />
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        {steps.map((s, i) => (
          <motion.span
            key={i}
            className={cn(
              'flex-1 text-center',
              currentStep === i + 1 && 'font-semibold text-blue-600'
            )}
            initial={false}
            animate={{ opacity: currentStep === i + 1 ? 1 : 0.8 }}
            transition={{ duration: motionTokens.duration.fast }}
          >
            {s.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export interface BookingStepContentProps {
  step: number;
  children: React.ReactNode;
  direction: 1 | -1;
}

/**
 * Wraps step content with horizontal slide + fade. Use with AnimatePresence.
 */
export function BookingStepContent({ step, children, direction }: BookingStepContentProps) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: direction * 24, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: direction * -24, filter: 'blur(4px)' }}
      transition={{
        duration: motionTokens.duration.base,
        ease: motionTokens.ease.out,
      }}
    >
      {children}
    </motion.div>
  );
}
