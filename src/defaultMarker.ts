import { Marker, MarkerOptions, MarkerLabel, GoogleMap, LatLng, LatLngLiteral, MapsEventListener } from './google-map-types';
import { latlngDistance, getAngle } from './utils';

declare var google: any;

export class DefaultMarker implements Marker {
  private marker: Marker = null;

  private path: any[] = [];
  public playing = false;
  private numDelta = 0;
  private delta = null;
  private index = 0;
  private deltaIndex = 0;
  private deltaCurr = null;
  private deltaLast = null;
  private angle = 0;
  private speed = 0;
  private interval = 0;
  private markerOptions = {};

  constructor(markerOptions: MarkerOptions, speed: number, interval: number, path: any[]) {
    console.log(markerOptions, speed, interval, path);
    this.marker =  <Marker> new google.maps.Marker(markerOptions);
    console.log(this.marker);
    this.markerOptions = markerOptions;
    this.speed = speed;
    this.interval = interval;
    this.path = path;
    return this;
  }

  getAnimation() {
    return this.marker.getAnimation();
  }
  getCursor() {
    return this.marker.getCursor();
  }
  getClickable() {
    return this.marker.getClickable();
  }
  getDraggable() {
    return this.marker.getDraggable();
  }
  getIcon() {
    return this.marker.getDraggable();
  }
  getLabel() {
    return this.marker.getLabel();
  }
  getMap(): GoogleMap {
    return this.marker.getMap();
  }
  getOpacity() {
    return this.marker.getOpacity();
  }
  getPosition() {
    return this.marker.getPosition();
  }
  getShape() {
    return this.marker.getShape();
  }
  getTitle(): string {
    return this.marker.getTitle();
  }
  getVisible(): boolean {
    return this.marker.getVisible();
  }
  getZIndex(): number {
    return this.marker.getZIndex();
  }
  setMap(map: GoogleMap): void {
    this.marker.setMap(map);
  }
  setPosition(latLng: LatLng|LatLngLiteral): void {
    this.marker.setPosition(latLng);
  }
  setTitle(title: string): void {
    this.marker.setTitle(title);
  }
  setLabel(label: string|MarkerLabel): void {
    this.marker.setLabel(label);
  }
  setDraggable(draggable: boolean): void {
    this.marker.setDraggable(draggable);
  }
  setIcon(icon: string): void {
    this.marker.setIcon(icon);
  }
  setOpacity(opacity: number): void {
    this.marker.setOpacity(opacity);
  }
  setVisible(visible: boolean): void {
    this.marker.setVisible(visible);
  }
  setZIndex(zIndex: number): void {
    this.marker.setZIndex(zIndex);
  }
  setAnimation(animation: any): void {
    this.marker.setAnimation(animation);
  }
  setClickable(clickable: boolean): void {
    this.marker.setClickable(clickable);
  }

  addListener(eventName: string, handler: Function): MapsEventListener {
    return this.marker.addListener(eventName, handler);
  }

  setSpeed(speed = this.speed) {
    this.speed = speed;
  }

  setInterval(interval = this.interval) {
    this.interval = interval;
  }

  setOptions(markerOptions: any = this.markerOptions) {
    // this.marker.setOp
  }

  addLocation(locationArray: any[] = []) {
    locationArray.forEach(location => {
      if (location.lat && location.lng) {
        this.path.push(location);
      }
    });
  }

  // animation
  play() {
    this.playing = true;
    this.animate();
  }

  pause() {
    this.playing = false;
    this.animate();
  }

  reset() {
    this.playing = false;
    this.index = 0;
    this.marker.setPosition(this.path[this.index]);
  }

  next() {
    this.index++;
    this.delta = null;
    this.updateMarker();
  }

  prev() {
    this.index--;
    this.delta = null;
    this.updateMarker();
  }


  private updateMarker() {
    if (this.index >= this.path.length - 1) {
      return 'no more points to show';
    }

    if (!this.playing) {
      return 'paused';
    }

    if (!this.marker) {
      setTimeout(() => this.updateMarker(), 100);
    }

    const curr = this.marker.getPosition();
    const next = this.path[this.index + 1];
    const distance = latlngDistance({lat: curr.lat(), lng: curr.lng()}, {lat: next.lat(), lng: next.lng()});
    console.log('update car', next.lat(), next.lng(), distance, this.index);
    this.angle = getAngle(curr, next) * 180 / Math.PI;
    console.log('angle', this.angle);
    this.numDelta = Math.floor((distance * (1000 / this.interval)) / this.speed);
    console.log(this.numDelta);
    this.index++;
    if (!this.numDelta) {
      console.log('skip to next marker');
      this.updateMarker();
    } else {
      const deltaLat = (next.lat() - curr.lat()) / this.numDelta;
      const deltaLng = (next.lng() - curr.lng()) / this.numDelta;
      this.delta = {lat: deltaLat, lng: deltaLng };
      this.deltaIndex = 0;
      this.deltaCurr = { lat: curr.lat(), lng: curr.lng() };
      this.deltaLast = { lat: next.lat(), lng: next.lng() };
      console.log(this.delta, this.deltaCurr, this.deltaLast, this.deltaIndex);
      setTimeout(() => this.animate(), this.interval);
    }
  }

  private animate() {
    if (!this.deltaCurr || !this.delta || !this.deltaLast) {
      console.log('update marker');
      this.updateMarker();
      return;
    }
    if (!this.playing) {
      console.log('paused');
      return 'paused';
    }
    this.deltaCurr.lat += this.delta.lat;
    this.deltaCurr.lng += this.delta.lng;
    const newPos = { lat: this.deltaCurr.lat, lng: this.deltaCurr.lng };
    console.log('new pos', newPos, this.deltaIndex);
    this.marker.setPosition(newPos);
    if (this.deltaIndex !== this.numDelta) {
      this.deltaIndex++;
      setTimeout(() => this.animate(), this.interval);
    } else {
      console.log('last', this.deltaLast);
      this.marker.setPosition(this.deltaLast);
      setTimeout(() => this.updateMarker(), this.interval);
    }
  }

}
