// declare var google: any;

import { TravelMarkerOptions } from './travelMarkerOptions';
import { Marker, MarkerOptions, google, LatLng } from './google-map-types';
import { DefaultMarker } from './defaultMarker';
import { CustomOverlayMarker } from './customOverlayMarker';
import { MapsEventListener } from './google-map-types';
import { TravelEvents } from './events';

export class TravelMarker {

  private defaultOptions: TravelMarkerOptions = {
    map: null,
    speed: 35,
    interval: 20,
    speedMultiplier: 1,
    markerType: 'default',
    markerOptions: {
      position: { lat: 0, lng: 0 }
    },
    overlayOptions: {
      offsetX: 0,
      offsetY: 0,
      offsetAngle: 0,
      imageUrl: 'https://i.stack.imgur.com/lDrin.png',
      imageWidth: 36,
      imageHeight: 58,
      rotation: false
    },
    line: null
  };
  private defaultMarkerOptions = {
    draggable: false,
    // optimized: false
  };

  private options: TravelMarkerOptions;
  private path: any[] = [];
  private marker: DefaultMarker | CustomOverlayMarker = null;
  public playing = false;
  private numDelta = 0;
  private delta = null;
  private index = 0;
  private deltaIndex = 0;
  private deltaCurr = null;
  private deltaLast = null;
  private angle = 0;

  public event: TravelEvents = null;

  constructor(options: TravelMarkerOptions) {
    if (options.map === null) {
      console.log('map cannot be null');
      return;
    }
    options = Object.assign(this.defaultOptions, options);
    options.markerOptions = Object.assign(options.markerOptions, this.defaultMarkerOptions);
    options.markerOptions.map = options.map;
    // check all parmas
    if (this.isValidOptions) {
      this.options = options;
    } else {
      console.error('Invalid options');
    }
    return this;
  }

  private isValidOptions(options: TravelMarkerOptions): boolean {
    return !isNaN(options.speed) && !isNaN(options.interval) &&
     (options.markerType === 'default' || options.markerType === 'symbol' || options.markerType === 'overlay') &&
      typeof options.line === 'object';
  }

  private setListener() {
    this.event = new TravelEvents(this.marker);
    this.event.onEvent((event, data) => {
      // console.log('Event', event, data);
      this.playing = data.playing;
    });
  }

  getOptions(): TravelMarkerOptions {
    return JSON.parse(JSON.stringify(this.options));
  }

  getPosition(): LatLng | null {
    return this.marker ? this.marker.getPosition() : null;
  }

  addLocation(locationArray: any[] = []) {
    locationArray.forEach(location => {
      if (location.lat && location.lng) {
        this.path.push(location);
      }
    });
    if (!this.marker && this.path.length) {
      if (this.options.markerType === 'default') {
        const markerOptions = Object.assign(this.options.markerOptions, { position: { lat: this.path[0].lat(), lng: this.path[0].lng() } });
        this.marker = new DefaultMarker(markerOptions, this.options.speed, this.options.interval, this.options.speedMultiplier, this.path);
      } else if (this.options.markerType === 'overlay') {
        this.marker = new CustomOverlayMarker(this.options.map, this.options.overlayOptions,
           this.options.speed, this.options.interval, this.options.speedMultiplier, this.path);
      } else {

      }
      this.setListener();
    } else if (this.marker) {
      this.marker.addLocation(locationArray);
    } else {
      return 'Please insert valid location Array';
    }
  }

  play() {
    this.playing = true;
    this.marker.play();
  }

  pause() {
    this.playing = false;
    this.marker.pause();
  }

  reset() {
    this.playing = false;
    this.marker.reset();
  }

  next() {
    this.marker.next();
  }

  prev() {
    this.marker.prev();
  }

  setInterval(interval: number = this.options.interval) {
    this.options.interval = interval;
    this.marker.setInterval(interval);
  }

  setSpeedMultiplier(multiplier: number) {
    this.options.speedMultiplier = multiplier;
    this.marker.setSpeedMultiplier(multiplier);
  }

  setSpeed(speed: number = this.options.speed) {
    this.options.speed = speed;
    this.marker.setSpeed(speed);
  }

  setMarkerOptions(options: MarkerOptions = this.options.markerOptions) {
    if (this.options.markerType === 'default') {
      this.options.markerOptions = Object.assign(this.options.markerOptions, options);
      this.marker.setOptions(this.options.markerOptions);
      return true;
    } else {
      return false;
    }
  }

  setOverlayOptions(options: any) {
    if (this.options.markerType === 'overlay') {
      this.marker.setOptions(options);
      return true;
    } else {
      return false;
    }
  }

  addListener(eventName: string, handler: Function): any {
    this.marker.addListener(eventName, handler);
  }

}
