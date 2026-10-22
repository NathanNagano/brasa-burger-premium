# Automação de cadastro de produtos

Este diretório contém todas as peças do fluxo abaixo. A planilha é o painel de aprovação, não o armazenamento da imagem.

```text
Google Form → Google Drive → Apps Script → Cloud Run/GCS → planilha
                                                     ↓ aprovação
                                         GitHub Actions → site
```

## O que já está configurado no repositório

- `src/data/automated-products.json` é o catálogo administrado pela automação.
- `public/assets/products/` recebe os WebPs aprovados.
- `.github/workflows/publish-product.yml` valida a imagem e o JSON, testa o site e faz um único commit em `main`.
- `apps-script/Code.gs` recebe respostas, converte a imagem, exibe a aprovação e dispara o GitHub Actions.
- `cloud-run-converter/` é o serviço que converte JPEG/PNG/WebP em WebP, sem tornar o staging público.

Os produtos que já existem em `src/data/products.ts` continuam intactos. Os novos são acrescentados ao final do cardápio.

## 1. Google Form e planilha

1. Crie um Form do Google com estes nomes de pergunta **exatos**:
   - `Nome do produto` — resposta curta, obrigatório.
   - `Descrição` — parágrafo, obrigatório.
   - `Preço` — resposta curta, obrigatório, no formato `29,90`.
   - `Categoria` — lista: `hamburgueres`, `combos`, `acompanhamentos`, `bebidas`, `milkshakes`.
   - `Foto` — upload de arquivo, obrigatório, apenas imagens, uma foto e limite de 10 MB.
   - `Selo` — resposta curta, opcional.
   - `Destaque` — lista `Sim`/`Não`, opcional.
2. Na aba **Respostas** do formulário, escolha **Vincular ao Planilhas Google** e crie uma planilha nova.
3. Abra a planilha, entre em **Extensões → Apps Script**, substitua o conteúdo por `apps-script/Code.gs` e confirme que o fuso é `America/Sao_Paulo` no arquivo de manifesto.
4. Salve o projeto, volte à planilha e recarregue-a. No menu `Cadastro de produtos`, escolha **Preparar painel**. Isto cria a aba `Produtos` e suas validações de status.

O upload do Forms exige que quem envia esteja conectado a uma conta Google. Se o cadastro precisar aceitar fornecedores sem conta Google, substitua somente a origem por uma pequena página de upload; o restante deste fluxo permanece igual.

## 2. Cloud Run e bucket de staging

Crie ou escolha um projeto Google Cloud com cobrança habilitada. Abaixo, substitua os valores em maiúsculas antes de executar os comandos em um terminal local autenticado no `gcloud`.

```bash
gcloud config set project SEU_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com storage.googleapis.com iamcredentials.googleapis.com secretmanager.googleapis.com
gcloud storage buckets create gs://SEU_BUCKET_UNICO --location=southamerica-east1 --uniform-bucket-level-access
gcloud iam service-accounts create brasa-product-converter --display-name="Brasa product converter"
gcloud storage buckets add-iam-policy-binding gs://SEU_BUCKET_UNICO --member="serviceAccount:brasa-product-converter@SEU_PROJECT_ID.iam.gserviceaccount.com" --role="roles/storage.objectAdmin"
gcloud iam service-accounts add-iam-policy-binding brasa-product-converter@SEU_PROJECT_ID.iam.gserviceaccount.com --member="serviceAccount:brasa-product-converter@SEU_PROJECT_ID.iam.gserviceaccount.com" --role="roles/iam.serviceAccountTokenCreator"
```

Gere um segredo aleatório com pelo menos 32 caracteres e guarde-o. Crie então o segredo no Google Cloud:

```bash
gcloud secrets create converter-shared-secret --replication-policy=automatic
printf '%s' 'SEU_SEGREDO_ALEATORIO' | gcloud secrets versions add converter-shared-secret --data-file=-
gcloud secrets add-iam-policy-binding converter-shared-secret --member="serviceAccount:brasa-product-converter@SEU_PROJECT_ID.iam.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"
```

Na raiz do repositório, faça o deploy:

```bash
gcloud run deploy brasa-product-converter \
  --source automation/cloud-run-converter \
  --region southamerica-east1 \
  --service-account brasa-product-converter@SEU_PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars STAGING_BUCKET=SEU_BUCKET_UNICO \
  --set-secrets CONVERTER_SHARED_SECRET=converter-shared-secret:latest \
  --allow-unauthenticated
```

`--allow-unauthenticated` é necessário para que o Apps Script acesse a URL, mas o serviço rejeita qualquer pedido sem o segredo. O bucket continua privado e só entrega arquivos por URL assinada, válida por 15 minutos.

## 3. Configurar Apps Script

No editor do Apps Script, abra **Configurações do projeto → Propriedades de script** e adicione:

| Nome | Valor |
| --- | --- |
| `CONVERTER_URL` | URL retornada pelo Cloud Run, sem barra final |
| `CONVERTER_SHARED_SECRET` | o mesmo segredo enviado ao Secret Manager |
| `GITHUB_OWNER` | `NathanNagano` |
| `GITHUB_REPOSITORY` | `brasa-burger-premium` |
| `GITHUB_WORKFLOW_FILE` | `publish-product.yml` |
| `GITHUB_TOKEN` | token granular com acesso só a este repositório e permissão `Actions: write` |
| `CALLBACK_SECRET` | outro segredo aleatório, diferente do anterior |
| `SHEET_ID` | criado automaticamente pelo botão **Preparar painel** |

Depois, na planilha, escolha `Cadastro de produtos → Instalar gatilhos` e aceite as autorizações solicitadas. Os dois gatilhos são criados no dono da planilha; não remova-os no editor do Apps Script.

## 4. Retorno do GitHub para a planilha

No Apps Script, escolha **Implantar → Nova implantação → App da Web**. Configure para executar como você e permita acesso para qualquer pessoa com o link. Copie a URL `/exec` gerada.

No repositório GitHub, vá a **Settings → Secrets and variables → Actions** e crie:

| Segredo | Valor |
| --- | --- |
| `PRODUCT_SHEETS_CALLBACK_URL` | URL `/exec` da implantação do Apps Script |
| `PRODUCT_SHEETS_CALLBACK_SECRET` | o valor de `CALLBACK_SECRET` |

O callback não expõe dados do produto e ainda exige esse segredo. Ele altera a linha de `PUBLICANDO` para `PUBLICADO` apenas depois de commit, teste e build bem-sucedidos. Em caso de erro, registra `ERRO`.

## 5. Teste de ponta a ponta

1. Envie um produto de teste pelo formulário.
2. Espere a linha ficar `PENDENTE_APROVACAO` e confira a foto, descrição e preço.
3. Altere apenas o status para `APROVADO`.
4. Confira a execução **Publicar produto aprovado** no GitHub.
5. A linha precisa voltar como `PUBLICADO`, com o hash do commit.
6. Confirme no repositório a presença de `public/assets/products/<id>.webp` e do item em `src/data/automated-products.json`.

Para testar uma falha sem publicar, envie uma foto maior que o limite. A linha deve ficar `ERRO`; corrija os dados e reenviar é mais seguro do que editar uma resposta antiga.

## Segurança e manutenção

- Nunca ponha tokens, URLs assinadas ou segredos em células ou no Git.
- Mantenha o arquivo original no Drive como backup. O WebP de staging pode ser removido por uma rotina de limpeza após 30 dias.
- A Action processa uma publicação por vez para não haver conflitos no JSON compartilhado.
- Renovar o token granular do GitHub antes de expirar é necessário; uma GitHub App pode substituir o token no futuro se houver mais operadores.
