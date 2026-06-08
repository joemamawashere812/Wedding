const SHEET_NAME = "RSVPs";

function doGet() {
  return ContentService
    .createTextOutput("Wedding RSVP endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(event) {
  const sheet = getSheet();
  const data = JSON.parse(event.postData.contents);

  sheet.appendRow([
    data.submittedAt,
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.address1,
    data.address2,
    data.city,
    data.state,
    data.zip,
    data.rsvpStatus,
    data.partySize,
    data.message
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted at",
      "First name",
      "Last name",
      "Email",
      "Phone",
      "Address 1",
      "Address 2",
      "City",
      "State",
      "ZIP",
      "RSVP",
      "Party size",
      "Message"
    ]);
  }

  return sheet;
}
