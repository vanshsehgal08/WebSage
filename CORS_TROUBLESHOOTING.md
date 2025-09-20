# CORS Error Troubleshooting Guide

## Understanding the Error

The error you're seeing:
```
Access to XMLHttpRequest at 'https://websage-backend.onrender.com/template' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This means:
1. Your frontend (localhost:5173) is trying to make a request to your backend (websage-backend.onrender.com)
2. The browser is sending a preflight OPTIONS request first
3. The backend is not responding with the proper CORS headers

## What I've Fixed

### 1. Enhanced CORS Configuration
- Added dynamic origin checking
- Explicitly defined allowed methods and headers
- Added proper preflight handling

### 2. Manual OPTIONS Handler
- Added explicit OPTIONS request handler
- Ensures preflight requests are properly responded to

### 3. Added Health Check Endpoint
- `/health` endpoint for testing connectivity
- Enhanced root endpoint with more info

## Testing Steps

### Step 1: Test Backend Directly
Open your browser and visit:
```
https://websage-backend.onrender.com/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX..."
}
```

### Step 2: Test CORS from Browser Console
Open your browser's developer console and run:
```javascript
fetch('https://websage-backend.onrender.com/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### Step 3: Test OPTIONS Request
```javascript
fetch('https://websage-backend.onrender.com/template', {
  method: 'OPTIONS',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('OPTIONS Response:', response.status);
  console.log('CORS Headers:', {
    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
    'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
  });
})
.catch(error => console.error('OPTIONS Error:', error));
```

## Common Issues and Solutions

### Issue 1: Render Service Not Running
**Symptoms**: Connection refused, timeout errors
**Solution**: 
- Check Render dashboard for service status
- Verify environment variables are set
- Check build logs for errors

### Issue 2: Wrong Backend URL
**Symptoms**: 404 errors, wrong domain
**Solution**:
- Verify the backend URL in your frontend config
- Check if the Render service name matches

### Issue 3: Environment Variables Missing
**Symptoms**: Backend starts but API calls fail
**Solution**:
- Ensure `GEMINI_API_KEY` is set in Render
- Check Render environment variables tab

### Issue 4: CORS Still Not Working
**Symptoms**: Still getting CORS errors after fixes
**Solution**:
1. Clear browser cache
2. Try incognito/private browsing
3. Check if backend actually deployed the new code
4. Verify the origin in the error matches your localhost

## Debugging Commands

### Check Backend Status
```bash
curl -I https://websage-backend.onrender.com/health
```

### Test CORS Headers
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://websage-backend.onrender.com/template
```

### Test Actual Request
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Content-Type: application/json" \
     -X POST \
     -d '{"prompt":"test"}' \
     https://websage-backend.onrender.com/template
```

## Next Steps

1. **Deploy the Updated Backend**: Push your changes to trigger a new Render deployment
2. **Wait for Deployment**: Render deployments can take a few minutes
3. **Test Again**: Try your frontend application again
4. **Check Logs**: If still failing, check Render logs for any errors

## If Still Not Working

If you're still getting CORS errors after these fixes:

1. **Check Render Logs**: Go to your Render service dashboard and check the logs
2. **Verify Deployment**: Make sure the new code actually deployed
3. **Try Different Browser**: Test in Chrome, Firefox, or Safari
4. **Check Network Tab**: Look at the actual request/response headers in browser dev tools

The most common issue is that the backend hasn't been redeployed with the new CORS configuration yet.
