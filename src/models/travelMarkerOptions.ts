import { MarkerOptions, Polyline, GoogleMap } from './google-map-types';

export interface TravelMarkerOptions {
  map: GoogleMap | null;
  speed?: number;
  interval?: number;
  speedMultiplier?: number;
  cameraOnMarker?: boolean;
  markerType?: 'default' | 'symbol' | 'overlay';
  markerOptions?: MarkerOptions;
  overlayOptions?: {
    offsetX?: number;
    offsetY?: number;
    offsetAngle?: number;
    imageUrl?: string;
    imageWidth?: number,
    imageHeight?: number
  };
  line?: Polyline | null;
}
