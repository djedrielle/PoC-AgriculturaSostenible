import { User } from '../Models/user';
import { ValidationCertificate } from '../Models/validation_certificate';
import { ValidationInstitution } from '../Models/validation_institution';

//Aquí hay que agregar la funcionalidad para solicitar un certificado de validación.

/**
 * validationService.ts
 *
 * Usa los modelos externos:
 *  - user.ts
 *  - validation_certificate.ts
 *  - validation_institution.ts
 *
 * Resto del servicio y repositorio en memoria igual que antes.
 */


export interface Affiliation {
    id: string;
    userId: string;
    institutionId: string;
    since: string; // ISO date
    active: boolean;
}

export interface ValidationInfo {
    id: string;
    description: string;
    institutionId: string;
    issuedAt: string;
    metadata?: Record<string, unknown>;
}

export interface ValidationRepository {
    getUserById(id: string): Promise<User | null>;
    getInstitutionById(id: string): Promise<ValidationInstitution | null>;
    getAffiliation(userId: string, institutionId: string): Promise<Affiliation | null>;
    createAffiliation(aff: Affiliation): Promise<void>;
    getCertificatesByUser(userId: string): Promise<ValidationCertificate[]>;
    getValidationInfoById(id: string): Promise<ValidationInfo | null>;
}

/**
 * Implementación simple en memoria para desarrollo/pruebas.
 * Reemplazar por acceso a BD en producción.
 */
export class InMemoryValidationRepository implements ValidationRepository {
    private users: User[] = [];
    private institutions: ValidationInstitution[] = [];
    private affiliations: Affiliation[] = [];
    private certificates: ValidationCertificate[] = [];
    private infos: ValidationInfo[] = [];

    constructor(initial?: {
        users?: User[];
        institutions?: ValidationInstitution[];
        affiliations?: Affiliation[];
        certificates?: ValidationCertificate[];
        infos?: ValidationInfo[];
    }) {
        if (initial) {
            this.users = initial.users ?? [];
            this.institutions = initial.institutions ?? [];
            this.affiliations = initial.affiliations ?? [];
            this.certificates = initial.certificates ?? [];
            this.infos = initial.infos ?? [];
        }
    }

    async getUserById(id: string) {
        return this.users.find(u => u.id === id) ?? null;
    }
    async getInstitutionById(id: string) {
        return this.institutions.find(i => i.id === id) ?? null;
    }
    async getAffiliation(userId: string, institutionId: string) {
        return this.affiliations.find(a => a.userId === userId && a.institutionId === institutionId) ?? null;
    }
    async createAffiliation(aff: Affiliation) {
        this.affiliations.push(aff);
    }
    async getCertificatesByUser(userId: string) {
        return this.certificates.filter(c => c.userId === userId);
    }
    async getValidationInfoById(id: string) {
        return this.infos.find(i => i.id === id) ?? null;
    }

    // Helpers para pruebas (opcional)
    addUser(u: User) { this.users.push(u); }
    addInstitution(i: ValidationInstitution) { this.institutions.push(i); }
    addCertificate(c: ValidationCertificate) { this.certificates.push(c); }
    addValidationInfo(i: ValidationInfo) { this.infos.push(i); }
}

/**
 * Servicio principal
 */
export class ValidationService {
    constructor(private repo: ValidationRepository) {}

    /**
     * Afiliar un usuario a una institución de validación.
     * - Verifica existencia de usuario e institución.
     * - Evita duplicados.
     */
    async affiliateToInstitution(userId: string, institutionId: string): Promise<{
        success: boolean;
        message: string;
        affiliation?: Affiliation;
    }> {
        const user = await this.repo.getUserById(userId);
        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        const institution = await this.repo.getInstitutionById(institutionId);
        if (!institution) {
            return { success: false, message: 'Institución de validación no encontrada' };
        }

        const existing = await this.repo.getAffiliation(userId, institutionId);
        if (existing) {
            return { success: false, message: 'Usuario ya afiliado a la institución', affiliation: existing };
        }

        const affiliation: Affiliation = {
            id: `${userId}-${institutionId}-${Date.now()}`,
            userId,
            institutionId,
            since: new Date().toISOString(),
            active: true,
        };

        await this.repo.createAffiliation(affiliation);

        return { success: true, message: 'Afiliación creada', affiliation };
    }

    /**
     * Obtener historial de certificados de validación de un usuario.
     */
    async getValidationCertificatesHistory(userId: string): Promise<ValidationCertificate[]> {
        // Si se requiere validar existencia del usuario, se puede descomentar:
        // const user = await this.repo.getUserById(userId);
        // if (!user) throw new Error('Usuario no encontrado');
        return this.repo.getCertificatesByUser(userId);
    }

    /**
     * Consultar información de validación por id (puede ser detalle de certificado u otra info).
     */
    async getValidationInfo(infoId: string): Promise<ValidationInfo | null> {
        return this.repo.getValidationInfoById(infoId);
    }
}
