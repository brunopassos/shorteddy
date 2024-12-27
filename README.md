- [X] CRUD usuários
- [] Autenticação
- [] CRUD URL
- [] Validação
- [] AuthGuard - get, update (atualiza apenas original_url) e delete (soft delete)
- [] Endpoint que recebe uma url encurtada e redirecione o usuário para o url de origem e contabilize
- [] URLOwner (url deve pertencer a um usuário quando ele estiver autenticado)
- [] Atualizar a rota de encurtar URL para retornar o domínio
- [] Criar uma rota para listar as urls pertencentes ao usuário
- [] Banco de dados
- [] Refatoração
- [] Testes
- [] Documentação


-----------

Users Entity
- email
- password
- urls

Urls Entity
- original_url - url original
- shortened_url - url encurtada
- click_cout - contabiliza os acessos
- created_at - quando foi criado
- updated_at - quando foi atualizado pela ultima vez
- deleted_at - quando foi deletado (soft delete)
