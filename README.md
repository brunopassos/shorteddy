- [X] CI
- [X] CRUD usuários
- [X] Autenticação
- [X] CRUD URL
- [] Validação
- [X] AuthGuard - get, update (atualiza apenas original_url) e delete (soft delete)
- [X] Endpoint que recebe uma url encurtada e redirecione o usuário para o url de origem e contabilize
- [X] URLOwner (url deve pertencer a um usuário quando ele estiver autenticado)
- [X] Atualizar a rota de encurtar URL para retornar o domínio
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
