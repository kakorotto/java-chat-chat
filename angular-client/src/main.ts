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

try {
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(),
    ],
  }).catch((err) => {
    console.error('Error bootstrapping application:', err);
    console.error('Error stack:', err.stack);
    // Display error to user
    document.body.innerHTML = '<div style="padding: 20px; font-family: Arial; color: red;"><h1>Application Error</h1><p>Failed to initialize the application. Please check the console for details.</p><pre>' + JSON.stringify(err, null, 2) + '</pre></div>';
  });
} catch (error) {
  console.error('Failed to bootstrap:', error);
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial; color: red;"><h1>Bootstrap Error</h1><p>' + error + '</p></div>';
}


