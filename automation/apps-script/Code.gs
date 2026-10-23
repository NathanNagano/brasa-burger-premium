/**
 * Painel de aprovação de produtos.
 *
 * Cole este arquivo em um projeto Apps Script vinculado à planilha das
 * respostas do Google Form. Os segredos ficam em Script Properties.
 */

const PRODUCTS_SHEET = "Produtos";
const SPREADSHEET_ID = "17WNb5F79AVI2wbfALRmXYkTgpiYo3T23NYoZRF9yRDc";
const FORM_FIELDS = {
  name: "Nome do produto",
  description: "Descrição",
  price: "Preço",
  category: "Categoria",
  photo: "Foto",
  badge: "Selo",
  featured: "Destaque",
};
const HEADERS = [
  "ID",
  "Criado em",
  "Nome",
  "Descrição",
  "Preço (centavos)",
  "Categoria",
  "Foto original (Drive)",
  "Arquivo no staging GitHub",
  "SHA staging GitHub",
  "Status",
  "Aprovado em",
  "Commit GitHub",
  "Erro",
];
const STATUS = {
  PENDING: "PENDENTE_APROVACAO",
  APPROVED: "APROVADO",
  PUBLISHING: "PUBLICANDO",
  PUBLISHED: "PUBLICADO",
  REJECTED: "REJEITADO",
  ERROR: "ERRO",
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Cadastro de produtos")
    .addItem("Preparar painel", "setupWorkbook")
    .addItem("Instalar gatilhos", "installTriggers")
    .addToUi();
}

function setupWorkbook() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  getProperties().setProperty("SHEET_ID", spreadsheet.getId());
  let sheet = spreadsheet.getSheetByName(PRODUCTS_SHEET);
  if (!sheet) sheet = spreadsheet.insertSheet(PRODUCTS_SHEET);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setBackground("#7f1d1d")
      .setFontColor("#ffffff")
      .setFontWeight("bold");
    sheet.getRange("E:E").setNumberFormat("0");
    sheet.getRange("B:B").setNumberFormat("dd/MM/yyyy HH:mm");
    sheet.getRange("K:K").setNumberFormat("dd/MM/yyyy HH:mm");
    sheet.autoResizeColumns(1, HEADERS.length);
    sheet.setColumnWidth(4, 360);
    sheet.setColumnWidth(7, 260);
    sheet.setColumnWidth(8, 260);
    sheet.setColumnWidth(13, 360);
  } else {
    const existingHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
    if (existingHeaders.join("|") !== HEADERS.join("|")) {
      throw new Error(
        "A aba Produtos já existe com outro formato. Crie uma planilha nova para esta automação.",
      );
    }
  }

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.values(STATUS), true)
    .setAllowInvalid(false)
    .build();
  sheet
    .getRange(2, columnIndex("Status"), Math.max(sheet.getMaxRows() - 1, 1), 1)
    .setDataValidation(rule);
  console.log("Painel preparado. Configure as Script Properties antes de instalar os gatilhos.");
}

function installTriggers() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const handlers = new Set(["handleFormSubmit", "handleProductEdit"]);
  ScriptApp.getProjectTriggers()
    .filter((trigger) => handlers.has(trigger.getHandlerFunction()))
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger("handleFormSubmit").forSpreadsheet(spreadsheet).onFormSubmit().create();
  ScriptApp.newTrigger("handleProductEdit").forSpreadsheet(spreadsheet).onEdit().create();
  console.log("Gatilhos instalados.");
}

function handleFormSubmit(event) {
  const sourceValues = event.namedValues || {};
  const now = new Date();
  const sheet = getProductsSheet();
  const name = requiredAnswer(sourceValues, FORM_FIELDS.name);
  const description = requiredAnswer(sourceValues, FORM_FIELDS.description);
  const category = requiredAnswer(sourceValues, FORM_FIELDS.category);
  const priceCents = parsePriceToCents(requiredAnswer(sourceValues, FORM_FIELDS.price));
  const photoId = extractDriveFileId(requiredAnswer(sourceValues, FORM_FIELDS.photo));
  const productId = createProductId(name);
  const badge = optionalAnswer(sourceValues, FORM_FIELDS.badge);
  const featured = optionalAnswer(sourceValues, FORM_FIELDS.featured).toLowerCase() === "sim";
  const row = [
    productId,
    now,
    name,
    description,
    priceCents,
    category,
    `https://drive.google.com/open?id=${photoId}`,
    "",
    "",
    STATUS.PENDING,
    "",
    "",
    "",
  ];

  const rowNumber = sheet.getLastRow() + 1;
  sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues([row]);
  sheet.getRange(rowNumber, columnIndex("Erro")).setNote(JSON.stringify({ badge, featured }));
}

function handleProductEdit(event) {
  const range = event.range;
  const sheet = range.getSheet();
  if (
    sheet.getName() !== PRODUCTS_SHEET ||
    range.getRow() === 1 ||
    range.getColumn() !== columnIndex("Status")
  )
    return;
  if (event.value !== STATUS.APPROVED || event.oldValue !== STATUS.PENDING) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(30_000);
  try {
    const row = readRow(range.getRow());
    if (row.Status !== STATUS.APPROVED) return;
    updateRow(range.getRow(), { Status: STATUS.PUBLISHING, "Aprovado em": new Date(), Erro: "" });
    dispatchPublication(range.getRow(), row);
  } catch (error) {
    updateRow(range.getRow(), { Status: STATUS.ERROR, Erro: errorMessage(error) });
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    if (!payload.secret || payload.secret !== getRequiredProperty("CALLBACK_SECRET"))
      throw new Error("callback não autorizado");
    const sheet = getProductsSheet();
    const productId = String(payload.productId || "");
    const idCell = sheet
      .getRange("A:A")
      .createTextFinder(productId)
      .matchEntireCell(true)
      .findNext();
    if (!idCell) throw new Error("produto não encontrado");
    const status = payload.status === "success" ? STATUS.PUBLISHED : STATUS.ERROR;
    updateRow(idCell.getRow(), {
      Status: status,
      "Commit GitHub": String(payload.commitSha || ""),
      Erro: status === STATUS.ERROR ? "Workflow do GitHub falhou. Consulte a execução." : "",
    });
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: errorMessage(error) });
  }
}

function dispatchPublication(rowNumber, row) {
  const metadata = getRowMetadata(rowNumber);
  const staging = uploadImageToStaging(extractDriveFileId(row["Foto original (Drive)"]), row.ID);
  updateRow(rowNumber, {
    "Arquivo no staging GitHub": staging.path,
    "SHA staging GitHub": staging.sha,
  });

  const product = {
    id: row.ID,
    name: row.Nome,
    description: row.Descrição,
    priceCents: Number(row["Preço (centavos)"]),
    category: row.Categoria,
    badge: metadata.badge || undefined,
    featured: Boolean(metadata.featured),
  };
  const response = UrlFetchApp.fetch(workflowDispatchUrl(), {
    method: "post",
    contentType: "application/json",
    headers: githubHeaders(getRequiredProperty("GITHUB_WORKFLOW_TOKEN")),
    payload: JSON.stringify({
      ref: "main",
      inputs: {
        product_id: row.ID,
        product_json: JSON.stringify(product),
        staging_path: staging.path,
        staging_sha: staging.sha,
      },
    }),
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() !== 204) {
    throw new Error(
      `GitHub recusou a publicação (${response.getResponseCode()}): ${response.getContentText()}`,
    );
  }
}

function uploadImageToStaging(driveFileId, productId) {
  const file = DriveApp.getFileById(driveFileId);
  if (file.getSize() < 1 || file.getSize() > 10 * 1024 * 1024) {
    throw new Error("a foto original precisa ter entre 1 byte e 10 MB");
  }
  const blob = file.getBlob();
  const extension = extensionForImage(blob.getContentType());
  const path = `incoming/${productId}.${extension}`;
  const owner = getRequiredProperty("GITHUB_OWNER");
  const repository = getRequiredProperty("GITHUB_STAGING_REPOSITORY");
  const response = UrlFetchApp.fetch(
    `https://api.github.com/repos/${owner}/${repository}/contents/${path}`,
    {
      method: "put",
      contentType: "application/json",
      headers: githubHeaders(getRequiredProperty("GITHUB_STAGING_TOKEN")),
      payload: JSON.stringify({
        message: `chore(staging): receive ${productId}`,
        content: Utilities.base64Encode(blob.getBytes()),
        branch: "main",
      }),
      muteHttpExceptions: true,
    },
  );
  if (![200, 201].includes(response.getResponseCode())) {
    throw new Error(
      `GitHub recusou a foto (${response.getResponseCode()}): ${response.getContentText()}`,
    );
  }
  const content = JSON.parse(response.getContentText()).content;
  if (!content || !content.sha) throw new Error("GitHub não retornou o SHA do arquivo de staging");
  return { path, sha: content.sha };
}

function workflowDispatchUrl() {
  const owner = getRequiredProperty("GITHUB_OWNER");
  const repository = getRequiredProperty("GITHUB_REPOSITORY");
  const workflow = getRequiredProperty("GITHUB_WORKFLOW_FILE");
  return `https://api.github.com/repos/${owner}/${repository}/actions/workflows/${workflow}/dispatches`;
}

function githubHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function extensionForImage(contentType) {
  const extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const extension = extensions[String(contentType).toLowerCase()];
  if (!extension) throw new Error("a foto deve ser JPEG, PNG ou WebP");
  return extension;
}

function getProductsSheet() {
  const spreadsheet = SpreadsheetApp.openById(getRequiredProperty("SHEET_ID"));
  const sheet = spreadsheet.getSheetByName(PRODUCTS_SHEET);
  if (!sheet) throw new Error(`aba ${PRODUCTS_SHEET} não encontrada`);
  return sheet;
}

function readRow(rowNumber) {
  const values = getProductsSheet().getRange(rowNumber, 1, 1, HEADERS.length).getValues()[0];
  return Object.fromEntries(HEADERS.map((header, index) => [header, values[index]]));
}

function updateRow(rowNumber, valuesByHeader) {
  const sheet = getProductsSheet();
  Object.entries(valuesByHeader).forEach(([header, value]) =>
    sheet.getRange(rowNumber, columnIndex(header)).setValue(value),
  );
}

function getRowMetadata(rowNumber) {
  const note = getProductsSheet().getRange(rowNumber, columnIndex("Erro")).getNote();
  if (!note) return {};
  try {
    return JSON.parse(note);
  } catch (_) {
    return {};
  }
}

function columnIndex(header) {
  const index = HEADERS.indexOf(header);
  if (index < 0) throw new Error(`coluna ${header} não existe`);
  return index + 1;
}

function createProductId(name) {
  const slug =
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 55) || "produto";
  return `${slug}-${Utilities.getUuid().slice(0, 8)}`;
}

function extractDriveFileId(value) {
  const match = String(value).match(/[-\w]{25,}/);
  if (!match) throw new Error("não foi possível identificar o arquivo enviado ao Drive");
  return match[0];
}

function parsePriceToCents(value) {
  const raw = String(value)
    .trim()
    .replace(/^R\$\s*/i, "")
    .replace(/\s/g, "");
  // A resposta numérica do Google Forms pode ser normalizada como "19,9",
  // "19.9" ou "19,90" conforme o navegador e o idioma do respondente.
  const normalized = /^\d{1,7}([,.]\d{1,2})?$/.test(raw)
    ? raw.replace(",", ".")
    : null;
  if (!normalized) throw new Error("preço deve usar o formato 29,90");
  const cents = Math.round(Number(normalized) * 100);
  if (!Number.isSafeInteger(cents) || cents < 1) throw new Error("preço deve ser maior que zero");
  return cents;
}

function requiredAnswer(values, field) {
  const answer = optionalAnswer(values, field);
  if (!answer) throw new Error(`campo obrigatório ausente: ${field}`);
  return answer;
}

function optionalAnswer(values, field) {
  const answer = values[field];
  return Array.isArray(answer) && answer[0] ? String(answer[0]).trim() : "";
}

function getProperties() {
  return PropertiesService.getScriptProperties();
}

function getRequiredProperty(name) {
  const value = getProperties().getProperty(name);
  if (!value) throw new Error(`Script Property ausente: ${name}`);
  return value;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
