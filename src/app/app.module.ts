import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from "./header/header.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SearchComponent } from "./search/search.component";
import { GoogleMapsComponent } from "./search/googlemaps.component";
import { SelectCountryComponent } from "./search/selectcountry.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/moment";
import * as moment from "moment";
import { CalendarComponent } from "./calendar/calendar.component";
import { FlatpickrModule } from "angularx-flatpickr";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GoogleMapsModule } from "@angular/google-maps";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { MatDialogModule } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";
import { HomePageComponent } from "./homepage/homepage.component";
import { ListComponent } from './list/list.component';
import { MatPaginatorModule } from "@angular/material/paginator";
import { AccountComponent } from "./auth/account/account.component";

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    CalendarComponent,
    GoogleMapsComponent,
    SelectCountryComponent,
    LoginComponent,
    RegisterComponent,
    ErrorComponent,
    HomePageComponent,
    ListComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    NgbModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
