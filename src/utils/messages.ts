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
        ALL_MISSING_FIELDS_DESC: 'Pelo menos um desses campos: { name, email, institution } deve ser fornecido para atualização',

        OLD_PASSWORD_NOT_MATCH: 'Senhas não conferem.',
        OLD_PASSWORD_NOT_MATCH_DESC: 'O campo: { old_password } não coincide com a senha atual do usuário.',
    }

    public static readonly GROUPS: any = {
        ADMIN_ID_NOT_PROVIDED: 'O id do administrador do grupo não foi fornecido!',
        ADMIN_ID_NOT_REGISTERED: 'O id fornecido para o administrador do grupo não está registrado no sistema!',
        INVALID_ADMINISTRATOR_ID: 'O id do administrador não é válido.',
        ALREADY_REGISTERED: 'Já existe um grupo registrado com o nome fornecido: { {0} }.',
        FIELD_CANT_UPDATED: 'O campo { {0} } não pode ser atualizado.'
    }

    public static readonly QUESTIONNAIRES: any = {
        ALREADY_REGISTERED: 'Já existe um questionário registrado com a disciplina: { {0} }.',
        ALREADY_REGISTERED_QUESTION: 'Já existe um questão registrada para o questionário { {0} } com a descrição: { {1} }.'
    }

    public static readonly ANSWERS: any = {

    }

    public static readonly QUESTIONS: any = {

        CREATOR_ID_NOT_PROVIDED: 'O id do criador da questão não foi fornecido!',
        CREATOR_ID_NOT_REGISTERED: 'O id fornecido para o criador da questão não está registrado no sistema!',
        ALREADY_REGISTERED: 'Já existe uma questão registrada com a descrição fornecida: { {0} }.'

    }

    public static readonly ERROR_MESSAGE: any = {
        INTERNAL_SERVER_ERROR: 'Erro interno do servidor!',
        REQUIRED_FIELDS: 'Alguns campos não foram fornecidos.',
        REQUIRED_FIELDS_DESC: 'Os campos: { {0} } são obrigatórios!',

        INVALID_ID: 'Formato de ID inválido!',
        INVALID_ID_DESC: 'O ID deve ter 24 dígitos em hexadecimal!',
        INVALID_FIELDS: 'Um ou mais campos são inválidos...',
        INVALID_FIELDS_DESC: 'Os campos: { {0} } são vazios ou inválidos!',
        MSG_NOT_FOUND: 'Recurso não encontrado',
        DESC_NOT_FOUND: 'Não existe { {0} } de id { {1} }',
        EMPTY_STRING: 'O campo { {0} } deve ter pelo menos um caracter.',
    }

}