import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GoogleMapsComponent } from './googlemaps.component';
import { Countries } from './countries.model';
import { CustomerEvent } from '../calendar/customerevent.model';
import { CustomerEventService } from '../calendar/customerevent.service';
import flatpickr from 'flatpickr';
import  confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import { AuthService } from '../auth/auth.service';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { Router } from '@angular/router';

@Component({
  selector: 'SearchComponent',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  selectedCountry: Countries;

  place: any;

  zoom = 15

  view = "search";

  isLoading = false;

  title:string;
  address:string;
  startDate: Date;
  endDate: Date;
  placeId:any;
  details:string;

  private authStatus : Subscription;
  public userIsAuth = false;

  constructor(public customerEventService: CustomerEventService, public authService: AuthService, public router: Router) {
  }

  ngOnInit () {
    this.place = null;
    this.isLoading = true;
    this.selectedCountry = new Countries();
    this.userIsAuth = this.authService.getAuth();
    this.authStatus = this.authService. getAuthStatusListener().subscribe(isAuth => {
      this.userIsAuth = isAuth;
    });
    this.isLoading = false;
  }

  @ViewChild(GoogleMapsComponent)
  googleMaps : GoogleMapsComponent;

  getCountry(country: Countries) {
    this.selectedCountry = country;
    this.googleMaps.init(this.selectedCountry.code);
  }

  changeView(input: string){
    this.view = input;
    if (input == "addEvent"){
      this.title = this.place.name;
      this.address = this.place.formatted_address;
      this.placeId = this.place.place_id;
    }
    else if (input == "search"){
      this.ngOnInit();
    }

  }

  addCustomerEvent() {
    const event : CustomerEvent = {
      id:null,
      title:this.title,
      address:this.address,
      start: this.startDate,
      end: this.endDate,
      placeId: this.placeId,
      details: this.details,
      creator: null,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    };
    this.isLoading = true;
    this.customerEventService.addToCustomerEvent(event);
    this.router.navigate(['/calendar']);
  }


  getAddress(place: object) {
    this.place = place;
  }

  getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getAddrComponent(place, componentTemplate) {
    let result;
    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }


}
