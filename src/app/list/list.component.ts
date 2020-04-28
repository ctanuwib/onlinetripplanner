import {Component,ChangeDetectionStrategy,ChangeDetectorRef,ViewChild,TemplateRef,OnInit,NgZone,OnDestroy} from "@angular/core";
import { Subject } from "rxjs";
import { CustomerEvent } from "../calendar/customerevent.model";
import { CustomerEventService } from "../calendar/customerevent.service";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: "ListComponent",
  templateUrl: "list.component.html",
})
export class ListComponent implements OnInit, OnDestroy {

  private postId: string;
  selectedEvent: CustomerEvent;
  events: CustomerEvent[] = [];
  isLoading = false;
  userId: string;
  private eventSub: Subscription;
  private authStatus: Subscription;
  public userIsAuth = false;

  constructor(
    public customerEventService: CustomerEventService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postId = null;
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.customerEventService.getCustomerEvent(this.userId);
    this.eventSub = this.customerEventService
      .getEventUpdateListener()
      .subscribe((events: CustomerEvent[]) => {
        this.isLoading = false;
        this.events = events;
      });
    this.userIsAuth = this.authService.getAuth();
    this.authStatus = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.userIsAuth = isAuth;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.authStatus.unsubscribe();
  }

  updateEvent(id: string, event: CustomerEvent) {
    if (this.customerEventService.updateCustomerEvent(id, event)) {
      window.alert("Event Updated!");
      this.ngOnInit();
    }
  }

  deleteEvent(id: string) {
    if (this.customerEventService.deleteCustomerEvent(id)) {
      window.alert("Event Deleted!");
      this.ngOnInit();
    }
  }
}
