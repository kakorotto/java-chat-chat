// Import Zone.js FIRST - required for Angular change detection
import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Verify environment is loaded correctly
import { environment } from './environments/environment';
console.log('Environment loaded:', environment);

// Check for invalid environment values
if (environment.apiBaseUrl.includes('{{') || environment.wsUrl.includes('{{')) {
  console.error('ERROR: Environment variables were not replaced!');
  console.error('API URL:', environment.apiBaseUrl);
  console.error('WS URL:', environment.wsUrl);
}

// Validate API URL is not empty or just a slash
if (!environment.apiBaseUrl || environment.apiBaseUrl.trim() === '' || environment.apiBaseUrl === '/') {
  console.error('ERROR: API Base URL is empty or invalid!');
  console.error('API URL value:', JSON.stringify(environment.apiBaseUrl));
  console.error('Please set API_BASE_URL in GitHub Actions variables');
  console.warn('Application will fail to connect to backend. API calls will be skipped.');
}

try {
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes, {
        // Enable hash-based routing as fallback if needed
        // enableTracing: false,
        // useHash: false, // Don't use hash routing by default
      }),
      provideHttpClient(),
    ],
  }).catch((err) => {
    console.error('Error bootstrapping application:', err);
    console.error('Error details:', {
      message: err?.message,
      stack: err?.stack,
      code: err?.code,
      component: err?.component,
    });
    // Display error to user
    document.body.innerHTML = '<div style="padding: 20px; font-family: Arial; color: red;"><h1>Application Error</h1><p>Failed to initialize the application. Please check the console for details.</p><pre>' + JSON.stringify(err, null, 2) + '</pre></div>';
  });
} catch (error) {
  console.error('Failed to bootstrap:', error);
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial; color: red;"><h1>Bootstrap Error</h1><p>' + error + '</p></div>';
}


