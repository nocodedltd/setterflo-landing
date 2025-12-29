# Comet Agent Mode Instructions - Pipedream Workflow Configuration

You are currently in my Pipedream workflow called "Instagram DM Handler". I need you to complete the configuration in AGENT MODE by making the following changes.

---

## CURRENT STATE:
- ✅ Trigger: HTTP webhook at https://eo1dbmvfpv1tf1g.m.pipedream.net
- ✅ custom_request: HTTP POST step (needs URL update)
- ✅ switch1: Branching logic with 3 cases
- ⚠️ Actions needed in each branch

---

## TASK 1: Update the HTTP Request URL

1. Click on the "custom_request" step
2. Find the URL field
3. Change it from "https://your-nextjs-app.com/api/instagram-webhook" to:
   ```
   https://setterflo-landing.vercel.app/api/pipedream/instagram-dm
   ```
4. Save the step

---

## TASK 2: Add Instagram Send Message Action (case_v2wn branch)

1. Find the "case_v2wn" branch (this is the send_dm case)
2. Click the "+" button below it
3. Search for and add "HTTP Request" action
4. Configure it with these exact settings:
   - **Method**: POST
   - **URL**: 
     ```
     https://graph.facebook.com/v18.0/me/messages
     ```
   - **Authentication**: None (we'll use header)
   - **Headers**: Click "Add header"
     - Key: `Content-Type`
     - Value: `application/json`
   - **Headers**: Click "Add header" again
     - Key: `Authorization`
     - Value: `Bearer EAAQc8ZBqGDp0BO7qMZBvJkFJ22bm5sTbnE1oU5WFlhxRwY5EYDe4iXEvTGq3QhWyKoRvUC9j0zVRrNi5H8JmK6IVlVJn8Pv5lKW4nNxW1y9C2EBykFdqWBZAZCpV9Wqxj5Xr0G9dWaOYOu1QZCuH7Lx9eqOo3U6EuXZCdZAZAmQ1BPnxDjTsMU3DP7Gr3ZAuNGsZBJPxCXZCMQDMx3FxZAmrLxZBWxsmZAZCy`
   - **Body Type**: JSON
   - **Body**: Click "Use expressions" and paste:
     ```json
     {
       "recipient": {
         "id": "{{steps.custom_request.$return_value.metadata.recipient_id}}"
       },
       "message": {
         "text": "{{steps.custom_request.$return_value.reply}}"
       }
     }
     ```
5. Save the action

---

## TASK 3: Add Placeholder for Calendar Branch (case_z8mc)

1. Find the "case_z8mc" branch (book_calendar case)
2. Click the "+" button below it
3. Add "Code" step (or "Run Node.js code")
4. In the code editor, paste:
   ```javascript
   export default defineComponent({
     async run({ steps, $ }) {
       console.log('Calendar booking requested');
       console.log('Data:', steps.custom_request.$return_value.metadata.calendar_data);
       // TODO: Add Calendly/Cal.com/Google Calendar integration
       return { status: 'pending', message: 'Calendar integration coming soon' };
     }
   });
   ```
5. Save the step

---

## TASK 4: Add Placeholder for CRM Branch (case_r0JS)

1. Find the "case_r0JS" branch (create_deal case)
2. Click the "+" button below it
3. Add "Code" step (or "Run Node.js code")
4. In the code editor, paste:
   ```javascript
   export default defineComponent({
     async run({ steps, $ }) {
       console.log('CRM deal creation requested');
       console.log('Data:', steps.custom_request.$return_value.metadata.deal_data);
       // TODO: Add HubSpot/Pipedrive/ActiveCampaign integration
       return { status: 'pending', message: 'CRM integration coming soon' };
     }
   });
   ```
5. Save the step

---

## TASK 5: Save and Deploy

1. Click "Deploy" button in the top right corner
2. Wait for deployment confirmation
3. Verify the workflow is active

---

## IMPORTANT NOTES:

- ⚠️ Do NOT change the trigger step or switch logic - those are correct
- ⚠️ Make sure to use the EXACT expressions with double curly braces `{{}}` for dynamic data
- ⚠️ The Instagram access token I provided is temporary - we'll update it later
- ⚠️ Focus on getting the basic message sending working first
- ⚠️ If you encounter any errors, take a screenshot and report back

---

## EXPECTED OUTCOME:

After completing these tasks:
- ✅ HTTP Request URL points to our Vercel API
- ✅ send_dm branch has Instagram API call configured with proper headers
- ✅ calendar branch has placeholder code step
- ✅ CRM branch has placeholder code step
- ✅ Workflow is deployed and ready to test

---

## VERIFICATION CHECKLIST:

Please verify these items before completing:
- [ ] custom_request step URL updated
- [ ] case_v2wn has HTTP Request action with Authorization header
- [ ] case_z8mc has Code step with placeholder
- [ ] case_r0JS has Code step with placeholder
- [ ] Workflow deployed successfully
- [ ] No error messages in any step

---

Please execute these steps in agent mode and report back what you've completed and any issues encountered.
