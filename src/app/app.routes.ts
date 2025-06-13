import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserComponent } from './dashboard/dashboard.component';
import { MainLayoutComponent } from "./layout/main-layout.component"
import { MarkdownPageComponent } from './markdown/markdown-page.component';
import { UserCombinedComponent } from './user-combine/user-combined.component';
import { AdvancedTaxCalculatorComponent } from './tax-calculator/advanced-tax-calculator.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Signup' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard/:id', component: UserComponent, title: 'Dashboard' },
      { path: 'markdown', component: MarkdownPageComponent, title: 'Dashboard' },
      { path: 'combine-user', component: UserCombinedComponent, title: 'Combine User' },
      { path: 'tax-calculator', component: AdvancedTaxCalculatorComponent, title: 'Tax Calculator' }

    ]
  },
];
