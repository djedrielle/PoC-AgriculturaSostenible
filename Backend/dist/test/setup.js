"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Configuración global para Jest
global.jest = globals_1.jest;
// Configurar timeout global para tests
globals_1.jest.setTimeout(10000);
// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
// Configurar console para tests
console.log = globals_1.jest.fn();
console.error = globals_1.jest.fn();
console.warn = globals_1.jest.fn();
// Limpiar mocks después de cada test
afterEach(() => {
    globals_1.jest.clearAllMocks();
});
