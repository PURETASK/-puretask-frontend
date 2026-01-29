/**
 * Zod validation schemas for forms
 */

import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'cleaner']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Booking schemas
export const bookingSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  scheduled_start_at: z.string().datetime('Invalid date/time'),
  scheduled_end_at: z.string().datetime('Invalid date/time'),
  service_type: z.enum(['standard', 'deep', 'move_in_out', 'airbnb']),
  duration_hours: z.number().min(1).max(12),
  add_ons: z.array(z.string()).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

// Profile schemas
export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

// Address schemas
export const addressSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  is_default: z.boolean().optional(),
});

// Review schemas
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be less than 1000 characters'),
  job_id: z.string().uuid('Invalid job ID'),
});

// Cleaner availability schema
export const availabilitySchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
});

// Message schema
export const messageSchema = z.object({
  body: z.string().min(1, 'Message cannot be empty').max(5000, 'Message is too long'),
  job_id: z.string().uuid('Invalid job ID').optional(),
  receiver_id: z.string().uuid('Invalid receiver ID'),
});
