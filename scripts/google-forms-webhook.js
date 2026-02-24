/**
 * Anushtan Google Forms -> PostgreSQL Webhook Script
 * 
 * Instructions:
 * 1. Open your Google Form in Edit mode.
 * 2. Click the three dots (More) in the top right corner and select "Script editor".
 * 3. Delete any code in the editor and paste ALL of the code below.
 * 4. Update the WEBHOOK_URL and WEBHOOK_SECRET constants at the top to match your Vercel deployment.
 * 5. Save the script (Ctrl+S or Cmd+S).
 * 6. In the left sidebar menu, click the "Triggers" icon (it looks like a clock).
 * 7. Click "+ Add Trigger" in the bottom right corner.
 * 8. Set the following:
 *    - Choose which function to run: `onFormSubmit`
 *    - Choose which deployment should run: `Head`
 *    - Select event source: `From form`
 *    - Select event type: `On form submit`
 * 9. Click "Save". (Google will ask you to review permissions and authorize the script).
 */

// ==========================================
// CONFIGURATION - UPDATE THESE VALUES
// ==========================================
// Change this to your production Vercel domain (e.g. 'https://anushtansiddipet.in')
// Make sure to include the full path: /api/webhook/google-forms
const WEBHOOK_URL = "https://anushtansiddipet.in/api/webhook/google-forms";

// This MUST match the FORMS_WEBHOOK_SECRET environment variable in Vercel
const WEBHOOK_SECRET = "your_secure_secret_token_here";
// ==========================================


/**
 * Triggered automatically when a user submits the Google Form.
 * @param {Object} e - The event object containing form responses.
 */
function onFormSubmit(e) {
    try {
        // Ensure the event object has responses
        if (!e || !e.response) {
            Logger.log("Execution bypassed: No form response data found.");
            return;
        }

        // Extract all item responses from the submission
        var itemResponses = e.response.getItemResponses();

        // Initialize our payload object mapped to the Postgres API schema
        var payload = {
            source: "GoogleForm", // To track where it came from in the DB
        };

        // Loop through each question on the form and map it to our payload
        for (var i = 0; i < itemResponses.length; i++) {
            var questionTitle = itemResponses[i].getItem().getTitle();
            var answer = itemResponses[i].getResponse();

            // This mapping uses keywords from the Question Title to determine where the data goes.
            // You can update these strings to match the EXACT titles of your Google Form questions if they differ.
            if (typeof answer !== 'string') {
                // Handle checkbox arrays by joining them
                if (Array.isArray(answer)) answer = answer.join(', ');
            }

            var normalizedTitle = questionTitle.toLowerCase();

            if (normalizedTitle.indexOf("student name") !== -1 || normalizedTitle.indexOf("child name") !== -1 || normalizedTitle.indexOf("name of the student") !== -1) {
                payload.studentName = answer;
            }
            else if (normalizedTitle.indexOf("parent name") !== -1 || normalizedTitle.indexOf("father") !== -1 || normalizedTitle.indexOf("mother") !== -1) {
                payload.parentName = answer;
            }
            else if (normalizedTitle.indexOf("phone") !== -1 || normalizedTitle.indexOf("mobile") !== -1 || normalizedTitle.indexOf("contact") !== -1) {
                payload.phone = String(answer); // Force to string to preserve + signs
            }
            else if (normalizedTitle.indexOf("email") !== -1) {
                payload.email = answer;
            }
            else if (normalizedTitle.indexOf("class") !== -1 || normalizedTitle.indexOf("grade") !== -1) {
                payload.currentClass = answer;
            }
            else if (normalizedTitle.indexOf("school") !== -1 || normalizedTitle.indexOf("previous") !== -1) {
                payload.currentSchool = answer;
            }
            else {
                // Append any unknown/extra questions to the notes field
                var currentNotes = payload.notes ? payload.notes + "\n" : "";
                payload.notes = currentNotes + questionTitle + ": " + answer;
            }
        }

        // Basic validation: Database requires at LEAST student name and phone.
        if (!payload.studentName) {
            payload.studentName = "Unknown Student (Google Form)";
        }
        if (!payload.phone) {
            Logger.log("Error: Submission completely missing phone number. Aborting API push.");
            return;
        }

        // Configure the HTTP request options
        var options = {
            'method': 'post',
            'contentType': 'application/json',
            'headers': {
                'Authorization': 'Bearer ' + WEBHOOK_SECRET
            },
            'payload': JSON.stringify(payload),
            'muteHttpExceptions': true // Prevents script from crashing if API returns non-200
        };

        // Execute the POST request
        var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
        var responseCode = response.getResponseCode();
        var responseBody = response.getContentText();

        // Log the result for debugging inside Google Apps Script dashboard
        if (responseCode >= 200 && responseCode < 300) {
            Logger.log("Successfully sent to Next.js API. Response: " + responseBody);
        } else {
            Logger.log("Failed to send to API. Status: " + responseCode + ". Response: " + responseBody + ". Payload: " + JSON.stringify(payload));
        }

    } catch (error) {
        // Log any unexpected script execution errors
        Logger.log("CRITICAL SCRIPT ERROR: " + error.toString() + "\nStack: " + error.stack);
    }
}
