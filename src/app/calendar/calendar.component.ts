import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
  OnInit,
  NgZone,
  OnDestroy,
} from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from "date-fns";
import { Subject } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarView,
} from "angular-calendar";
import { CustomerEventTimesChangedEvent } from "./calendareventhandler.component";
import { CustomerEvent } from "./customerevent.model";
import { CustomerEventService } from "./customerevent.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth/auth.service";

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};

@Component({
  selector: "CalendarComponent",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["calendar.component.css"],
  templateUrl: "calendar.component.html",
})
export class CalendarComponent implements OnInit, OnDestroy {
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;

  private mode = "calendar";
  private postId: string;
  selectedEvent: CustomerEvent;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CustomerEvent;
  };

  refresh: Subject<any> = new Subject();

  events: CustomerEvent[] = [];

  activeDayIsOpen: boolean = false;

  isLoading = false;

  userId: string;

  private eventSub: Subscription;

  private modalRef: NgbModalRef;

  private authStatus: Subscription;
  public userIsAuth = false;

  constructor(
    private modal: NgbModal,
    private cd: ChangeDetectorRef,
    public customerEventService: CustomerEventService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.mode = "calendar";
    this.postId = null;
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.customerEventService.getCustomerEvent(this.userId);
    this.eventSub = this.customerEventService
      .getEventUpdateListener()
      .subscribe((events: CustomerEvent[]) => {
        this.isLoading = false;
        this.events = events;
        this.cd.markForCheck();
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

  dayClicked({ date, events }: { date: Date; events: CustomerEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CustomerEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  handleEvent(action: string, event: CustomerEvent): void {
    this.modalData = { event, action };
    this.modalRef = this.modal.open(this.modalContent, { size: "lg" });
  }

  updateEvent(id: string, event: CustomerEvent) {
    if (this.customerEventService.updateCustomerEvent(id, event)) {
      this.modalRef.close();
      window.alert("Event Updated!");
      this.ngOnInit();
    }
  }

  deleteEvent(id: string) {
    if (this.customerEventService.deleteCustomerEvent(id)) {
      this.modalRef.close();
      window.alert("Event Deleted!");
      this.ngOnInit();
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
