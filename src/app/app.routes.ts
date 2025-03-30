import { Routes } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserFormComponent } from './components/user-form/user-form.component';

export const routes: Routes = [
    {
        path: 'users', component: UsersListComponent
    },
    {
        path: 'user/:id/view', component: UserDetailComponent
    },
    {
        path: 'user/:id', component: UserFormComponent
    },
    {
        path: 'user/:id/edit', component: UserFormComponent
    },
    {
        path: '', redirectTo: '/users', pathMatch: 'full'
    },
];
