import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { ProfileComponent } from './components/pages/profile/profile.component';

import {authGuard} from "./guards/auth/auth.guard";

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: NotFoundComponent},
];
