"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analyticsService_1 = __importDefault(require("../Services/analyticsService"));
class AnalyticsController {
    constructor() {
        this.analyticsService = new analyticsService_1.default();
    }
    async getTokenAnalytics(req, res) {
        try {
            const token_analytics = await this.analyticsService.getFullAnalytics(req.body.token_id, req.body.lastTokenPrice);
            return res.status(200).json(token_analytics);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
exports.default = new AnalyticsController();
