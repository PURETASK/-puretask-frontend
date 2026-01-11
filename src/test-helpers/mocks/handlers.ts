// src/test-helpers/mocks/handlers.ts
// MSW (Mock Service Worker) API handlers for testing

import { rest } from 'msw';

const BASE_URL = 'http://localhost:4000';

export const handlers = [
  // Auth endpoints
  rest.post(`${BASE_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '123',
          email: 'test@test.com',
          role: 'client',
          created_at: new Date().toISOString(),
        },
      })
    );
  }),

  rest.post(`${BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '123',
          email: 'test@test.com',
          role: 'client',
          created_at: new Date().toISOString(),
        },
      })
    );
  }),

  rest.get(`${BASE_URL}/auth/me`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: '123',
          email: 'test@test.com',
          role: 'client',
          created_at: new Date().toISOString(),
        },
      })
    );
  }),

  // Cleaners endpoint
  rest.get(`${BASE_URL}/cleaner`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        cleaners: [
          {
            id: '1',
            user_id: '1',
            name: 'Test Cleaner',
            avg_rating: 4.5,
            total_jobs_completed: 100,
            hourly_rate_credits: 50,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
        },
      })
    );
  }),

  // Jobs/Bookings endpoint
  rest.get(`${BASE_URL}/jobs`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        jobs: [
          {
            id: '1',
            client_id: '123',
            cleaner_id: '1',
            status: 'confirmed',
            scheduled_date: new Date().toISOString(),
            total_credits: 100,
          },
        ],
      })
    );
  }),

  // Messages endpoint
  rest.get(`${BASE_URL}/messages`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        conversations: [],
      })
    );
  }),
];

