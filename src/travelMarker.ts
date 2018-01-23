import { Marker, MarkerOptions, google, LatLng, GoogleMap, MapsEventListener, TravelMarkerOptions } from './models';
import { DefaultMarker } from './defaultMarker';
import { CustomOverlayMarker } from './customOverlayMarker';
import { TravelEvents } from './events';

/**
 * A google maps library to replay gps locations with animations.
 * @author Manpreet Singh
 * @description A google maps library to replay gps locations with animations.
 * @class TravelMarker
 * * **npm package**: `travel-marker`
 */
export class TravelMarker {
  /**
   * Defaults for TravelMarkerOptions for constructor
   * @private
  */
  private defaultOptions: TravelMarkerOptions = {
    map: null,
    speed: 35,
    interval: 20,
    speedMultiplier: 1,
    markerType: 'default',
    cameraOnMarker: false,
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
  /** Tells whether animation is playing or not */
  public playing = false;
  private numDelta = 0;
  private delta = null;
  private index = 0;
  private deltaIndex = 0;
  private deltaCurr = null;
  private deltaLast = null;
  private angle = 0;
  /**
   * Use events to subscribe to animation events
   *
   * ### Example
   * ```ts
   * //  EventType = 'play' | 'paused' | 'finished' | 'reset' | 'checkpoint';
   * // checkpoint - when marker arrives on a location present in locationArray
   * // TravelData = {
   * //  location: LatLng; // marker current location
   * //  playing: boolean; // is animation playing?
   * //  index: number;  // index in locationArray
   * //  status: 'reset' | 'playing' | 'paused' | 'finished';  // animation status
   * // }
   * marker.event.onEvent((event: EventType, data: TravelData) => {
   *   // .... do something
   *  });
   * ```
   */
  public event: TravelEvents = null;

  /**
   * Creates an instance of TravelMarker.
   *
   *   ### Example
   *
   * Create default marker
   *
   *  ```ts
   *   // options
   *   const options = {
   *     map: map,  // map object
   *     speed: 50,  // default 10 , animation speed
   *     interval: 30, // default 10, marker refresh time
   *     speedMultiplier: 1, // default 1, for fast-forward/rewind
   *     cameraOnMarker: false,  // default false, move camera with marker
   *     markerOptions: { title: "Travel Marker" }
   *   };
   *   let marker = new TravelMarker(options);
   *   ```
   *
   *   Create Overlay marker
   *
   *   ```ts
   *   // options
   *   const options = {
   *     map: map,  // map object
   *     speed: 50,  // default 10 , animation speed
   *     interval: 30, // default 10, marker refresh time
   *     speedMultiplier: 1, // default 1, for fast-forward/rewind
   *     cameraOnMarker: false,  // default false, move camera with marker
   *     markerType: 'overlay',  // default: 'default'
   *     overlayOptions: {
   *       offsetX: 0, // default: 0, x-offset for overlay
   *       offsetY: 0, // default: 0, y-offset for overlay
   *       offsetAngle: 0, // default: 0, rotation-offset for overlay
   *       imageUrl: 'https://i.stack.imgur.com/lDrin.png', // image used for overlay
   *       imageWidth: 36, // image width of overlay
   *       imageHeight: 58, // image height of overlay
   *     }
   *   };
   *   let marker = new TravelMarker(options);
   *   ```
   * @param {TravelMarkerOptions} options
   */
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
      this.playing = data.playing;
    });
  }

  /**
   * Get TravelMarkerOptions used at creation
   * ### Example
   * ```ts
   *  marker.getOptions();
   * ```
   * @returns {TravelMarkerOptions}
   */
  getOptions(): TravelMarkerOptions {
    return JSON.parse(JSON.stringify(this.options));
  }

  /**
   * Return Current position of the marker aa LatLng object.
   * ### Example
   * ```ts
   * marker.getPosition(); // returns LatLng object
   * ```
   * @returns {(LatLng)} returns LatLng object
   */
  public getPosition(): LatLng {
    return this.marker ? this.marker.getPosition() : null;
  }
  /**
   * Add Location points for animation
   * ### Example
   * ```ts
   * const locationArray = [new google.maps.Latlng(74,23), new google.maps.LatLng(74.02,23.02), new google.maps.LatLng(74.04, 23.04)];
   *
   * marker.addLocation(locationArray);
   * ```
   * @param {LatLng[]} [locationArray=[]]
   */
  public addLocation(locationArray: LatLng[] = []): void {
    locationArray.forEach(location => {
      if (location.lat && location.lng) {
        this.path.push(location);
      }
    });
    if (!this.marker && this.path.length) {
      if (this.options.markerType === 'default') {
        const markerOptions = Object.assign(this.options.markerOptions, { position: { lat: this.path[0].lat(), lng: this.path[0].lng() } });
        this.marker = new DefaultMarker(markerOptions, this.options.speed, this.options.interval, this.options.speedMultiplier,
           this.path, this.options.cameraOnMarker);
      } else if (this.options.markerType === 'overlay') {
        this.marker = new CustomOverlayMarker(this.options.map, this.options.overlayOptions,
           this.options.speed, this.options.interval, this.options.speedMultiplier, this.path, this.options.cameraOnMarker);
      } else {
        // TODO: Add symbol marker
      }
      this.setListener();
    } else if (this.marker) {
      this.marker.addLocation(locationArray);
    } else {
      console.error('Please insert valid location Array');
    }
  }
  /**
   * Play Animation
   * ### Example
   * ```ts
   *   marker.play();
   * ```
   */
  public play() {
    this.playing = true;
    this.marker.play();
  }
  /**
   * Pause Animation
   * ### Example
   * ```ts
   *   marker.pause();
   * ```
   */
  public pause() {
    this.playing = false;
    this.marker.pause();
  }
  /**
   * Reset marker to the starting point
   * ### Example
   * ```ts
   *   marker.reset();
   * ```
   */
  public reset() {
    this.playing = false;
    this.marker.reset();
  }
  /**
   * Go to next location
   * ### Example
   * ```ts
   *   marker.next();
   * ```
   */
  public next() {
    this.marker.next();
  }
  /**
   * Go to Previous location
   * ### Example
   * ```ts
   *   marker.prev();
   * ```
   */
  public prev() {
    this.marker.prev();
  }
  /**
   * Set Maker Update interval
   * ### Example
   * ```ts
   *   marker.setInterval(30);
   * ```
   * @param {number} [interval=this.options.interval]
   */
  public setInterval(interval: number = this.options.interval) {
    this.options.interval = interval;
    this.marker.setInterval(interval);
  }
  /**
   * Set speed multiplier to control animation speed
   * ### Example
   * Fast-Forward by 2X
   * ```ts
   * marker.setSpeedMultiplier(2);
   * ```
   *
   * Rewind/Slow by 0.5X
   * ```ts
   * marker.setSpeedMultiplier(0.5);
   * ```
   * @param {number} multiplier
   */
  public setSpeedMultiplier(multiplier: number) {
    this.options.speedMultiplier = multiplier;
    this.marker.setSpeedMultiplier(multiplier);
  }
  /**
   * Set Animation Speed
   * ### Example
   * ```ts
   *   marker.setSpeed(100);
   * ```
   * @param {number} [speed=this.options.speed]
   */
  public setSpeed(speed: number = this.options.speed) {
    this.options.speed = speed;
    this.marker.setSpeed(speed);
  }
  /**
   * Set Marker options like opacity etc. Only applicable for default marker types.
   * Returns false if not applicable
   *  ### Example
   * ```ts
   *  marker.setMarkerOptions({ opacity: 0.8 });
   * ```
   * @param {MarkerOptions} [options=this.options.markerOptions]
   * @returns {boolean}  returns false if not applicable
   */
  public setMarkerOptions(options: MarkerOptions = this.options.markerOptions): boolean {
    if (this.options.markerType === 'default') {
      this.options.markerOptions = Object.assign(this.options.markerOptions, options);
      this.marker.updateOptions(this.options.markerOptions);
      return true;
    } else {
      return false;
    }
  }
  /**
   * Set Overlay Options like offsets. Only applicable for overlay.
   * Returns false if not applicable
   * ### Example
   * ```ts
   *   marker.setOverlayOptions({ offsetAngle: 90 });
   * ```
   * @param {OverlayOptions} options  Overlay Options
   * @returns {boolean}  returns false if not applicable
   */
  public setOverlayOptions(options: any): boolean {
    if (this.options.markerType === 'overlay') {
      this.options.overlayOptions = Object.assign(this.options.overlayOptions, options);
      this.marker.updateOptions(this.options.overlayOptions);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Set map of marker. Useful for show/hide and deletion.
   * ### Example
   * ```ts
   *   marker.setMap(null);
   * ```
   * @param {GoogleMap} map
   */
  public setMap(map: GoogleMap) {
    this.marker.setMap(map);
  }

  /**
   * Add Listener to maker events like click, mouseover etc.
   *
   * ### Example - Listen for click events
   * ```ts
   * marker.addListener('click', () => {
   *     // do something...
   *   })
   * ```
   * @param {string} eventName - click,mousover,mouseout etc.
   * @param {Function} handler handler function
   */
  public addListener(eventName: string, handler: Function): any {
    if (!this.marker) {
      setTimeout(() => this.addListener(eventName, handler), 300);
    } else {
      this.marker.addListener(eventName, handler);
    }
  }

}
