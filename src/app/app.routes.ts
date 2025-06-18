import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Signup' },

  // Protected routes
  {
    path: '',
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard/:id',
        title: 'Dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'markdown',
        title: 'Markdown',
        loadComponent: () =>
          import('./markdown/markdown-page.component').then((m) => m.MarkdownPageComponent),
      },
      {
        path: 'combine-user',
        title: 'Combine User',
        loadComponent: () =>
          import('./user-combine/user-combined.component').then((m) => m.UserCombinedComponent),
      },
      {
        path: 'tax-calculator',
        title: 'Tax Calculator',
        loadComponent: () =>
          import('./tax-calculator/advanced-tax-calculator.component').then((m) => m.AdvancedTaxCalculatorComponent),
      },
      {
        path: 'cgpa-calculator',
        title: 'CGPA Calculator',
        loadComponent: () =>
          import('./cgpa-calculator/cgpa-calculator.component').then((m) => m.CgpaCalculatorComponent),
      },
      {
        path: 'company',
        title: 'Company',
        loadComponent: () =>
          import('./company/company-list.component').then((m) => m.CompanyListComponent),
      },
    ],
  },

  
  { path: '**', redirectTo: 'login' },
];
