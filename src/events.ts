import { EventEmitter, Listener } from './typed-event-emitter';
import { TravelData, EventType } from './models';
import { DefaultMarker } from './defaultMarker';
import { CustomOverlayMarker } from './customOverlayMarker';

export class TravelEvents extends EventEmitter {

  public onEvent = this.registerEvent<(eventType: EventType, data: TravelData) => any>();
  private marker: DefaultMarker | CustomOverlayMarker;

  constructor(marker: DefaultMarker | CustomOverlayMarker) {
    super();
    this.marker = marker;
    this.marker.setEventEmitter(this);
  }

  emitEvent(event: EventType, data: TravelData) {
    this.emit(this.onEvent, event, data);
  }
}
