import { TravelMarker, TravelMarkerOptions } from './travel-marker';
import { defaultMarkerOptions } from './models/markerOptions.spec';

/**
 * TravelMarker test
 */
describe('TravelMarker test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('travelmarkerClass is instantiable with default marker type', () => {
    expect(new TravelMarker(defaultMarkerOptions)).toBeInstanceOf(TravelMarker);
  });
});
