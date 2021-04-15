/**
 * Class that defines variables with default values.
 *
 * @abstract
 */
export abstract class Messages {

    public static readonly AUTH: any = {

    }

    public static readonly USERS: any = {
        DUPLICATED: 'Recurso duplicado',
        DUPLICATED_DESC: 'Já existe um usuário com este email cadastrado'
    }

    public static readonly GROUPS: any = {

    }    
    
    public static readonly QUESTIONNAIRES: any = {
        
    }
    
    public static readonly ANSWERS: any = {

    }    

    public static readonly QUESTIONS: any = {

    }        

    public static readonly ERROR_MESSAGE: any = {
        REQUIRED_FIELDS: 'Alguns campos não foram fornecidos.',
        REQUIRED_FIELDS_DESC: 'Os campos: [{0}] são obrigatórios!',
        INVALID_ID: 'Formato de ID inválido!',
        INVALID_ID_DESC: 'O ID deve ter 24 dígitos em hexadecimal!'
    }

}