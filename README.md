# Travel Marker

A google maps library to replay gps locations.

# NOTE
### THIS IS AN ALPHA RELEASE AND API WILL CHANGE IN FUTURE. NOT SUITABLE FOR PRODUCTION PROJECTS.

## Features
- Play/Pause animation
- Compute intermediate gps points for smooth animation

## Installation
```
  npm install travel-marker
```

For browser

```
  <script src="https://unpkg.com/travel-marker/travel-marker.umd.js" async>

  var TravelMarker = travelmarker.TravelMarker;
```

## Usage

### Creating a marker

```
  // options
  var options = {
    map: map,  // map object
    speed: 15,  // default 10 , animation speed
    interval: 50, // default 10, marker refresh time
    markerOptions: { position: { lat: 72, lng: 21 }}, // default { position: { lat: 0, lng: 0 }}
  };
  var marker = new TravelMarker(options);
```

### Add locations
```
  var locationArray = [new google.maps.Latlng(74,23), new google.maps.LatLng(74.02,23.02), new google.maps.LatLng(74.04, 23.04)];
  marker.addLocations(locationArray);
```

### Play Animation
```
marker.play();
```

### Pause animation.
```
marker.pause();
```

## Todo
- [ ] Add listeners to marker
- [ ] Implement next() and prev()
- [ ] Custom events for play, pause, finished, arrived
- [ ] Add custom overlay markers with rotation
