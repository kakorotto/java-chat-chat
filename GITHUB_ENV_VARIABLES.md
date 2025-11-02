# GitHub Actions Environment Variables

This document lists all environment variables used in GitHub Actions workflows for this project.

## Repository Variables

These variables should be set in GitHub repository settings under:
**Settings → Secrets and variables → Actions → Variables**

### Required Variables

#### 1. `API_BASE_URL`
- **Type**: Variable (public in logs)
- **Description**: Base URL for the API endpoints
- **Used in**: 
  - `.github/workflows/angular-pages.yml` (line 49)
  - `.github/workflows/pages-deploy.yml` (line 47)
- **Default fallback**: `http://localhost:8080/api`
- **Example values**:
  - `https://api.example.com/api`
  - `https://your-deployed-api.com/api`
- **Usage**: Configured in Angular production environment files during build

#### 2. `WS_URL`
- **Type**: Variable (public in logs)
- **Description**: WebSocket URL for real-time communication
- **Used in**: 
  - `.github/workflows/angular-pages.yml` (line 50)
  - `.github/workflows/pages-deploy.yml` (line 48)
- **Default fallback**: `ws://localhost:8082/ws`
- **Example values**:
  - `wss://api.example.com/ws` (secure WebSocket)
  - `ws://your-deployed-api.com/ws` (non-secure WebSocket)
- **Usage**: Configured in Angular production environment files during build
- **Note**: The code automatically converts `ws://` to `http://` and `wss://` to `https://` for SockJS compatibility

### Optional Variables

#### 3. `PAGES_API_BASE_URL`
- **Type**: Environment variable (can be set in workflow)
- **Description**: API base URL specifically for GitHub Pages deployment of Thymeleaf client
- **Used in**: 
  - `.github/workflows/frontend-pages.yml` (line 63)
  - `.github/workflows/pages-deploy.yml` (line 101)
- **Default fallback**: `http://localhost:8080/api`
- **Note**: Currently used as shell environment variable, not a GitHub Actions variable. Consider migrating to GitHub Actions variables for consistency.

## How to Set Variables

### Step-by-Step Instructions

1. Navigate to: https://github.com/kakorotto/java-chat-chat
2. Click **Settings** (top menu bar)
3. In left sidebar, find **Secrets and variables** → **Actions**
4. Click **Variables** tab
5. Click **New repository variable**
6. Enter:
   - **Name**: `API_BASE_URL`
   - **Value**: Your API URL (e.g., `https://your-api.com/api`)
7. Click **Add variable**
8. Repeat for `WS_URL`

### Quick Links

- Variables page: https://github.com/kakorotto/java-chat-chat/settings/variables/actions

## Variable Priority

In the workflows, variables are checked in this order:
1. `vars.API_BASE_URL` (GitHub repository variable)
2. `secrets.API_BASE_URL` (GitHub repository secret - fallback)
3. Default value: `http://localhost:8080/api`

## Workflow Usage

### Angular Pages Workflow (`angular-pages.yml`)
```yaml
env:
  API_BASE_URL: ${{ vars.API_BASE_URL || secrets.API_BASE_URL || 'http://localhost:8080/api' }}
  WS_URL: ${{ vars.WS_URL || secrets.WS_URL || 'ws://localhost:8082/ws' }}
```

### Pages Deploy Workflow (`pages-deploy.yml`)
```yaml
env:
  API_BASE_URL: ${{ vars.API_BASE_URL || secrets.API_BASE_URL || 'http://localhost:8080/api' }}
  WS_URL: ${{ vars.WS_URL || secrets.WS_URL || 'ws://localhost:8082/ws' }}
```

### Frontend Pages Workflow (`frontend-pages.yml`)
```bash
# Uses shell environment variable (not GitHub Actions variable)
PAGES_API_BASE_URL=${PAGES_API_BASE_URL:-http://localhost:8080/api}
```

## Notes

- **Variables vs Secrets**: We use **Variables** (not Secrets) because:
  - Variables are visible in workflow logs (helpful for debugging)
  - Secrets are hidden (for sensitive data like passwords)
  - Since these are URLs (not credentials), variables are appropriate

- **If Backend Not Deployed**: Leave variables empty or use default localhost values. Workflows will use localhost defaults for local development.

- **Updating Variables**: You can update or delete these variables anytime from the GitHub repository settings.

## Summary Table

| Variable Name | Type | Required | Default | Used In |
|--------------|------|----------|---------|---------|
| `API_BASE_URL` | GitHub Variable | Yes | `http://localhost:8080/api` | angular-pages.yml, pages-deploy.yml |
| `WS_URL` | GitHub Variable | Yes | `ws://localhost:8082/ws` | angular-pages.yml, pages-deploy.yml |
| `PAGES_API_BASE_URL` | Shell Env Var | No | `http://localhost:8080/api` | frontend-pages.yml, pages-deploy.yml |

