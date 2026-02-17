// -----------------------------------------------------------------------------
// ANUSHTAN - ROBUST ID GENERATION FOR GOOGLE FORMS
// -----------------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Open your Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste this code into the editor (replacing any old 'onFormSubmit' or ID logic).
// 4. Save the project.
// 5. If not already set up, add a Trigger:
//    - Function to run: onFormSubmit
//    - Event source: From spreadsheet
//    - Event type: On form submit
// -----------------------------------------------------------------------------

// CONFIGURATION
var SOR_SHEET_NAME = "Inquiries (SOR)";
var WORKING_SHEET_NAME = "Inquiries (Working)";
var ID_COLUMN_INDEX = 1; // Column A is 1

function onFormSubmit(e) {
    var lock = LockService.getScriptLock();
    try {
        lock.waitLock(30000); // Wait for other simultaneous submissions
    } catch (e) {
        Logger.log('Could not obtain lock. Handling concurrently.');
    }

    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = e.range.getSheet();
        var row = e.range.getRow();

        // Only run if the submission is on the SOR sheet
        if (sheet.getName() !== SOR_SHEET_NAME) return;

        // 1. GENERATE ROBUST ID (Max ID Strategy)
        var nextId = getNextInquiryId(ss);

        // 2. SET THE ID IN THE NEW ROW
        sheet.getRange(row, ID_COLUMN_INDEX).setValue(nextId);

        // 3. COPY TO WORKING SHEET (Optional, but recommended to keep in sync)
        // If you want the new inquiry to immediately appear in Working sheet:
        // copyToWorkingSheet(ss, e, nextId);

        // 4. TRIGGER N8N WEBHOOK (If your old script did this)
        // sendToN8n(e, nextId);

        Logger.log("Assigned ID: " + nextId + " to Row: " + row);

    } catch (error) {
        Logger.log("Error in onFormSubmit: " + error.toString());
    } finally {
        lock.releaseLock();
    }
}

function getNextInquiryId(ss) {
    // Always check WORKING sheet for the true Max ID (Source of Truth for IDs)
    var workingSheet = ss.getSheetByName(WORKING_SHEET_NAME);
    var lastRow = workingSheet.getLastRow();

    var maxId = 0;

    if (lastRow > 1) {
        // Get all IDs in Column A
        var data = workingSheet.getRange(2, 1, lastRow - 1, 1).getValues();

        for (var i = 0; i < data.length; i++) {
            var idStr = data[i][0];
            if (typeof idStr === 'string' && idStr.indexOf('S-') === 0) {
                // Extract number part
                var num = parseInt(idStr.replace('S-', ''), 10);
                if (!isNaN(num) && num > maxId) {
                    maxId = num;
                }
            }
        }
    }

    // Also check SOR sheet just in case newer ones are there but not moved yet
    var sorSheet = ss.getSheetByName(SOR_SHEET_NAME);
    var lastSorRow = sorSheet.getLastRow();
    if (lastSorRow > 1) {
        var sorData = sorSheet.getRange(2, 1, lastSorRow - 1, 1).getValues();
        for (var i = 0; i < sorData.length; i++) {
            var idStr = sorData[i][0];
            if (typeof idStr === 'string' && idStr.indexOf('S-') === 0) {
                var num = parseInt(idStr.replace('S-', ''), 10);
                if (!isNaN(num) && num > maxId) {
                    maxId = num;
                }
            }
        }
    }

    return "S-" + (maxId + 1);
}

// Optional: Helper to send data to n8n if your form relied on script trigger
function sendToN8n(e, id) {
    var url = "YOUR_N8N_WEBHOOK_URL_HERE";
    var payload = {
        "inquiry_id": id,
        "timestamp": new Date().toISOString(),
        "form_data": e.namedValues
    };

    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
    };

    UrlFetchApp.fetch(url, options);
}
