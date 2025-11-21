"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationCertificateRepositoryPostgres = void 0;
const localSupabase_1 = __importDefault(require("../localSupabase"));
class ValidationCertificateRepositoryPostgres {
    async getValidationInfoById(user_id) {
        try {
            const result = await localSupabase_1.default.query(`SELECT 
                    vc.certificate_id,
                    vc.certificate_state,
                    vc.emition_date,
                    vc.exp_date,
                    vi.name AS institution_name
                FROM validation_certificate vc
                JOIN validation_institution vi 
                    ON vc.institution_id = vi.institution_id
                WHERE vc.user_id = $1
                ORDER BY vc.emition_date DESC
                LIMIT 1;
                `, [user_id]);
            if (result.rows.length === 0) {
                return 'No validation certificate found for this user.';
            }
            const cert = result.rows[0];
            return `Certificate ID: ${cert.certificate_id}, State: ${cert.certificate_state}, Emition Date: ${cert.emition_date}, Expiration Date: ${cert.exp_date}, institution_name: ${cert.institution_name}`;
        }
        catch (err) {
            throw err;
        }
    }
    async affiliateToInstitution(user_id, institution_id) {
        // Hay que idea una manera para agregar el hash y la url
        try {
            await localSupabase_1.default.query(`INSERT INTO validation_certificate (certificate_state, document_hash, document_url, institution_id, user_id) VALUES ($1, $2, $3, $4, $5)`, ['valid', 'hash', 'url', institution_id, user_id]);
        }
        catch (err) {
            throw err;
        }
    }
}
exports.ValidationCertificateRepositoryPostgres = ValidationCertificateRepositoryPostgres;
