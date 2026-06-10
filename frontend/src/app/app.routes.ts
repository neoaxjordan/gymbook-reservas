import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'classes', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
    },
    {
        path: 'classes',
        canActivate: [authGuard],
        loadComponent: () => import('./features/classes/class-list/class-list').then(m => m.ClassListComponent)
    },
    {
        path: 'my-reservations',
        canActivate: [authGuard],
        loadComponent: () => import('./features/my-reservations/my-reservations').then(m => m.MyReservationsComponent)
    },
    //   { path: '**', redirectTo: 'classes' }
    {
        path: '**',
        loadComponent: () => import('./shared/components/not-found/not-found').then(m => m.NotFoundComponent)
    }
];
