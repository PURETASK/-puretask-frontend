// src/test-helpers/mocks/server.ts
// MSW server setup for tests

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

