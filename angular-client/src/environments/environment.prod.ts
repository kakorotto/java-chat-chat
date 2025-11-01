// This file will be updated during build with actual API URLs
// Set API_BASE_URL and WS_URL environment variables in GitHub Actions
// 
// To use your deployed backend:
// 1. Go to GitHub repo Settings → Secrets and variables → Actions → Variables
// 2. Add API_BASE_URL (e.g., https://your-api-gateway.com/api)
// 3. Add WS_URL (e.g., wss://your-api-gateway.com/ws)
//
// For localhost testing, run: npm start (uses environment.ts)
export const environment = {
  production: true,
  apiBaseUrl: '{{API_BASE_URL}}',
  wsUrl: '{{WS_URL}}',
};


