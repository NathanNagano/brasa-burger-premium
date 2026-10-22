/**
 * Painel de aprovação de produtos.
 *
 * Cole este arquivo em um projeto Apps Script vinculado à planilha criada para
 * receber o Google Form. Os valores secretos ficam em Script Properties.
 */

const PRODUCTS_SHEET = "Produtos";
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
  "Objeto WebP (staging)",
  "SHA-256 WebP",
  "Status",
  "Aprovado em",
  "Commit GitHub",
  "Erro",
];
const STATUS = {
  RECEIVED: "RECEBIDO",
  PROCESSING: "PROCESSANDO",
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
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  getProperties().setProperty("SHEET_ID", spreadsheet.getId());
  let sheet = spreadsheet.getSheetByName(PRODUCTS_SHEET);
  if (!sheet) sheet = spreadsheet.insertSheet(PRODUCTS_SHEET);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
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
  }

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.values(STATUS), true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, columnIndex("Status"), Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(rule);
  SpreadsheetApp.getUi().alert("Painel preparado. Configure as Script Properties antes de instalar os gatilhos.");
}

function installTriggers() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const handlers = new Set(["handleFormSubmit", "handleProductEdit"]);
  ScriptApp.getProjectTriggers()
    .filter((trigger) => handlers.has(trigger.getHandlerFunction()))
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger("handleFormSubmit").forSpreadsheet(spreadsheet).onFormSubmit().create();
  ScriptApp.newTrigger("handleProductEdit").forSpreadsheet(spreadsheet).onEdit().create();
  SpreadsheetApp.getUi().alert("Gatilhos instalados.");
}

function handleFormSubmit(event) {
  const sourceValues = event.namedValues || {};
  const now = new Date();
  const sheet = getProductsSheet();
  const name = requiredAnswer(sourceValues, FORM_FIELDS.name);
  const description = requiredAnswer(sourceValues, FORM_FIELDS.description);
  const category = requiredAnswer(sourceValues, FORM_FIELDS.category);
  const priceCents = parsePriceToCents(requiredAnswer(sourceValues, FORM_FIELDS.price));
  const photoAnswer = requiredAnswer(sourceValues, FORM_FIELDS.photo);
  const photoId = extractDriveFileId(photoAnswer);
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
    photoId,
    "",
    "",
    STATUS.PROCESSING,
    "",
    "",
    "",
  ];

  const rowNumber = sheet.getLastRow() + 1;
  sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues([row]);
  try {
    const conversion = convertImage(photoId, productId);
    sheet.getRange(rowNumber, columnIndex("Objeto WebP (staging)"), 1, 2).setValues([[conversion.objectName, conversion.sha256]]);
    sheet.getRange(rowNumber, columnIndex("Status")).setValue(STATUS.PENDING);
    // Campos complementares seguem ocultos na planilha, mas vão no dispatch.
    sheet.getRange(rowNumber, columnIndex("Erro")).setNote(JSON.stringify({ badge, featured }));
  } catch (error) {
    updateRow(rowNumber, { "Status": STATUS.ERROR, "Erro": errorMessage(error) });
    throw error;
  }
}

function handleProductEdit(event) {
  const range = event.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== PRODUCTS_SHEET || range.getRow() === 1 || range.getColumn() !== columnIndex("Status")) return;
  if (event.value !== STATUS.APPROVED || event.oldValue !== STATUS.PENDING) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(30_000);
  try {
    const row = readRow(range.getRow());
    if (row.Status !== STATUS.APPROVED) return;
    updateRow(range.getRow(), { "Status": STATUS.PUBLISHING, "Aprovado em": new Date(), "Erro": "" });
    dispatchPublication(range.getRow(), row);
  } catch (error) {
    updateRow(range.getRow(), { "Status": STATUS.ERROR, "Erro": errorMessage(error) });
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    if (!payload.secret || payload.secret !== getRequiredProperty("CALLBACK_SECRET")) throw new Error("callback não autorizado");
    const sheet = getProductsSheet();
    const productId = String(payload.productId || "");
    const idCell = sheet.getRange("A:A").createTextFinder(productId).matchEntireCell(true).findNext();
    if (!idCell) throw new Error("produto não encontrado");
    const status = payload.status === "success" ? STATUS.PUBLISHED : STATUS.ERROR;
    updateRow(idCell.getRow(), {
      "Status": status,
      "Commit GitHub": String(payload.commitSha || ""),
      "Erro": status === STATUS.ERROR ? "Workflow do GitHub falhou. Consulte a execução." : "",
    });
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: errorMessage(error) });
  }
}

function dispatchPublication(rowNumber, row) {
  const metadata = getRowMetadata(rowNumber);
  const signedUrl = createSignedDownloadUrl(row["Objeto WebP (staging)"]);
  const product = {
    id: row.ID,
    name: row.Nome,
    description: row.Descrição,
    priceCents: Number(row["Preço (centavos)"]),
    category: row.Categoria,
    badge: metadata.badge || undefined,
    featured: Boolean(metadata.featured),
    imageSha256: row["SHA-256 WebP"],
  };
  const owner = getRequiredProperty("GITHUB_OWNER");
  const repository = getRequiredProperty("GITHUB_REPOSITORY");
  const workflow = getRequiredProperty("GITHUB_WORKFLOW_FILE");
  const response = UrlFetchApp.fetch(`https://api.github.com/repos/${owner}/${repository}/actions/workflows/${workflow}/dispatches`, {
    method: "post",
    contentType: "application/json",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${getRequiredProperty("GITHUB_TOKEN")}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    payload: JSON.stringify({
      ref: "main",
      inputs: {
        product_id: row.ID,
        product_json: JSON.stringify(product),
        image_url: signedUrl,
      },
    }),
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() !== 204) {
    throw new Error(`GitHub recusou a publicação (${response.getResponseCode()}): ${response.getContentText()}`);
  }
}

function convertImage(driveFileId, productId) {
  const file = DriveApp.getFileById(driveFileId);
  const blob = file.getBlob();
  const response = UrlFetchApp.fetch(`${getRequiredProperty("CONVERTER_URL")}/convert`, {
    method: "post",
    contentType: blob.getContentType(),
    headers: {
      "X-Product-Id": productId,
      "X-Converter-Secret": getRequiredProperty("CONVERTER_SHARED_SECRET"),
    },
    payload: blob.getBytes(),
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() !== 200) throw new Error(`conversão falhou (${response.getResponseCode()}): ${response.getContentText()}`);
  return JSON.parse(response.getContentText());
}

function createSignedDownloadUrl(objectName) {
  const response = UrlFetchApp.fetch(`${getRequiredProperty("CONVERTER_URL")}/signed-download`, {
    method: "post",
    contentType: "application/json",
    headers: { "X-Converter-Secret": getRequiredProperty("CONVERTER_SHARED_SECRET") },
    payload: JSON.stringify({ objectName }),
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() !== 200) throw new Error(`URL temporária falhou (${response.getResponseCode()}): ${response.getContentText()}`);
  return JSON.parse(response.getContentText()).url;
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
  Object.entries(valuesByHeader).forEach(([header, value]) => sheet.getRange(rowNumber, columnIndex(header)).setValue(value));
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
  const slug = name
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
  const raw = String(value).trim().replace(/^R\$\s*/i, "").replace(/\s/g, "");
  const normalized = /^\d{1,7},\d{1,2}$/.test(raw)
    ? raw.replace(",", ".")
    : /^\d{1,7}\.\d{1,2}$/.test(raw)
      ? raw
      : /^\d{1,7}$/.test(raw)
        ? raw
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
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
