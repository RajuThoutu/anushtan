// -----------------------------------------------------------------------------
// ANUSHTAN - ROBUST ID GENERATION & N8N SYNC FOR GOOGLE FORMS
// -----------------------------------------------------------------------------
// INSTRUCTIONS:
// 1. Open your Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste this code into the editor (replacing any old code).
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
var N8N_WEBHOOK_URL = "https://api.anushtansiddipet.in/webhook/school-inquiry";

// FIELD MAPPING: Google Form Question Title -> n8n JSON Key
// Update the LEFT side if your Form Questions are named differently.
var FIELD_MAP = {
    "Student Name": "student_name",
    "Parent Name": "parent_name", // If you collect this
    "Phone Number": "phone",
    "Email": "email",
    "Class": "current_class", // or "Grade"
    "Message": "message",
    "Comments": "message"
};

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

        Logger.log("Assigned ID: " + nextId + " to Row: " + row);

        // 3. TRIGGER N8N WEBHOOK
        sendToN8n(e, nextId);

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

// Helper to send data to n8n
function sendToN8n(e, id) {
    // Construct payload mapping Form Fields to standardized keys
    var formData = {};
    var namedValues = e.namedValues;

    // Default mapping
    Object.keys(FIELD_MAP).forEach(function (formField) {
        // Check keys case-insensitively just in case
        var actualKey = findKeyCaseInsensitive(namedValues, formField);
        if (actualKey) {
            formData[FIELD_MAP[formField]] = namedValues[actualKey][0];
        }
    });

    // Fallback: If no mapping found for crucial fields, try direct key usage
    if (!formData['student_name'] && namedValues['Student Name']) formData['student_name'] = namedValues['Student Name'][0];
    if (!formData['phone'] && namedValues['Phone Number']) formData['phone'] = namedValues['Phone Number'][0];
    if (!formData['phone'] && namedValues['Phone']) formData['phone'] = namedValues['Phone'][0];

    // Final Payload Structure matching what Website sends
    var payload = {
        "inquiry_id": id,
        "source": "Google Form",
        "timestamp": new Date().toISOString(),
        // Merge mapped fields
        "student_name": formData['student_name'] || "Unknown Student",
        "parent_name": formData['parent_name'] || "Not Provided",
        "email": formData['email'] || "",
        "phone": formData['phone'] || "",
        "current_class": formData['current_class'] || "",
        "message": formData['message'] || "",
        // Allow access to raw form data if needed by n8n debug
        "raw_form_data": namedValues
    };

    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
    };

    try {
        UrlFetchApp.fetch(N8N_WEBHOOK_URL, options);
        Logger.log("Sent to n8n: " + JSON.stringify(payload));
    } catch (err) {
        Logger.log("Failed to send to n8n: " + err.toString());
    }
}

function findKeyCaseInsensitive(obj, key) {
    var lowerKey = key.toLowerCase();
    for (var k in obj) {
        if (k.toLowerCase() === lowerKey) return k;
    }
    return null;
}
