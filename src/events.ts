import { EventEmitter, Listener } from './typed-event-emitter';
import { LatLng } from './google-map-types';
import { DefaultMarker } from './defaultMarker';
import { CustomOverlayMarker } from './customOverlayMarker';

export interface TravelData {
  location: LatLng;
  playing: boolean;
  index: number;
  status: 'reset' | 'playing' | 'paused' | 'finished';
}

export type EventType = 'play' | 'paused' | 'finished' | 'reset' | 'checkpoint';

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
