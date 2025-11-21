import { ValidationCertificateRepositoryPostgres } from '../../Persistence/Repos/validationRepository';


export class ValidationService {

    validationCertificateRepo = new ValidationCertificateRepositoryPostgres();
    async getCertificateInfo(user_id: string): Promise<string> {
        // Este metodo puede ser modificado para que devuelva unicamente la informacion relevante
        return this.validationCertificateRepo.getValidationInfoById(user_id);
    }
    
    async affiliateToInstitution(user_id: string, institution_id: string): Promise<string> {
        await this.validationCertificateRepo.affiliateToInstitution(user_id, institution_id);
        return "Usuario afiliado a la institución con éxito";
    }
    
    async requestValidationCertificate(user_id: string, institution_id: string): Promise<string> {
        // La institucion se pone en contacto con el usuario para acordar una cita de validacion
        return 'Cita de validación solicitada con éxito';
    }
    
}
