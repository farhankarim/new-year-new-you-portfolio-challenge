<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally or deploy it to production.

View your app in AI Studio: https://ai.studio/apps/drive/1mEzd2kp3cOo9_ZDiImY_5lCOAgb58a1e

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `API_KEY` environment variable to your Gemini API key
3. Run the development server:
   `npm run dev`

## Build for Production

This project uses a production build system that generates optimized, minified assets:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the production assets:
   ```bash
   export API_KEY="your-gemini-api-key"
   npm run build
   ```

This will:
- Generate minified CSS (using Tailwind CSS)
- Bundle and minify JavaScript with the API key injected
- Copy static assets to the `dist/` directory
- Create an optimized `index.html` for production

## Production Deployment

The production build is optimized for performance and security:

- **No CDN dependencies** - All assets are bundled and served locally
- **Security headers** - CSP, HSTS, X-Frame-Options configured in nginx
- **Optimized fonts** - Non-blocking font loading
- **Minified assets** - Reduced file sizes for faster loading
- **Compression** - Gzip enabled in nginx configuration

### Deploy with Docker

A Dockerfile is provided for containerized deployment:

```bash
docker build --build-arg API_KEY="your-gemini-api-key" -t portfolio-app .
docker run -p 8080:8080 portfolio-app
```

The application will be available at `http://localhost:8080`

### Deploy to Cloud Run

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/portfolio-app
gcloud run deploy portfolio-app \
  --image gcr.io/YOUR_PROJECT_ID/portfolio-app \
  --platform managed \
  --region us-west1 \
  --set-env-vars API_KEY="your-gemini-api-key"
```
