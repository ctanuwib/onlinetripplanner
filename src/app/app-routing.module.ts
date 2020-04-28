import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { HomePageComponent } from './homepage/homepage.component';
import { ListComponent } from './list/list.component';
import { AccountComponent } from './auth/account/account.component';


const routes: Routes = [
  {path: 'search', component: SearchComponent,canActivate: [AuthGuard]},
  {path: 'calendar', component: CalendarComponent,canActivate: [AuthGuard]},
  {path: 'edit/:postId', component: CalendarComponent,canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent },
  {path: 'list', component: ListComponent,canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent,canActivate: [AuthGuard]},
  {path: '', component: HomePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
