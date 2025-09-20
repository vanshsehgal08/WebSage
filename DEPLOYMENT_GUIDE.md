# WebSage Deployment Guide

This guide will help you deploy WebSage with the backend on Render and frontend on Vercel.

## Prerequisites

- GitHub repository with your WebSage code
- Render account (free tier available)
- Vercel account (free tier available)
- Gemini API key

## Backend Deployment on Render

### Step 1: Prepare Backend for Render

1. **Environment Variables**: You'll need to set up your Gemini API key
2. **Build Configuration**: The backend is already configured with the necessary scripts

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `websage-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm run render-start`
   - **Plan**: Free (or upgrade as needed)

5. **Environment Variables**:
   - Add `GEMINI_API_KEY` with your Gemini API key
   - Add `NODE_ENV` with value `production`

6. Click "Create Web Service"

### Step 3: Get Backend URL

After deployment, Render will provide you with a URL like:
```
https://websage-backend.onrender.com
```

**Important**: Note this URL as you'll need it for the frontend configuration.

## Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Vercel

The frontend is already configured with the necessary Vercel settings.

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Environment Variables**:
   - Add `VITE_BACKEND_URL` with your Render backend URL
   - Example: `https://websage-backend.onrender.com`

6. Click "Deploy"

### Step 3: Update Backend CORS

After getting your Vercel frontend URL, update the backend CORS configuration:

1. Go to your Render service dashboard
2. Navigate to "Environment" tab
3. Add a new environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your Vercel frontend URL (e.g., `https://websage-frontend.vercel.app`)

4. Update the backend code to use this environment variable for CORS

## Post-Deployment Configuration

### Update CORS in Backend

You'll need to update the CORS configuration in `backend/src/index.ts` to include your actual Vercel URL:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://websage-frontend.vercel.app', // Your actual Vercel URL
    // Add other URLs as needed
  ],
  credentials: true
}))
```

### Test Your Deployment

1. Visit your Vercel frontend URL
2. Test the application functionality
3. Check browser console for any CORS errors
4. Monitor Render logs for any backend issues

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend URL is added to the backend CORS configuration
2. **API Key Issues**: Verify your Gemini API key is correctly set in Render environment variables
3. **Build Failures**: Check the build logs in both Render and Vercel dashboards

### Monitoring

- **Render**: Monitor logs in the Render dashboard
- **Vercel**: Check function logs in the Vercel dashboard
- **Browser**: Use browser dev tools to debug frontend issues

## Cost Considerations

- **Render Free Tier**: 750 hours/month, sleeps after 15 minutes of inactivity
- **Vercel Free Tier**: 100GB bandwidth, unlimited static deployments
- **Gemini API**: Check Google's pricing for API usage

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive configuration
- Regularly rotate your API keys
- Monitor your API usage to avoid unexpected charges
