import { jest } from '@jest/globals';

// Configuración global para Jest
global.jest = jest;

// Configurar timeout global para tests
jest.setTimeout(10000);

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';

// Configurar console para tests
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});