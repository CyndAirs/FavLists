import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { OrderByPipe } from './pipes/orderByPipe';

import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CategoriesComponent } from './categories/categories.component';
import { FavouritesComponent } from './favourites/favourites.component';

import { AuthGuard } from './guards/auth.guard';

import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { FavouritesService } from './services/favourites.service';
import { CategoriesService } from './services/categories.service';

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'favourites',
    component: FavouritesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    FavouritesComponent,
    CategoriesComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthService,
    CategoriesService,
    FavouritesService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
