import { Injectable } from '@angular/core';
import { CustomerEvent } from './customerevent.model';
import {  Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/events/";

@Injectable({
  providedIn: 'root'
})
export class CustomerEventService {

  private events : CustomerEvent[] = [];
  private eventsUpdated = new Subject<CustomerEvent[]>();

  constructor(private http: HttpClient) {}

  addToCustomerEvent(event: CustomerEvent) {
    this.http.post<{message: string,postId:string}>(BACKEND_URL, event).subscribe(
    (responseData) => {
    const id = responseData.postId;
    event.id = id;
    this.events.push(event);
    this.eventsUpdated.next([...this.events]);
    window.alert('Added the event!');
    });
  }

  updateCustomerEvent(id: string, event: CustomerEvent){
    this.http.put(BACKEND_URL + id, event)
    .subscribe(() => {
      this.events = this.events.filter( event => event.id !== id);
      this.eventsUpdated.next([...this.events]);
    });
    return true;
  }

  deleteCustomerEvent(id: string){
    this.http.delete(BACKEND_URL + id)
    .subscribe(() => {
      this.events = this.events.filter( event => event.id !== id);
      this.eventsUpdated.next([...this.events]);
    });
    return true;
  }

  getCustomerEvent(userId: string){
    this.http.get<{events: CustomerEvent[]}>(BACKEND_URL + userId).pipe().subscribe((postData) => {
      this.events = postData.events;
      for (var event of this.events){
        event.start = new Date(event.start);
        event.end = new Date(event.end);
      }
      this.eventsUpdated.next([...this.events]);
    });;
  }



  getSingleCustomerEvent(id:String){
    return {...this.events.find(p => p.id === id)}
  }

  clearCustomerEvent(){
    this.events = [];
    return this.events;
  }

  getEventUpdateListener(){
    return this.eventsUpdated.asObservable();
  }

}
