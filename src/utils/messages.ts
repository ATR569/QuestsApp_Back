/**
 * Class that defines variables with default values.
 *
 * @abstract
 */
export abstract class Messages {

    public static readonly AUTH: any = {

    }

    public static readonly USERS: any = {

    }

    public static readonly GROUPS: any = {
        ADMIN_ID_NOT_PROVIDED: 'O id do administrador do grupo não foi fornecido!',
        ALREADY_REGISTERED: 'Já existe um grupo registrado com o nome fornecido: {{0}}.'
    }    
    
    public static readonly QUESTIONNAIRES: any = {
        
    }
    
    public static readonly ANSWERS: any = {

    }    

    public static readonly QUESTIONS: any = {

    }        

    public static readonly ERROR_MESSAGE: any = {
        INTERNAL_SERVER_ERROR: 'Erro interno do servidor!',
        REQUIRED_FIELDS: 'Alguns campos não foram fornecidos.',
        REQUIRED_FIELDS_DESC: 'Os campos: [{0}] são obrigatórios!',
        
        INVALID_ID: 'Formato de ID inválido!',
        INVALID_ID_DESC: 'O ID deve ter 24 dígitos em hexadecimal!',
        INVALID_FIELDS: 'Um ou mais campos são inválidos...'
    }

}