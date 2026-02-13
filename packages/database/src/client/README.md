# Google Sheets API Setup

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Google Sheets API Credentials
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1iCw9yiZ4R_yrR82V2TvmOH9mfiXDIrFdHrXdRnxxNIg

# Counselor Authentication
COUNSELOR_PASSWORD=your-secure-password-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## How to Get Google Sheets API Credentials

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create a Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in details:
   - Name: `anushtan-sheets-service`
   - Description: `Service account for counselor PWA`
4. Click "Create and Continue"
5. Skip optional steps, click "Done"

### Step 3: Generate Private Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create" - a JSON file will download

### Step 4: Extract Credentials

Open the downloaded JSON file and copy:
- `client_email` → `GOOGLE_SHEETS_CLIENT_EMAIL`
- `private_key` → `GOOGLE_SHEETS_PRIVATE_KEY`

### Step 5: Share Google Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button
3. Paste the `client_email` from the JSON file
4. Give "Editor" permissions
5. Uncheck "Notify people"
6. Click "Share"

Done! The service account can now read/write to your sheet.

## Testing the Connection

Run this command to test:

```bash
curl http://localhost:3000/api/counselor/inquiries
```

You should see a JSON response with all inquiries.
