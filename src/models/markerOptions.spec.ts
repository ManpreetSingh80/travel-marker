// Add spec suffix to models used in testing to exclude from docs
// export class DefaultMarker {
//   name: string;
//   constructor(name: string) {
//     this.name = name;
//   }
import { TravelMarkerOptions } from '../travel-marker';
declare var google: any;

export const defaultMarkerOptions: TravelMarkerOptions =  {
  map: google.map,
  speed: 10,
  interval: 300,
  markerType: 'default',
  markerOptions: {
    position: { lat: 0, lng: 0 }
  },
};
