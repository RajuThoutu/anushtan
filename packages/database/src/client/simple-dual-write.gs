/**
 * Simple Dual-Sheet Script for Anushtan
 * 
 * When Google Forms submits data:
 * 1. Data goes to "Inquiries (SOR)" automatically
 * 2. This script generates an ID (S-1, S-2, etc.) and adds it to SOR
 * 3. Then it copies the data to "Inquiries (Working)"
 */

function onFormSubmit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sorSheet = ss.getSheetByName('Inquiries (SOR)');
  const workingSheet = ss.getSheetByName('Inquiries (Working)');
  
  if (!sorSheet || !workingSheet) {
    Logger.log('ERROR: One or both sheets not found');
    return;
  }
  
  // Google Forms just wrote to the last row of SOR sheet
  const lastRow = sorSheet.getLastRow();
  
  // Generate ID: S-(Row Number - 1)
  // Row 1 is header, so Row 2 should be S-1, Row 3 is S-2, etc.
  const uniqueId = 'S-' + (lastRow - 1);
  
  // Set the ID in Column A of the SOR sheet
  sorSheet.getRange(lastRow, 1).setValue(uniqueId);
  
  // Get all the data from that row (now including the new ID)
  const numColumns = sorSheet.getLastColumn();
  const rowData = sorSheet.getRange(lastRow, 1, 1, numColumns).getValues()[0];
  
  // Copy the exact same data to Working sheet
  workingSheet.appendRow(rowData);
  
  Logger.log('SUCCESS: Generated ' + uniqueId + ' and copied to Working sheet');
}

/**
 * Run this ONCE to install the trigger
 */
function installTrigger() {
  // Remove old triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Install new trigger
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();
  
  Logger.log('✅ Trigger installed!');
}

/**
 * Run this to sync existing data from SOR to Working
 * It will also generate IDs if they are missing
 */
function syncExistingData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sorSheet = ss.getSheetByName('Inquiries (SOR)');
  const workingSheet = ss.getSheetByName('Inquiries (Working)');
  
  if (!sorSheet || !workingSheet) {
    Logger.log('ERROR: Sheets not found');
    return;
  }
  
  const lastRow = sorSheet.getLastRow();
  
  // Iterate through SOR rows to ensure they have IDs
  for (let i = 2; i <= lastRow; i++) {
    const idRange = sorSheet.getRange(i, 1);
    const existingId = idRange.getValue();
    
    if (!existingId || existingId === '') {
      const newId = 'S-' + (i - 1);
      idRange.setValue(newId);
      Logger.log('Generated missing ID: ' + newId);
    }
  }
  
  // Get all data from SOR (including header)
  const sorData = sorSheet.getDataRange().getValues();
  
  // Clear Working sheet
  workingSheet.clear();
  
  // Copy all data to Working sheet
  if (sorData.length > 0) {
    workingSheet.getRange(1, 1, sorData.length, sorData[0].length).setValues(sorData);
  }
  
  Logger.log('✅ Synced ' + (sorData.length - 1) + ' rows to Working sheet');
}
