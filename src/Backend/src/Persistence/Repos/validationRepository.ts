export interface ValidationCertificateRepository {
    affiliateToInstitution(user_id: string, institution_id: string): Promise<void>;
}

export class ValidationCertificateRepositoryPostgres implements ValidationCertificateRepository {

  async affiliateToInstitution(user_id: string, institution_id: string): Promise<void> {
    // Hay que idea una manera para agregar el hash y la url
        try {
            await db.query(
                `INSERT INTO validation_certificate (certificate_state, document_hash, document_url, institution_id, user_id) VALUES ($1, $2, $3, $4, $5)`,
                ['pending', '', '', institution_id, user_id]
            );
        } catch (err) {
            throw err;
        }
    }
    async getValidationInfoById(user_id: string): Promise<string> {
        try {
            const result = await db.query(
                `SELECT * FROM validation_certificate WHERE user_id = $1 ORDER BY emition_date DESC LIMIT 1`,
                [user_id]
            );
            if (result.rows.length === 0) {
                return 'No validation certificate found for this user.';
            }
            const cert = result.rows[0];
            return `Certificate ID: ${cert.production_id}, State: ${cert.certificate_state}, Emition Date: ${cert.emition_date}, Expiration Date: ${cert.exp_date}, Document URL: ${cert.document_url}`;
        } catch (err) {
            throw err;
        }
    }

}
