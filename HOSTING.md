# Hosting Your Coffee Timer on GitHub Pages

This guide will help you deploy your Coffee Timer app to GitHub Pages.

## Prerequisites

- Your code is already in a GitHub repository
- You have push access to the repository

## Option 1: GitHub Actions (Recommended)

This method uses GitHub Actions to automatically build and deploy your app whenever you push to the main branch.

### Steps:

1. **The GitHub Actions workflow is already set up** in `.github/workflows/deploy.yml`

2. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under "Source", select **GitHub Actions**
   - Save the settings

3. **Push your changes:**
   ```bash
   git push origin claude/hosting-setup-guide-011CUmqat8Qv8otyy8k4emMf
   ```

4. **Merge to main branch:**
   - Create a pull request from your branch to main
   - Once merged, the GitHub Action will automatically run
   - Your site will be deployed to: `https://<username>.github.io/coffee-timer/`

5. **Monitor the deployment:**
   - Go to the **Actions** tab in your repository
   - Watch the deployment workflow run
   - Once complete, visit your site!

## Option 2: Manual Deployment with gh-pages

If you prefer to deploy manually:

### Steps:

1. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **The package.json is already configured** with:
   - `homepage` field pointing to your GitHub Pages URL
   - `deploy` and `predeploy` scripts

3. **Deploy manually:**
   ```bash
   npm run deploy
   ```

   This will:
   - Build your app (`npm run build`)
   - Push the build folder to the `gh-pages` branch
   - GitHub Pages will automatically serve from this branch

4. **Enable GitHub Pages (if not already enabled):**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select the `gh-pages` branch and `/ (root)` folder
   - Click Save

5. **Visit your site:**
   - Your app will be live at: `https://<username>.github.io/coffee-timer/`
   - It may take a few minutes for the initial deployment

## Configuration Files

### package.json Updates

The following has been added to your `package.json`:

```json
{
  "homepage": "https://<username>.github.io/coffee-timer",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

**Note:** Replace `<username>` with your actual GitHub username!

### GitHub Actions Workflow

The workflow file at `.github/workflows/deploy.yml` handles:
- Installing dependencies
- Building the React app
- Deploying to GitHub Pages

## Updating Your Site

### With GitHub Actions:
Simply push to your main branch, and the site will automatically update.

### With gh-pages:
Run `npm run deploy` whenever you want to update the site.

## Troubleshooting

### Blank page after deployment
- Make sure the `homepage` field in `package.json` matches your repository name
- Check that the repository name is exactly `coffee-timer`

### 404 errors
- Ensure GitHub Pages is enabled in your repository settings
- Check that you're using the correct URL format

### Changes not showing up
- Clear your browser cache
- Wait a few minutes for GitHub's CDN to update
- Check the Actions tab to ensure the deployment succeeded

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure your domain's DNS settings to point to GitHub Pages
3. Enable "Enforce HTTPS" in repository settings

## Need Help?

- GitHub Pages Documentation: https://docs.github.com/en/pages
- Create React App Deployment Guide: https://create-react-app.dev/docs/deployment/#github-pages
