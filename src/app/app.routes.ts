import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.Register)
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout')
        .then(m => m.MainLayout),

    children: [

      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard-home/dashboard-home')
            .then(m => m.DashboardHome)
      },

      {
        path: 'family',
        loadComponent: () =>
          import('./features/family/family-list/family-list')
            .then(m => m.FamilyList)
      },

      {
        path: 'family/add',
        loadComponent: () =>
          import('./features/family/add-family-member/add-family-member')
            .then(m => m.AddFamilyMember)
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];