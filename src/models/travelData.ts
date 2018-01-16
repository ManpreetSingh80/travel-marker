import { LatLng } from './index';

export interface TravelData {
  location: LatLng;
  playing: boolean;
  index: number;
  status: 'reset' | 'playing' | 'paused' | 'finished';
}
