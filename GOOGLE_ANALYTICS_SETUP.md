# Google Analytics 4 Setup Guide

This guide will help you set up Google Analytics 4 (GA4) to track visitors to your Coffee Timer app.

## Step 1: Create a Google Analytics 4 Property

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Sign in** with your Google account
3. **Create an Account** (if you don't have one):
   - Click "Start measuring"
   - Enter an account name (e.g., "Coffee Timer")
   - Configure data sharing settings
   - Click "Next"

4. **Create a Property**:
   - Property name: "Coffee Timer" (or your preferred name)
   - Reporting time zone: Select your timezone
   - Currency: Select your currency
   - Click "Next"

5. **About your business**:
   - Select your industry category
   - Select your business size
   - Click "Next"

6. **Choose your business objectives**:
   - Select relevant objectives (e.g., "Examine user behavior")
   - Click "Create"

7. **Accept the Terms of Service**

## Step 2: Set Up a Data Stream

1. **Select platform**: Choose "Web"
2. **Enter website URL**: `https://mcsmyth.github.io`
3. **Stream name**: "Coffee Timer App"
4. Click "Create stream"

5. **Copy your Measurement ID**:
   - You'll see a measurement ID in the format `G-XXXXXXXXXX`
   - Copy this ID - you'll need it in the next step

## Step 3: Add Measurement ID to GitHub Secrets

Your app is configured to read the GA4 Measurement ID from GitHub Secrets for security.

1. **Go to your GitHub repository**: https://github.com/mcsmyth/coffee-timer
2. Click on **Settings** (repository settings)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Configure the secret:
   - **Name**: `GA_MEASUREMENT_ID`
   - **Value**: Paste your measurement ID (e.g., `G-XXXXXXXXXX`)
6. Click **Add secret**

## Step 4: Deploy Your App

Once you've added the secret:

1. **Trigger a new deployment**:
   - Either push a new commit to the `main` branch
   - Or go to Actions → Deploy to GitHub Pages → Run workflow

2. **Wait for deployment** to complete (1-2 minutes)

3. **Visit your site**: https://mcsmyth.github.io/coffee-timer/

## Step 5: Verify Analytics is Working

1. **Go back to Google Analytics**: https://analytics.google.com/
2. Navigate to **Reports** → **Realtime**
3. **Open your app** in a browser: https://mcsmyth.github.io/coffee-timer/
4. Within a few seconds, you should see yourself appear as an active user in the Realtime report!

## What Data Will You See?

Google Analytics 4 will automatically track:

- **Users**: Total unique visitors
- **Sessions**: Number of visits
- **Page views**: How many times pages are viewed
- **Engagement time**: How long users spend on your app
- **User demographics**: Country, city, device type, browser
- **Traffic sources**: How users found your app (direct, social, search, etc.)

## Viewing Your Reports

**Realtime Report**: See current active users
- Go to: Reports → Realtime

**Overview**: Quick summary of key metrics
- Go to: Reports → Overview

**User Acquisition**: Where your users come from
- Go to: Reports → Acquisition → User acquisition

**Engagement**: User behavior and engagement
- Go to: Reports → Engagement → Pages and screens

## Local Development (Optional)

If you want to test GA4 during local development:

1. Create a `.env` file in your project root:
   ```bash
   REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Add `.env` to `.gitignore` (already done)

3. Run your app locally:
   ```bash
   npm start
   ```

**Note**: It's recommended to create a separate GA4 property for development to keep your production data clean.

## Privacy Considerations

- Google Analytics is GDPR compliant when configured properly
- The implementation automatically respects Do Not Track settings
- No personally identifiable information (PII) is collected
- Users can block analytics with browser extensions

## Troubleshooting

**Not seeing data?**
- Wait 24-48 hours for initial data processing
- Check Realtime reports for immediate feedback
- Verify your Measurement ID is correct
- Check browser console for errors
- Ensure ad blockers aren't blocking GA

**Need help?**
- Google Analytics Help Center: https://support.google.com/analytics
- GA4 Documentation: https://developers.google.com/analytics/devguides/collection/ga4

## Next Steps

Once you have data flowing:

1. **Set up custom events** to track specific interactions (timer starts, presets selected, music toggled)
2. **Create custom reports** to answer specific questions
3. **Set goals** to measure success
4. **Share reports** with stakeholders

Enjoy tracking your Coffee Timer's growth! ☕📊
