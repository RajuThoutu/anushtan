/**
 * Google Apps Script for Anushtan Inquiry Management
 * 
 * This script automatically:
 * 1. Generates unique inquiry IDs (S-1, S-2, etc.)
 * 2. Syncs new inquiries from SOR sheet to Working sheet
 * 3. Maintains data integrity between sheets
 * 
 * Installation:
 * 1. Open your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Copy this entire file
 * 4. Run installTrigger() once to set up automatic triggers
 * 5. Run syncSORToWorking() once to populate Working sheet
 */

/**
 * Trigger: On form submit
 * Purpose: Generate unique inquiry ID and copy to Working sheet
 * 
 * How it works:
 * 1. Google Forms writes data to "Inquiries (SOR)" automatically
 * 2. This script adds the Inquiry ID to that new row
 * 3. Then copies the complete row to "Inquiries (Working)"
 */
function onFormSubmit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sorSheet = ss.getSheetByName('Inquiries (SOR)');
  const workingSheet = ss.getSheetByName('Inquiries (Working)');
  
  if (!sorSheet || !workingSheet) {
    Logger.log('ERROR: Required sheets not found');
    return;
  }
  
  // Google Forms has already written to the last row of SOR sheet
  const lastRow = sorSheet.getLastRow();
  
  // Generate unique ID
  const inquiryId = 'S-' + (lastRow - 1); // Subtract 1 because row 1 is header
  
  // Set the ID in column A of the new row in SOR sheet
  sorSheet.getRange(lastRow, 1).setValue(inquiryId);
  
  // Get the complete row data from SOR (now with ID)
  const sorHeaders = sorSheet.getRange(1, 1, 1, sorSheet.getLastColumn()).getValues()[0];
  const sorRowData = sorSheet.getRange(lastRow, 1, 1, sorSheet.getLastColumn()).getValues()[0];
  
  // Get Working sheet headers
  const workingHeaders = workingSheet.getRange(1, 1, 1, workingSheet.getLastColumn()).getValues()[0];
  
  // Build column mapping: SOR column index → Working column index
  const columnMapping = {};
  sorHeaders.forEach((header, sorIndex) => {
    const workingIndex = workingHeaders.indexOf(header);
    if (workingIndex !== -1) {
      columnMapping[sorIndex] = workingIndex;
    }
  });
  
  // Create new row for Working sheet
  const workingRow = new Array(workingHeaders.length).fill('');
  
  // Map SOR data to Working sheet using column name mapping
  sorRowData.forEach((value, sorColIndex) => {
    if (columnMapping[sorColIndex] !== undefined) {
      workingRow[columnMapping[sorColIndex]] = value;
    }
  });
  
  // Add default counselor fields
  const createdByIndex = workingHeaders.indexOf('Created By');
  const statusIndex = workingHeaders.indexOf('Status');
  const assignedToIndex = workingHeaders.indexOf('Assigned To');
  const notesIndex = workingHeaders.indexOf('Notes');
  const followUpIndex = workingHeaders.indexOf('Follow-up Date');
  
  if (createdByIndex !== -1) workingRow[createdByIndex] = 'System';
  if (statusIndex !== -1) workingRow[statusIndex] = 'New';
  if (assignedToIndex !== -1) workingRow[assignedToIndex] = '';
  if (notesIndex !== -1) workingRow[notesIndex] = '';
  if (followUpIndex !== -1) workingRow[followUpIndex] = '';
  
  // Append to Working sheet
  workingSheet.appendRow(workingRow);
  
  Logger.log('SUCCESS: Created inquiry ' + inquiryId + ' in both sheets');

  // Trigger WhatsApp Notification
  // Columns (0-indexed):
  // 2: Student Name
  // 6: Parent Name
  // 8: Phone
  const studentName = sorRowData[2];
  const parentName = sorRowData[6];
  const phone = sorRowData[8];
  
  if (phone) {
    sendWhatsApp(phone, parentName, studentName);
  }
}

/**
 * Manual trigger to sync all SOR data to Working sheet
 * Use this for:
 * - Initial setup
 * - If sheets get out of sync
 * - After bulk data import
 * 
 * This function uses column name mapping to handle different form structures
 */
function syncSORToWorking() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sorSheet = ss.getSheetByName('Inquiries (SOR)');
  const workingSheet = ss.getSheetByName('Inquiries (Working)');
  
  if (!sorSheet || !workingSheet) {
    Logger.log('ERROR: Required sheets not found');
    return;
  }
  
  const lastRow = sorSheet.getLastRow();
  
  if (lastRow < 2) {
    Logger.log('No data to sync');
    return;
  }
  
  // Get headers from both sheets
  const sorHeaders = sorSheet.getRange(1, 1, 1, sorSheet.getLastColumn()).getValues()[0];
  const workingHeaders = workingSheet.getRange(1, 1, 1, workingSheet.getLastColumn()).getValues()[0];
  
  Logger.log('SOR Headers: ' + sorHeaders.length + ' columns');
  Logger.log('Working Headers: ' + workingHeaders.length + ' columns');
  
  // Build column mapping: SOR column index → Working column index
  const columnMapping = {};
  sorHeaders.forEach((header, sorIndex) => {
    const workingIndex = workingHeaders.indexOf(header);
    if (workingIndex !== -1) {
      columnMapping[sorIndex] = workingIndex;
      Logger.log('Mapping: SOR[' + sorIndex + '] "' + header + '" → Working[' + workingIndex + ']');
    }
  });
  
  // Get all data from SOR (excluding header)
  const sorData = sorSheet.getRange(2, 1, lastRow - 1, sorSheet.getLastColumn()).getValues();
  
  // Clear Working sheet (keep header)
  if (workingSheet.getLastRow() > 1) {
    workingSheet.deleteRows(2, workingSheet.getLastRow() - 1);
  }
  
  // Find counselor field indices in Working sheet
  const createdByIndex = workingHeaders.indexOf('Created By');
  const statusIndex = workingHeaders.indexOf('Status');
  const assignedToIndex = workingHeaders.indexOf('Assigned To');
  const notesIndex = workingHeaders.indexOf('Notes');
  const followUpIndex = workingHeaders.indexOf('Follow-up Date');
  
  // Sync each row using column mapping
  sorData.forEach((row, rowIndex) => {
    // Create new row with correct length for Working sheet
    const newRow = new Array(workingHeaders.length).fill('');
    
    // Map SOR data to Working sheet using column name mapping
    row.forEach((value, sorColIndex) => {
      if (columnMapping[sorColIndex] !== undefined) {
        newRow[columnMapping[sorColIndex]] = value;
      }
    });
    
    // Generate ID if missing
    let inquiryId = newRow[0]; // Inquiry ID should be in column 0
    if (!inquiryId || !inquiryId.toString().startsWith('S-')) {
      inquiryId = 'S-' + (rowIndex + 1);
      // Update both SOR and Working sheets with generated ID
      sorSheet.getRange(rowIndex + 2, 1).setValue(inquiryId);
      newRow[0] = inquiryId;
    }
    
    // Add default counselor fields if not already present
    if (createdByIndex !== -1 && !newRow[createdByIndex]) {
      newRow[createdByIndex] = 'System';
    }
    if (statusIndex !== -1 && !newRow[statusIndex]) {
      newRow[statusIndex] = 'New';
    }
    if (assignedToIndex !== -1 && !newRow[assignedToIndex]) {
      newRow[assignedToIndex] = '';
    }
    if (notesIndex !== -1 && !newRow[notesIndex]) {
      newRow[notesIndex] = '';
    }
    if (followUpIndex !== -1 && !newRow[followUpIndex]) {
      newRow[followUpIndex] = '';
    }
    
    // Append to Working sheet
    workingSheet.appendRow(newRow);
  });
  
  Logger.log('✅ Synced ' + sorData.length + ' inquiries to Working sheet');
}

/**
 * Run this once to install the form submit trigger
 * This enables automatic ID generation and syncing
 */
function installTrigger() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Install new trigger for form submissions
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();
  
  Logger.log('✅ Trigger installed successfully');
  Logger.log('New inquiries will automatically get IDs and sync to Working sheet');
}

/**
 * Utility: Generate missing IDs for existing rows
 * Run this if you have existing data without IDs
 */
function generateMissingIDs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sorSheet = ss.getSheetByName('Inquiries (SOR)');
  
  if (!sorSheet) {
    Logger.log('ERROR: "Inquiries (SOR)" sheet not found');
    return;
  }
  
  const lastRow = sorSheet.getLastRow();
  let generatedCount = 0;
  
  for (let i = 2; i <= lastRow; i++) {
    const existingId = sorSheet.getRange(i, 1).getValue();
    
    if (!existingId || !existingId.toString().startsWith('S-')) {
      const newId = 'S-' + (i - 1);
      sorSheet.getRange(i, 1).setValue(newId);
      generatedCount++;
      Logger.log('Generated ID for row ' + i + ': ' + newId);
    }
  }
  
  Logger.log('✅ Generated ' + generatedCount + ' missing IDs');
}

/**
 * 3. Working sheet has additional columns:
 *    O: Status
 *    P: Assigned To
 *    Q: Notes
 *    R: Follow-up Date
 * 
 * 4. Run these functions in order:
 *    a. installTrigger() - Sets up automatic triggers
 *    b. generateMissingIDs() - Generates IDs for existing data
 *    c. syncSORToWorking() - Syncs all data to Working sheet
 * 
 * 5. Done! New inquiries will automatically get IDs and sync.
 */

/**
 * Sends a WhatsApp message via external provider (Twilio/Interakt/Meta)
 * 
 * @param {string} phone - The recipient's phone number
 * @param {string} parentName - The parent's name
 * @param {string} studentName - The student's name
 */
function sendWhatsApp(phone, parentName, studentName) {
  // Configuration
  // TODO: Replace with your actual WhatsApp Provider Webhook URL
  const WHATSAPP_API_URL = 'https://api.whatsapp.provider.com/send'; 
  const SCHOOL_NAME = "Anushtan Indic School";
  const BROCHURE_LINK = "https://www.anushtan.in/brochure.pdf";
  
  if (!phone) return;
  
  Logger.log('Attempting to send WhatsApp coverage to: ' + phone);
  
  try {
    // Determine which provider payload to use based on your selection
    // Example: Generic Webhook Payload
    const payload = {
      phone: phone,
      parentName: parentName,
      studentName: studentName,
      type: 'brochure_request',
      link: BROCHURE_LINK
    };
    
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true // Prevent script failure on API error
    };
    
    // Uncomment below line when actual API URL is ready
    // UrlFetchApp.fetch(WHATSAPP_API_URL, options);
    
    Logger.log('WhatsApp payload prepared (Mock Mode): ' + JSON.stringify(payload));
    
  } catch (e) {
    Logger.log('Error sending WhatsApp: ' + e.toString());
  }
}
