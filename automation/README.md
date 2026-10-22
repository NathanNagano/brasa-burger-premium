# Automação de cadastro de produtos

Esta é a versão sem Google Cloud, bucket ou cartão. A foto chega pelo Google
Form, permanece no Drive até a aprovação e só então é copiada por pouco tempo
para um repositório **privado** de staging. Uma GitHub Action converte a foto
para WebP, testa o site e publica o WebP e o JSON no repositório do site.

```text
Google Form → Drive → Sheets (aprovação) → GitHub privado temporário
                                                ↓
                                  GitHub Actions → WebP + JSON → site
                                                ↓
                                      retorno de status à planilha
```

## O que fica no repositório do site

- `src/data/automated-products.json` é o catálogo administrado pela automação.
- `public/assets/products/` recebe somente as imagens WebP aprovadas.
- `.github/workflows/publish-product.yml` baixa a original do staging privado,
  converte, valida, testa, publica e tenta remover a cópia temporária.
- `github-publisher/` contém o conversor local baseado em `sharp`.
- `apps-script/Code.gs` cria o painel de aprovação e conversa com as APIs do
  GitHub.

Os produtos existentes em `src/data/products.ts` continuam intactos. Os novos
itens são acrescentados ao final do cardápio.

## 1. Criar o repositório privado de staging

Crie um repositório privado vazio na mesma conta do repositório do site, com o
nome `brasa-product-staging`. Inicialize-o com um `README`, para que o branch
`main` exista. Ele recebe arquivos em `incoming/` e não precisa de código.

Nunca torne esse repositório público: a Action apaga o arquivo atual depois de
uma publicação bem-sucedida, mas o Git mantém versões anteriores no histórico.
Por isso, fotos de produto comuns são adequadas; arquivos sensíveis não são.

## 2. Criar o Google Form e a planilha

1. Crie um Form do Google com estes nomes de pergunta **exatos**:
   - `Nome do produto` — resposta curta, obrigatório.
   - `Descrição` — parágrafo, obrigatório.
   - `Preço` — resposta curta, obrigatório, por exemplo `29,90`.
   - `Categoria` — lista: `hamburgueres`, `combos`, `acompanhamentos`,
     `bebidas`, `milkshakes`.
   - `Foto` — upload de arquivo, obrigatório, uma imagem JPEG, PNG ou WebP,
     com no máximo 10 MB.
   - `Selo` — resposta curta, opcional.
   - `Destaque` — lista `Sim`/`Não`, opcional.
2. Em **Respostas**, escolha **Vincular ao Planilhas Google** e crie uma nova
   planilha.
3. Na planilha, abra **Extensões → Apps Script**, substitua o conteúdo pelo
   arquivo `apps-script/Code.gs` e confirme o fuso `America/Sao_Paulo` no
   manifesto `appsscript.json`.
4. Salve, recarregue a planilha e escolha **Cadastro de produtos → Preparar
   painel**. Isso cria a aba `Produtos`, que é a única aba que deve ser usada
   para aprovar publicações.

O upload de arquivos no Forms requer uma conta Google do remetente. Isso é uma
restrição do Google Forms, e não há custo extra para usá-lo dentro das cotas
gratuitas da conta.

## 3. Criar os dois tokens do GitHub

Use tokens de acesso pessoal de granularidade fina, com expiração curta. Crie
dois tokens separados no GitHub:

| Uso                                              | Acesso ao repositório           | Permissão mínima           |
| ------------------------------------------------ | ------------------------------- | -------------------------- |
| `GITHUB_WORKFLOW_TOKEN`                          | somente `brasa-burger-premium`  | `Actions: Read and write`  |
| `GITHUB_STAGING_TOKEN` / `PRODUCT_STAGING_TOKEN` | somente `brasa-product-staging` | `Contents: Read and write` |

O segundo é o mesmo valor em dois locais: uma Script Property, para o Apps
Script enviar a foto, e um GitHub Actions secret, para a Action baixar e apagar
a cópia. Não use um token com acesso a todos os repositórios.

## 4. Configurar Apps Script

No editor Apps Script, abra **Configurações do projeto → Propriedades de
script** e adicione:

| Nome                        | Valor                                          |
| --------------------------- | ---------------------------------------------- |
| `GITHUB_OWNER`              | `NathanNagano`                                 |
| `GITHUB_REPOSITORY`         | `brasa-burger-premium`                         |
| `GITHUB_WORKFLOW_FILE`      | `publish-product.yml`                          |
| `GITHUB_WORKFLOW_TOKEN`     | primeiro token da tabela acima                 |
| `GITHUB_STAGING_REPOSITORY` | `brasa-product-staging`                        |
| `GITHUB_STAGING_TOKEN`      | segundo token da tabela acima                  |
| `CALLBACK_SECRET`           | texto aleatório com pelo menos 32 caracteres   |
| `SHEET_ID`                  | criado automaticamente por **Preparar painel** |

Volte à planilha, escolha **Cadastro de produtos → Instalar gatilhos** e aceite
as autorizações. Os gatilhos são instalados no dono da planilha; não os remova
no editor Apps Script.

## 5. Retorno da Action para a planilha

No Apps Script, use **Implantar → Nova implantação → App da Web**. Configure:

- Executar como: você.
- Quem tem acesso: qualquer pessoa com o link.

Copie a URL terminada em `/exec`. No repositório `brasa-burger-premium`, abra
**Settings → Secrets and variables → Actions** e crie estes segredos:

| Segredo                          | Valor                                  |
| -------------------------------- | -------------------------------------- |
| `PRODUCT_STAGING_REPOSITORY`     | `NathanNagano/brasa-product-staging`   |
| `PRODUCT_STAGING_TOKEN`          | segundo token da tabela acima          |
| `PRODUCT_SHEETS_CALLBACK_URL`    | URL `/exec` da implantação Apps Script |
| `PRODUCT_SHEETS_CALLBACK_SECRET` | mesmo valor de `CALLBACK_SECRET`       |

O callback só atualiza uma linha quando recebe o segredo correto. Se teste,
build ou publicação falhar, a linha vira `ERRO`; a foto no staging é mantida
para investigação e uma nova aprovação pode ser feita depois da correção.

## 6. Testar o fluxo

1. Envie um produto de teste pelo formulário.
2. Aguarde a linha aparecer como `PENDENTE_APROVACAO` e confira foto, preço e
   descrição.
3. Altere apenas a célula de status para `APROVADO`.
4. Acompanhe a execução **Publicar produto aprovado** na aba Actions do GitHub.
5. A linha deve voltar como `PUBLICADO`, contendo o hash do commit.
6. Confirme `public/assets/products/<id>.webp` e o novo item em
   `src/data/automated-products.json`.

Para publicar um item que falhou, corrija o problema, mude o status de `ERRO`
para `PENDENTE_APROVACAO` e depois para `APROVADO`.

## Custos e limites

Não há serviço Google Cloud nem armazenamento com cobrança configurado. O
Google Drive e Apps Script usam as cotas gratuitas da conta Google, incluindo
o espaço compartilhado de 15 GB do Drive. Como este repositório do site é
público, os runners padrão do GitHub Actions não consomem minutos faturáveis.
Se ele for tornado privado, passam a valer os minutos incluídos no plano GitHub.

Os limites operacionais desta configuração são intencionais: original até
10 MB, WebP final até 5 MB, imagem de até 40 milhões de pixels e uma publicação
por vez. Assim o fluxo se mantém dentro das cotas e evita disputas na edição do
catálogo JSON.
