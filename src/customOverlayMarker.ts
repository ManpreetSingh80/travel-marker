import { Marker, MarkerOptions, OverlayView } from './google-map-types';
import { latlngDistance, getAngle } from './utils';
import { TravelEvents } from './events';

declare var google: any;


export class CustomOverlayMarker  {
  private marker = null;
  private overlayOptions = {
    offsetX: 0,
    offsetY: 0,
    offsetAngle: 0,
    imageUrl: '',
    imageWidth: 0,
    imageHeight: 0,
    rotation: false
  };
  private map = null;
  // private div_: any;
  private angle = 0;
  // private position: any;

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
  private eventEmitter: TravelEvents = null;

  constructor(map: any, overlayOptions: any, speed: number, interval: number, path: any[]) {
    this.map = map;
    this.overlayOptions = overlayOptions;
    this.speed = speed;
    this.interval = interval;
    this.path = path;
    const position = path[0];

    // this.div_ = null;
    const marker = new google.maps.OverlayView();
    marker.setMap(map);
    marker.div_ = null;
    marker.overlayOptions = this.overlayOptions;
    marker.angle = this.angle;
    marker.position = position;
    marker.that = this;

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
    const me = marker.that;



    marker.div_ = div;

    google.maps.event.addDomListener(marker.div_, 'click', function(event) {
      alert('overlay');
      // google.maps.event.trigger(me, "click");
    });
    google.maps.event.addDomListener(img, 'click', function(event) {
      alert('overlay');
      // google.maps.event.trigger(me, "click");
    });

    // Add the element to the "overlayLayer" pane.
    const panes = marker.getPanes();
    panes.overlayLayer.appendChild(div);

  };

    marker.setPosition = function(pos) {
      marker.position = new google.maps.LatLng(pos.lat, pos.lng);
      marker.draw();
    };

    marker.getPosition = function() {
      return marker.position;
    };

    marker.setAngle = function(angle) {
      marker.angle = angle;
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
        // div.style.zIndex = '9999999';
        // marker.div_ = div;
      }
      google.maps.event.addDomListener(marker.div_, 'click', function(event) {
        alert('overlay');
        // google.maps.event.trigger(me, "click");
      });
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
      const a = (e) => console.log(e);
      google.maps.event.addListener(marker, 'click', a);
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

  addListener(eventName: string, handler: Function) {
    google.maps.event.addListener(this.map, 'click', function(event) {alert('map');
  });
  google.maps.event.addListener(this.marker, 'click', function(event) {alert('map');
});
    this.marker.addListener('click', function() {});
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

  setOptions(overlayOptions: any = this.overlayOptions) {
    // this.marker.setOp
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
    this.delta = null;
    this.marker.setPosition(this.path[this.index]);
  }

  next() {
    this.index++;
    this.delta = null;
    this.marker.setPosition(this.path[this.index]);
  }

  prev() {
    this.index--;
    this.delta = null;
    this.marker.setPosition(this.path[this.index]);
  }

  private updateMarker() {
    if (this.index === this.path.length - 1) {
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
    this.marker.setAngle(this.angle);
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
