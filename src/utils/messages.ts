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
        DUPLICATED_DESC: 'Já existe um usuário com este email cadastrado',

        PASSWORD_NOT_REQUIRED: 'Rota para atualização de senha inválida.',
        PASSWORD_NOT_REQUIRED_DESC: 'A senha deve ser atualizada pela rota: /users/password',

        ALL_MISSING_FIELDS: 'Nenhum campo fornecido.',
        ALL_MISSING_FIELDS_DESC: 'Pelo menos um desses campos: [{0}] deve ser fornecido para atualização',

        OLD_PASSWORD_NOT_MATCH: 'Senhas não conferem.',
        OLD_PASSWORD_NOT_MATCH_DESC: 'O campo: [old_password] não coincide com a senha atual do usuário.',
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
        INVALID_ID_DESC: 'O ID deve ter 24 dígitos em hexadecimal!',
        MSG_NOT_FOUND: 'Recurso não encontrado',
        DESC_NOT_FOUND: 'Não existe {recurso} de id {id}',
    }

}