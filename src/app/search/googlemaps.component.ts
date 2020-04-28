/// <reference types="@types/googlemaps" />
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild,ChangeDetectionStrategy  } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CalendarEvent, CalendarView } from 'angular-calendar';



@Component({
  selector: "GoogleMapsComponent",
  template: `
      <mat-form-field [hidden] = "country == ''">
      <mat-label>Search your destination</mat-label>
      <input
        matInput
        type="text"
        [(ngModel)]="autocompleteInput"
        #addresstext
        >
      </mat-form-field>
        <br>
        <button
        mat-raised-button
        [hidden] = "country == ''"
        (click) = onClick()>
        Select Place
      </button>

    `,
})

//style="padding: 12px 20px; border: 1px solid #ccc; width: 400px"

export class GoogleMapsComponent implements OnInit, AfterViewInit {

  @Input() adressType: string;
  @Input() country: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput: string;
  queryWait: boolean;
  place : object;

  constructor (){}



  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  onClick(){
    this.invokeEvent(this.place);
  }

  init(code:string){
    this.country = code;
    this.getCityAutocomplete();
  }

  private getCityAutocomplete() {
      const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
        {
            types: [this.adressType],
            componentRestrictions: { country : [this.country]}
        });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
        this.place = autocomplete.getPlace();
    });

}

invokeEvent(place: Object) {
    this.setAddress.emit(place);
}

}
