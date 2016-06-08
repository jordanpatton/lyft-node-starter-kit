var gMap;
function onGoogleMapsResponse() {
  var gLatLng = new window.google.maps.LatLng(37.760516, -122.413126);
  gMap = new window.google.maps.Map(document.getElementById('map'), {
    center: gLatLng,
    zoom: 13
  });
  var gMarker = new window.google.maps.Marker({
      draggable: true,
      map: gMap,
      position: gLatLng,
      title: 'Pickup Location'
  });
};
