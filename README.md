# Travel Marker

A google maps library to replay gps locations.

# NOTE
### THIS IS AN ALPHA RELEASE AND API WILL CHANGE IN FUTURE. NOT SUITABLE FOR PRODUCTION PROJECTS.

## Features
- Play/Pause animation
- Compute intermediate gps points for smooth animation

## Demo

### Browser

[Codepen](https://codepen.io/manpreetsingh80/pen/aEpzjB)

### Angular

[Stackblitz](https://stackblitz.com/edit/travel-marker-angular-agm)

## Installation
```bash
  npm install travel-marker
```

For browser

```typescript
  <script src="https://unpkg.com/travel-marker/dist/travel-marker.umd.js" async>

  var TravelMarker = travelMarker.TravelMarker;
```

## Usage

### Creating a marker

```typescript
  // options
  var options = {
    map: map,  // map object
    speed: 15,  // default 10 , animation speed
    interval: 50, // default 10, marker refresh time
    markerType: 'default',  // default: 'default'
    markerOptions: { title: "Travel Marker" }
  };
  var marker = new TravelMarker(options);
```

### Creating an overlay marker

```typescript
  // options
  var options = {
    map: map,  // map object
    speed: 15,  // default 10 , animation speed
    interval: 50, // default 10, marker refresh time
    markerType: 'overlay',  // default: 'default'
    overlayOptions: {
      offsetX: 0, // default: 0, x-offset for overlay
      offsetY: 0, // default: 0, y-offset for overlay
      offsetAngle: 0, // default: 0, rotation-offset for overlay
      imageUrl: 'https://i.stack.imgur.com/lDrin.png', // image used for overlay
      imageWidth: 36, // image width of overlay
      imageHeight: 58, // image height of overlay
    }
  };
  var marker = new TravelMarker(options);
```

### Add locations
```typescript
  var locationArray = [new google.maps.Latlng(74,23), new google.maps.LatLng(74.02,23.02), new google.maps.LatLng(74.04, 23.04)];
  marker.addLocations(locationArray);
```

### Play Animation
```typescript
marker.play();
```

### Pause animation.
```typescript
marker.pause();
```

### Reset animation
```typescript
marker.reset();
```

### Jump to next location
```typescript
marker.next();
```

### Jump to previous location
```typescript
marker.prev();
```

### Set Speed
```typescript
marker.setSpeed(50);
```

### Set Interval
```typescript
marker.setInterval(20);
```

### Set Animation multiplier to fast-forward/slow replay
```typescript
marker.setSpeedMultiplier(2); // for 2x fast-forward
marker.setSpeedMultiplier(0.5); // for slow replay
```

### Add Listener to marker like click,mouseover etc.
```typescript
marker.addListener('click', function() {
  //  ...do something like show infobox
});
```

### Listen Events
```typescript
/*  EventType = 'play' | 'paused' | 'finished' | 'reset' | 'checkpoint'; 
    // checkpoint - when marker arrives on a location present in locationArray
    TravelData = {
      location: LatLng; // marker current location
      playing: boolean; // is animation playing?
      index: number;  // index in locationArray
      status: 'reset' | 'playing' | 'paused' | 'finished';  // animation status
    }
*/
marker.event.onEvent((event: EventType, data: TravelData) => {
  // .... do something
});
```

### Set Map on marker
```typescript
marker.setMap(null);  // hide marker from map
```

### Set MarkerOptions
```typescript
marker.setMarkerOptions({ opacity: 0.8 });
```

### Set Overlay Options
```typescript
marker.setOverlayOptions({ offsetAngle: 90 });
```

## Todo
- [x] Add listeners to marker like click,hover etc.
- [x] Add Examples
- [x] Implement setMarkerOptions() and setOverlayOptions()
- [x] Add jsdoc
- [x] Custom events for play, pause, finished, checkpoint
- [x] Add custom overlay markers with rotation
- [ ] Add images
- [ ] Write test cases
