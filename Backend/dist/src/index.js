"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const analyticsRoutes_1 = require("./Business/Routes/analyticsRoutes");
const marketRoutes_1 = require("./Business/Routes/marketRoutes");
const processValidationRoutes_1 = require("./Business/Routes/processValidationRoutes");
const tokenRoutes_1 = require("./Business/Routes/tokenRoutes");
const userRoutes_1 = require("./Business/Routes/userRoutes");
const walletRoutes_1 = require("./Business/Routes/walletRoutes");
const localSupabase_1 = require("./Persistence/localSupabase");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// logger
app.use((req, _res, next) => {
    console.log(`[REQ] ${req.method} ${req.path}`, req.body);
    next();
});
// Middleware base
app.use(express_1.default.json());
// Rutas del negocio
app.use('/analytics', analyticsRoutes_1.router);
app.use('/market', marketRoutes_1.router);
app.use('/validation', processValidationRoutes_1.router);
app.use('/token', tokenRoutes_1.router);
app.use('/user', userRoutes_1.router);
app.use('/wallet', walletRoutes_1.router);
// Iniciar conexión a la base de datos
(0, localSupabase_1.connectDB)();
// Puerto configurable
const PORT = process.env.PORT || 4000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Backend running on port ${PORT}`);
    });
}
