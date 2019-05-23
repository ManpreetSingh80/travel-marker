import { Marker, MarkerOptions, OverlayView, LatLng, GoogleMap, OverlayOptions, TravelData, EventType } from './models';
import { latlngDistance, getAngle } from './utils';
import { TravelEvents } from './events';

declare var google: any;

export class CustomOverlayMarker  {
  private marker = null;
  private overlayOptions: OverlayOptions = {
    offsetX: 0,
    offsetY: 0,
    offsetAngle: 0,
    imageUrl: '',
    imageWidth: 0,
    imageHeight: 0
  };
  private map = null;
  private angle = 0;

  private path: any[] = [];
  public playing = false;
  private numDelta = 0;
  private delta = null;
  private index = 0;
  private deltaIndex = 0;
  private deltaCurr = null;
  private deltaLast = null;
  private speed = 0;
  private interval = 0;
  private speedMultiplier = 1;
  private cameraOnMarker = false;
  private eventEmitter: TravelEvents = null;

  constructor(map: any, overlayOptions: OverlayOptions, speed: number, interval: number, speedMultiplier: number,
     path: any[], cameraOnMarker: boolean) {
    this.map = map;
    this.overlayOptions = overlayOptions;
    this.speed = speed;
    this.interval = interval;
    this.speedMultiplier = speedMultiplier;
    this.path = path;
    this.cameraOnMarker = cameraOnMarker;
    const position = path[0];
    this.angle = path.length > 1 ? getAngle(path[0], path[1]) * 180 / Math.PI : 0;

    // this.div_ = null;
    const marker = new google.maps.OverlayView();
    marker.setMap(map);
    marker.div_ = null;
    marker.overlayOptions = this.overlayOptions;
    marker.angle = this.angle;
    marker.position = position;
    marker.cameraOnMarker = cameraOnMarker;

    marker.onAdd = function() {
      const div = document.createElement('DIV');
      div.style.borderStyle = 'none';
      div.style.borderWidth = '0px';
      div.style.position = 'absolute';

      // Create the img element and attach it to the div.
      const img = document.createElement('img');
      img.src = marker.overlayOptions.imageUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.position = 'absolute';
      div.appendChild(img);

      marker.div_ = div;

      // Add the element to the "overlayLayer" pane.
      const panes = marker.getPanes();
      panes.overlayMouseTarget.appendChild(div);

    };

    marker.setOverlayOptions = function(options: OverlayOptions) {
      marker.overlayOptions = options;
      marker.draw();
    };

    marker.setPosition = function(pos) {
      if (marker.cameraOnMarker) {
        marker.getMap().setCenter(pos);
      }
      if (typeof pos.lat === 'function' || typeof pos.lng === 'function') {
        marker.position = pos;
      } else {
        marker.position = new google.maps.LatLng(pos.lat, pos.lng);
      }
      marker.draw();
    };

    marker.getPosition = function() {
      return marker.position;
    };

    marker.setAngle = function(angle) {
      marker.angle = angle;
      marker.draw();
    };

    marker.draw = function() {
      // We use the south-west and north-east
      // coordinates of the overlay to peg it to the correct position and size.
      // To do this, we need to retrieve the projection from the overlay.
      // overlayProjection = this.getProjection();
      const div = marker.div_;
      let point = null;
      // if (this.position) {
      //   console.log('this.position', this.position);
      // }
      // var myPos = this.position !== undefined ? this.position : pos;
      // console.log('myPos', myPos);

      if (marker.position) {
        point = marker.getProjection().fromLatLngToDivPixel(marker.position);
      }

      if (point) {
        div.style.left = point.x - (marker.overlayOptions.imageWidth / 2) + marker.overlayOptions.offsetX + 'px';
        div.style.top = point.y - (marker.overlayOptions.imageHeight / 2) + marker.overlayOptions.offsetY + 'px';
        div.style.width = `${marker.overlayOptions.imageWidth}px`;
        div.style.height = `${marker.overlayOptions.imageHeight}px`;
        div.style.transform = 'rotate(' + marker.angle + marker.overlayOptions.offsetAngle + 'deg)';
        div.children[0].src =  marker.overlayOptions.imageUrl;
        // div.style.zIndex = '9999999';
        // marker.div_ = div;
      }
      // google.maps.event.addDomListener(marker.div_, 'click', function(event) {
      //   console.log('overlay');
      // });
      /*
      // Retrieve the south-west and north-east coordinates of this overlay
      // in LatLngs and convert them to pixel coordinates.
      // We'll use these coordinates to resize the div.
      var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
      var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

      // Resize the image's div to fit the indicated dimensions.
      var div = this.div_;
      div.style.left = sw.x + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = (ne.x - sw.x) + 'px';
      div.style.height = (sw.y - ne.y) + 'px';
      */
    };
    marker.addListener = function(eventName: string, handler: Function) {
      if (!marker.div_) {
        setTimeout(() => marker.addListener(eventName, handler), 300);
      } else {
        google.maps.event.addDomListener(marker.div_, eventName, handler);
      }
    };
    // The onRemove() method will be called automatically from the API if
    // we ever set the overlay's map property to 'null'.
    marker.onRemove = function() {
      marker.div_.parentNode.removeChild(this.div_);
      marker.div_ = null;
    };
    this.marker = marker;
    return this;
  }

  private equalLatLng(loc1: LatLng, loc2: LatLng): boolean {
    return loc1.lat() === loc2.lat() && loc1.lng() === loc2.lng();
  }

  addListener(eventName: string, handler: Function): any {
    this.marker.addListener(eventName, handler);
  }

  getPosition(): LatLng {
    return this.marker.getPosition();
  }

  setMap(map: GoogleMap) {
    this.marker.setMap(map);
  }

  setEventEmitter(eventEmitter: TravelEvents) {
    this.eventEmitter = eventEmitter;
  }

  addLocation(locationArray: any[] = []) {
    locationArray.forEach(location => {
      if (location.lat && location.lng) {
        this.path.push(location);
      }
    });
  }

  setSpeed(speed = this.speed) {
    this.speed = speed;
  }

  setInterval(interval = this.interval) {
    this.interval = interval;
  }

  setSpeedMultiplier(multiplier: number) {
    this.speedMultiplier = multiplier;
  }

  updateOptions(overlayOptions: any): void {
    this.overlayOptions = Object.assign(this.overlayOptions, overlayOptions);
    this.marker.setOverlayOptions(this.overlayOptions);
  }

  // animation
  play() {
    this.playing = true;
    this.eventEmitter.emitEvent('play', {
      location: this.marker.getPosition(),
      status: 'playing',
      playing: this.playing,
      index: this.index
    });
    this.animate();
  }

  pause() {
    this.playing = false;
    this.eventEmitter.emitEvent('paused', {
      location: this.marker.getPosition(),
      status: 'paused',
      playing: this.playing,
      index: this.index
    });
    this.animate();
  }

  reset() {
    this.playing = false;
    this.index = 0;
    this.delta = null;
    this.angle = this.path.length > 1 ? getAngle(this.path[0], this.path[1]) * 180 / Math.PI : 0;
    this.marker.setPosition(this.path[this.index]);
    this.marker.setAngle(this.angle);
    this.eventEmitter.emitEvent('reset', {
      location: this.marker.getPosition(),
      status: 'reset',
      playing: this.playing,
      index: this.index
    });
  }

  next() {
    if (this.index === this.path.length - 1) {  // last index
      return;
    }

    this.index++;
    this.delta = null;
    this.marker.setPosition(this.path[this.index]);

    if (this.index < (this.path.length - 2)) {

      const currentLoc = this.path[this.index];
      const nextLoc = this.path[this.index + 1];

      if (this.equalLatLng(currentLoc, nextLoc)) {
        return;
      }

      this.angle = getAngle(currentLoc, nextLoc) * 180 / Math.PI;
      this.marker.setAngle(this.angle);
    }
  }

  prev() {
    if (!this.index) {  // first Index
      return;
    }

    this.index--;
    this.delta = null;
    this.marker.setPosition(this.path[this.index]);
    if (this.index < (this.path.length - 2)) {
      const currentLoc = this.path[this.index];
      const nextLoc = this.path[this.index + 1];
      if (this.equalLatLng(currentLoc, nextLoc)) {
        return;
      }
      this.angle = getAngle(this.path[this.index], this.path[this.index + 1]) * 180 / Math.PI;
      this.marker.setAngle(this.angle);
    }
  }

  private updateMarker() {
    if (this.index === this.path.length - 1) {
      this.eventEmitter.emitEvent('finished', {
        location: this.marker.getPosition(),
        status: 'finished',
        playing: this.playing,
        index: this.index
      });
      return 'no more points to show';
    }

    if (!this.playing) {
      return 'paused';
    }

    if (!this.marker) {
      setTimeout(() => this.updateMarker(), 100);
    }

    this.eventEmitter.emitEvent('checkpoint', {
      location: this.marker.getPosition(),
      status: 'playing',
      playing: this.playing,
      index: this.index
    });

    const curr = this.marker.getPosition();
    const next = this.path[this.index + 1];
    const distance = latlngDistance({lat: curr.lat(), lng: curr.lng()}, {lat: next.lat(), lng: next.lng()});
    // console.log('update car', next.lat(), next.lng(), distance, this.index);
    this.numDelta = Math.floor((distance * (1000 / this.interval)) / this.speed);
    // console.log(this.numDelta);
    this.index++;
    if (!this.numDelta) {
      // console.log('skip to next marker');
      this.updateMarker();
    } else {
      this.angle = getAngle(curr, next) * 180 / Math.PI;
      // console.log('angle', this.angle);
      this.marker.setAngle(this.angle);
      const deltaLat = (next.lat() - curr.lat()) / this.numDelta;
      const deltaLng = (next.lng() - curr.lng()) / this.numDelta;
      this.delta = {lat: deltaLat, lng: deltaLng };
      this.deltaIndex = 0;
      this.deltaCurr = { lat: curr.lat(), lng: curr.lng() };
      this.deltaLast = { lat: next.lat(), lng: next.lng() };
      // console.log(this.delta, this.deltaCurr, this.deltaLast, this.deltaIndex);
      setTimeout(() => this.animate(), this.interval * Math.ceil(1 / this.speedMultiplier));
    }
  }

  private animate() {
    if (!this.deltaCurr || !this.delta || !this.deltaLast) {
      // console.log('update marker');
      this.updateMarker();
      return;
    }
    if (!this.playing) {
      // console.log('paused');
      return 'paused';
    }
    this.deltaCurr.lat += this.delta.lat * Math.ceil(this.speedMultiplier);
    this.deltaCurr.lng += this.delta.lng * Math.ceil(this.speedMultiplier);
    const newPos = { lat: this.deltaCurr.lat, lng: this.deltaCurr.lng };
    // console.log('new pos', newPos, this.deltaIndex);
    this.marker.setPosition(newPos);
    const nextIndex = this.deltaIndex + Math.ceil(this.speedMultiplier);
    if (nextIndex < this.numDelta) {
      this.deltaIndex = nextIndex;
      setTimeout(() => this.animate(), this.interval * Math.ceil(1 / this.speedMultiplier));
    } else {
      // console.log('last', this.deltaLast);
      setTimeout(() => {
        this.marker.setPosition(this.deltaLast);
        this.updateMarker();
      }, this.interval * Math.ceil(1 / this.speedMultiplier));
    }
  }
}
