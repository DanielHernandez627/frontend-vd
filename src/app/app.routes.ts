import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    loadComponent: () => import('./pages/catalog/catalog').then(m => m.CatalogComponent)
  },
  {
    path: 'player/:id',
    loadComponent: () => import('./pages/player/player').then(m => m.PlayerComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: 'catalog'
  }
];
