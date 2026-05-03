import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardsComponent } from './dashboard/cards/cards.component';
import { TransactionComponent } from './dashboard/transaction/transaction.component';
import { UserDetailsComponent } from './dashboard/user-details/user-details.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [

  { path: '', component: LoginComponent },   // 👈 default page

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'cards', component: CardsComponent },
      { path: 'transactions', component: TransactionComponent },
      { path: 'user', component: UserDetailsComponent },
    ],
  },

  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
