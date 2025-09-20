# Environment Variables for Vercel Deployment

## Required Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

### Backend URL
- **Variable Name**: `VITE_BACKEND_URL`
- **Value**: `https://your-render-app-name.onrender.com`
- **Environment**: Production, Preview, Development

### Example:
```
VITE_BACKEND_URL=https://websage-backend.onrender.com
```

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the variable name and value
5. Select which environments to apply it to
6. Click Save

## Notes:
- Variables starting with `VITE_` are exposed to the frontend
- Make sure to update the backend URL to match your actual Render deployment URL
- The backend URL will be used by the frontend to make API calls
