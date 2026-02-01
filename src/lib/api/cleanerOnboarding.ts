// src/lib/api/cleanerOnboarding.ts
// API client functions for cleaner onboarding

import { apiClient } from '../api';

export interface OnboardingProgress {
  completed: number;
  total: number;
  percentage: number;
  current_step?: string;
  steps: {
    agreements: boolean;
    basic_info: boolean;
    phone_verified: boolean;
    profile_photo: boolean;
    id_verification: boolean;
    background_check: boolean;
    service_areas: boolean;
    availability: boolean;
    rates: boolean;
  };
}

export interface AgreementsData {
  terms_of_service: boolean;
  independent_contractor: boolean;
}

export interface BasicInfoData {
  first_name: string;
  last_name: string;
  bio: string;
  professional_headline?: string;
}

export interface PhoneVerificationData {
  phone_number: string;
  otp_code?: string;
}

export interface ServiceAreasData {
  zip_codes: string[];
  travel_radius_km: number;
}

export interface AvailabilityBlock {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface AvailabilityData {
  blocks: AvailabilityBlock[];
}

export interface RatesData {
  hourly_rate_credits: number;
  travel_radius_km: number;
}

export interface BackgroundConsentData {
  fcra_consent: boolean;
  accuracy_consent: boolean;
}

/**
 * Get onboarding progress
 */
export async function getOnboardingProgress(): Promise<{ progress: OnboardingProgress }> {
  return apiClient.get('/cleaner/onboarding/progress');
}

/**
 * Step 1: Save agreements
 */
export async function saveAgreements(data: AgreementsData): Promise<{ success: boolean }> {
  return apiClient.post('/cleaner/onboarding/agreements', data);
}

/**
 * Step 2: Save basic info
 */
export async function saveBasicInfo(data: BasicInfoData): Promise<{ success: boolean; profile?: any }> {
  return apiClient.post('/cleaner/onboarding/basic-info', data);
}

/**
 * Step 3: Send OTP
 */
export async function sendOTP(phone_number: string): Promise<{ success: boolean }> {
  return apiClient.post('/cleaner/onboarding/phone/send-otp', { phone_number });
}

/**
 * Step 3: Verify OTP
 */
export async function verifyOTP(phone_number: string, otp_code: string): Promise<{ success: boolean; verified: boolean }> {
  return apiClient.post('/cleaner/onboarding/phone/verify-otp', { phone_number, otp_code });
}

/**
 * Step 4: Upload face photo
 */
export async function uploadFacePhoto(file: File): Promise<{ success: boolean; profile_photo_url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post('/cleaner/onboarding/face-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Step 5: Upload ID verification
 */
export async function uploadIDVerification(
  file: File,
  document_type: 'drivers_license' | 'passport' | 'state_id'
): Promise<{ success: boolean; id_verification_id: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', document_type);
  
  return apiClient.post('/cleaner/onboarding/id-verification', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Step 6: Save background check consent
 */
export async function saveBackgroundConsent(data: BackgroundConsentData): Promise<{ success: boolean; background_check_id?: string }> {
  return apiClient.post('/cleaner/onboarding/background-consent', data);
}

/**
 * Step 7: Save service areas
 */
export async function saveServiceAreas(data: ServiceAreasData): Promise<{ success: boolean }> {
  return apiClient.post('/cleaner/onboarding/service-areas', data);
}

/**
 * Step 8: Save availability
 */
export async function saveAvailability(data: AvailabilityData): Promise<{ success: boolean }> {
  return apiClient.post('/cleaner/onboarding/availability', data);
}

/**
 * Step 9: Save rates
 */
export async function saveRates(data: RatesData): Promise<{ success: boolean }> {
  return apiClient.post('/cleaner/onboarding/rates', data);
}

/**
 * Step 10: Complete onboarding
 */
export async function completeOnboarding(): Promise<{ 
  success: boolean; 
  onboarding_completed_at: string; 
  redirect_to: string 
}> {
  return apiClient.post('/cleaner/onboarding/complete');
}

/**
 * Save current onboarding step (for persistence)
 */
export async function saveCurrentStep(step: string): Promise<{ success: boolean }> {
  return apiClient.patch('/cleaner/onboarding/current-step', { step });
}
