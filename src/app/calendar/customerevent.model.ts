import { CalendarEvent } from 'angular-calendar';

export interface CustomerEvent<MetaType = any> extends CalendarEvent {
  address: string;
  placeId: string;
  creator : string;
  details : string;
}
