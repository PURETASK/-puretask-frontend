// src/app/cleaner/onboarding/page.tsx
// Enhanced 10-step cleaner onboarding

'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { useCleanerOnboarding } from '@/hooks/useCleanerOnboarding';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { TermsAgreementStep } from '@/components/onboarding/TermsAgreementStep';
import { BasicInfoStep } from '@/components/onboarding/BasicInfoStep';
import { PhoneVerificationStep } from '@/components/onboarding/PhoneVerificationStep';
import { FaceVerificationStep } from '@/components/onboarding/FaceVerificationStep';
import { IDVerificationStep } from '@/components/onboarding/IDVerificationStep';
import { BackgroundCheckConsentStep } from '@/components/onboarding/BackgroundCheckConsentStep';
import { ServiceAreaStep } from '@/components/onboarding/ServiceAreaStep';
import { AvailabilityStep } from '@/components/onboarding/AvailabilityStep';
import { RatesStep } from '@/components/onboarding/RatesStep';
import { OnboardingReviewStep } from '@/components/onboarding/OnboardingReviewStep';
import { OnboardingComplete } from '@/components/onboarding/OnboardingComplete';
// Simple toast utility (replace with your preferred toast library)
const toast = {
  success: (message: string) => {
    if (typeof window !== 'undefined') {
      alert(`✓ ${message}`);
    }
  },
  error: (message: string) => {
    if (typeof window !== 'undefined') {
      alert(`✗ ${message}`);
    }
  },
};

export default function OnboardingPage() {
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    progress,
    isLoading,
    progressData,
    completedData,
    goToNextStep,
    goToPreviousStep,
    saveAgreements,
    saveAgreementsLoading,
    saveBasicInfo,
    saveBasicInfoLoading,
    sendOTP,
    sendOTPLoading,
    sendOTPError,
    verifyOTP,
    verifyOTPLoading,
    verifyOTPError,
    uploadFacePhoto,
    uploadFacePhotoLoading,
    uploadIDVerification,
    uploadIDVerificationLoading,
    saveBackgroundConsent,
    saveBackgroundConsentLoading,
    saveServiceAreas,
    saveServiceAreasLoading,
    saveAvailability,
    saveAvailabilityLoading,
    saveRates,
    saveRatesLoading,
    completeOnboarding,
    completeOnboardingLoading,
  } = useCleanerOnboarding();

  // Show completion screen if onboarding is complete
  if (progressData?.completed === 10) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <main className="flex-1 py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <OnboardingComplete />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'terms':
        return (
          <TermsAgreementStep
            onNext={async (data) => {
              try {
                await saveAgreements(data);
                toast.success('Agreements saved');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to save agreements');
              }
            }}
            isLoading={saveAgreementsLoading}
          />
        );

      case 'basic-info':
        return (
          <BasicInfoStep
            onNext={async (data) => {
              try {
                await saveBasicInfo(data);
                toast.success('Basic info saved');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to save basic info');
              }
            }}
            onBack={goToPreviousStep}
            isLoading={saveBasicInfoLoading}
          />
        );

      case 'phone-verification':
        return (
          <PhoneVerificationStep
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            onSendOTP={async (phone) => {
              try {
                await sendOTP(phone);
                toast.success('Verification code sent!');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to send code');
                throw error;
              }
            }}
            onVerifyOTP={async (phone, code) => {
              try {
                await verifyOTP({ phone_number: phone, otp_code: code });
                toast.success('Phone verified!');
              } catch (error: any) {
                toast.error(error?.message || 'Invalid verification code');
                throw error;
              }
            }}
            sendOTPLoading={sendOTPLoading}
            verifyOTPLoading={verifyOTPLoading}
            error={sendOTPError || verifyOTPError}
          />
        );

      case 'face-verification':
        return (
          <FaceVerificationStep
            onNext={async (file) => {
              try {
                await uploadFacePhoto(file);
                toast.success('Photo uploaded!');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to upload photo');
              }
            }}
            onBack={goToPreviousStep}
            isLoading={uploadFacePhotoLoading}
          />
        );

      case 'id-verification':
        return (
          <IDVerificationStep
            onNext={async (file, documentType) => {
              try {
                await uploadIDVerification({ file, document_type: documentType });
                toast.success('ID document uploaded!');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to upload ID document');
              }
            }}
            onBack={goToPreviousStep}
            isLoading={uploadIDVerificationLoading}
          />
        );

      case 'background-consent':
        return (
          <BackgroundCheckConsentStep
            onNext={async (data) => {
              try {
                await saveBackgroundConsent(data);
                toast.success('Background check consent saved');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to save consent');
              }
            }}
            onBack={goToPreviousStep}
            isLoading={saveBackgroundConsentLoading}
          />
        );

      case 'service-areas':
        return (
          <ServiceAreaStep
            onNext={async (data) => {
              try {
                await saveServiceAreas(data);
                toast.success('Service areas saved');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to save service areas');
              }
            }}
            onBack={goToPreviousStep}
            isLoading={saveServiceAreasLoading}
          />
        );

      case 'availability':
        return (
          <AvailabilityStep
            onNext={async (blocks) => {
              try {
                await saveAvailability({ blocks });
                toast.success('Availability saved');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to save availability');
              }
            }}
            onBack={goToPreviousStep}
            isLoading={saveAvailabilityLoading}
          />
        );

      case 'rates':
        return (
          <RatesStep
            onNext={async (data) => {
              try {
                await saveRates(data);
                toast.success('Rates saved');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to save rates');
              }
            }}
            onBack={goToPreviousStep}
            isLoading={saveRatesLoading}
          />
        );

      case 'review':
        return (
          <OnboardingReviewStep
            onComplete={async () => {
              try {
                await completeOnboarding();
                toast.success('Onboarding complete!');
              } catch (error: any) {
                toast.error(error?.message || 'Failed to complete onboarding');
              }
            }}
            onBack={goToPreviousStep}
            isLoading={completeOnboardingLoading}
            completedData={completedData}
            progressData={progressData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <OnboardingProgress
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            progress={progress}
          />

          {/* Step content */}
          <Card>
            <CardContent className="p-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading...</p>
                </div>
              ) : (
                renderStep()
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
