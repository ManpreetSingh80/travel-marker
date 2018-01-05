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
    markerOptions: { title: "Travel Marker" }
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
})
```

## Todo
- [ ] Add listeners to marker like click,hover etc.
- [x] Add Examples
- [ ] Implement setOptions()
- [ ] Add jsdoc
- [x] Custom events for play, pause, finished, checkpoint
- [ ] Add custom overlay markers with rotation
