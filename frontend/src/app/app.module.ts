import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDetailsComponent } from './dashboard/user-details/user-details.component';
import { TransactionComponent } from './dashboard/transaction/transaction.component';
import { CardsComponent } from './dashboard/cards/cards.component';
import { CardDetailComponent } from './dashboard/cards/card-detail/card-detail.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { RegisterComponent } from './auth/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { AddCardComponent } from './dashboard/cards/add-card/add-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ContactComponent,
    AboutComponent,
    LoginComponent,
    NotFoundComponent,
    DashboardComponent,
    UserDetailsComponent,
    TransactionComponent,
    CardsComponent,
    CardDetailComponent,
    DashboardHomeComponent,
    RegisterComponent,
    AddCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
