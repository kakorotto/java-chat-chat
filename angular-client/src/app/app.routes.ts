import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ChatComponent } from './chat.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chat', component: ChatComponent },
];


