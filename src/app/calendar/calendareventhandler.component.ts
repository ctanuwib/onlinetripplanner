import { CustomerEvent } from './customerevent.model';
export declare enum CustomerEventTimesChangedEventType {
    Drag = "drag",
    Drop = "drop",
    Resize = "resize"
}
/**
 * The output `$event` type when an event is resized or dragged and dropped.
 */
export interface CustomerEventTimesChangedEvent<MetaType = any> {
    type: CustomerEventTimesChangedEventType;
    event: CustomerEvent<MetaType>;
    newStart: Date;
    newEnd?: Date;
    allDay?: boolean;
}
