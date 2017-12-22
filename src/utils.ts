export const latlngDistance = function(p1, p2): number {
  const EarthRadiusMeters = 6378137.0; // meters
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
  const angle = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * Math.PI / 180 ) * Math.cos(p2.lat * Math.PI / 180 ) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
  const distance = EarthRadiusMeters * c;
  return distance;
};

export const getAngle = function(p1, p2): number {
  const f1 = Math.PI * p1.lat() / 180;
  const f2 = Math.PI * p2.lat() / 180;
  const dl = Math.PI * (p2.lng() - p1.lng()) / 180;
  return Math.atan2(Math.sin(dl) * Math.cos(f2) , Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl));
};
