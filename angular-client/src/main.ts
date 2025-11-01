import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch((err) => {
  console.error('Error bootstrapping application:', err);
  // Display error to user
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial; color: red;"><h1>Application Error</h1><p>Failed to initialize the application. Please check the console for details.</p><pre>' + JSON.stringify(err, null, 2) + '</pre></div>';
});


