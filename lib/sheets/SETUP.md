# Google Sheets Setup Guide - Dual-Sheet Architecture

## Overview

This guide will help you set up the dual-sheet architecture for Anushtan inquiry management with auto-generated unique IDs.

---

## Step 1: Prepare Your Google Sheet

### 1.1 Open Your Existing Sheet

Open your Google Sheet: `https://docs.google.com/spreadsheets/d/1iCw9yiZ4R_yrR82V2TvmOH9mfiXDIrFdHrXdRnxxNIg`

### 1.2 Rename Existing Sheet

1. Right-click on the sheet tab (bottom of screen)
2. Select "Rename"
3. Change name to: **`Inquiries (SOR)`**
4. This will be your Source of Record (read-only)

### Sheet Structure

Your Google Spreadsheet needs **two sheets**:

### 1. "Form Responses 1" (Source of Record)
- **Created automatically by Google Forms**
- Google Forms submits data here
- Apps Script adds unique ID in Column A
- **Read-only after ID is added** (never manually edit)
- Contains original form submissions

### 2. "Inquiries (Working)" (Working Copy)
- **Create this manually**
- Apps Script copies data here automatically
- Counselors make all updates here
- Has extra columns for counselor actions (Status, Assigned To, Notes, Follow-up Date)

---

## Step 1: Prepare "Form Responses 1" Sheet

Google Forms creates this sheet automatically, but we need to add Column A for the inquiry ID.

**Action:**
1. Open your Google Sheet
2. Click on the "Form Responses 1" tab
3. Right-click on Column A header
4. Select "Insert 1 column left"
5. Click on the new Column A header
6. Type: "Inquiry ID"

**Result - "Form Responses 1" columns:**
```
A: Inquiry ID       ← NEW (Apps Script will fill this)
B: Timestamp        ← Google Forms fills
C: Student Name     ← Google Forms fills
D: Current Class
E: Current School
F: Board
G: Parent Name
H: Occupation
I: Phone
J: Email
K: Address
L: How Heard
M: Source
N: Created By
```

---

## Step 2: Create "Inquiries (Working)" Sheet

**Action:**
1. Click the "+" button at the bottom to create a new sheet
2. Right-click the new sheet tab
3. Select "Rename"
4. Type: "Inquiries (Working)"
5. Press Enter

**Add headers (Row 1):**
```
A: Inquiry ID
B: Timestamp
C: Student Name
D: Current Class
E: Current Class
F: Board
G: Parent Name
H: Occupation
I: Phone
J: Email
K: Address
L: How Heard
M: Source
N: Created By
O: Status
P: Assigned To
Q: Notes
R: Follow-up Date
```

> **Note:** Columns A-N match "Form Responses 1", Columns O-R are counselor-specific fields.

---

## Step 2: Install Google Apps Script

### 2.1 Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of [`lib/sheets/apps-script.gs`](file:///Applications/anushtan/lib/sheets/apps-script.gs)
4. Paste into the Apps Script editor
5. Click **Save** (💾 icon)
6. Name the project: "Anushtan Inquiry Management"

### 2.2 Run Setup Functions

**Run these functions in order:**

1. **Install Trigger:**
   - In the Apps Script editor, select `installTrigger` from the function dropdown
   - Click **Run** (▶️ icon)
   - Authorize the script when prompted
   - Check the log: Should say "✅ Trigger installed successfully"

2. **Generate Missing IDs:**
   - Select `generateMissingIDs` from the function dropdown
   - Click **Run**
   - Check the log: Should show how many IDs were generated
   - Go back to your sheet and verify Column A has IDs (S-1, S-2, etc.)

3. **Sync to Working Sheet:**
   - Select `syncSORToWorking` from the function dropdown
   - Click **Run**
   - Check the log: Should say "✅ Synced X inquiries to Working sheet"
   - Verify "Inquiries (Working)" has all data with IDs

---

## Step 3: Test the Setup

### 3.1 Test Auto-ID Generation

1. Go to "Inquiries (SOR)" sheet
2. Manually add a new row (or submit via web form)
3. Leave Column A (Inquiry ID) empty
4. Wait a few seconds
5. Column A should auto-populate with next ID (e.g., S-15)
6. Check "Inquiries (Working)" - new row should appear there too

### 3.2 Test Counselor Updates

1. Go to "Inquiries (Working)" sheet
2. Update Column O (Status) for any inquiry
3. Add notes in Column Q
4. These changes should NOT affect "Inquiries (SOR)"
5. Verify SOR sheet remains unchanged

---

## Step 4: Update Application Environment Variables

Add these to your `.env.local`:

```env
# Google Sheets API Credentials
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1iCw9yiZ4R_yrR82V2TvmOH9mfiXDIrFdHrXdRnxxNIg
```

**How to get credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable Google Sheets API
4. Create a service account
5. Download JSON key file
6. Copy `client_email` and `private_key` to `.env.local`
7. Share your Google Sheet with the service account email (Editor access)

---

## Step 5: Restart Application

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

---

## Verification Checklist

- [ ] "Inquiries (SOR)" sheet exists
- [ ] "Inquiries (Working)" sheet exists
- [ ] Both sheets have Column A: "Inquiry ID"
- [ ] Existing rows have IDs (S-1, S-2, etc.)
- [ ] Apps Script is installed
- [ ] Trigger is active (check Extensions → Apps Script → Triggers)
- [ ] New rows auto-generate IDs
- [ ] New rows auto-sync to Working sheet
- [ ] Application can read from Working sheet
- [ ] Application can write to SOR sheet

---

## Troubleshooting

### IDs Not Auto-Generating

1. Check if trigger is installed:
   - Extensions → Apps Script → Triggers
   - Should see `onFormSubmit` trigger

2. Re-run `installTrigger()` function

3. Check Apps Script execution log:
   - Extensions → Apps Script → Executions
   - Look for errors

### Data Not Syncing to Working Sheet

1. Run `syncSORToWorking()` manually
2. Check Apps Script logs for errors
3. Verify sheet names are exact: "Inquiries (SOR)" and "Inquiries (Working)"

### Application Can't Fetch Data

1. Verify `.env.local` has correct credentials
2. Check service account has Editor access to the sheet
3. Verify sheet ID is correct
4. Check API route logs for errors

---

## Architecture Summary

```
┌─────────────────────────────────────────┐
│  Web Form / Paper Form Upload          │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Inquiries (SOR) - Source of Record     │
│  - Auto-generates ID (S-1, S-2, etc.)   │
│  - Original data never modified         │
│  - Apps Script triggers on new rows     │
└──────────────┬──────────────────────────┘
               │
               │ (Apps Script auto-syncs)
               ↓
┌─────────────────────────────────────────┐
│  Inquiries (Working) - Working Copy     │
│  - Counselors update status, notes      │
│  - Application reads from here          │
│  - Application writes counselor actions │
└─────────────────────────────────────────┘
```

---

## Next Steps

Once setup is complete:

1. Login to `/auth` as Bhargavi or Sravani
2. Dashboard should show inquiries with IDs (S-1, S-2, etc.)
3. Test "Assign to Me" functionality
4. Test updating inquiry status/notes
5. Test uploading paper form

**Setup complete!** 🎉
