var xhr = new XMLHttpRequest();
var gMap;
var gMarkerBegin;
var gMarkerEnd;

function getCurrentPosition(successCallback, failureCallback) {
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(successCallback, failureCallback);
    return true;
  } else {
    return false;
  }
}

function initializeMap(lat, lng, element) {
  var gLatLng = new window.google.maps.LatLng(lat, lng);
  return new window.google.maps.Map(element, {
    center: gLatLng,
    zoom: 13
  });
}

function initializeMarker(lat, lng, map, label, title) {
  var gLatLng = new window.google.maps.LatLng(lat, lng);
  return new window.google.maps.Marker({
    draggable: true,
    label: label,
    map: map,
    position: gLatLng,
    title: title
  });
}

function onGoogleMapsResponse() {
  /* attempt automatic geolocation */
  getCurrentPosition(
    /* use detected location */
    function success(result) {
      gMap = initializeMap(result.coords.latitude, result.coords.longitude, window.document.getElementById('map'));
      gMarkerBegin = initializeMarker(result.coords.latitude, result.coords.longitude, gMap, 'A', 'Pick Up Location');
      window.google.maps.event.addListener(gMarkerBegin, 'dragend', function (event) {
        console.log('gMarkerBegin:dragend:lat', event.latLng.lat());
        console.log('gMarkerBegin:dragend:lng', event.latLng.lng());
      });
    },
    /* use default location */
    function failure() {
      gMap = initializeMap(37.760516, -122.413126, window.document.getElementById('map'));
      gMarkerBegin = initializeMarker(37.760516, -122.413126, gMap, 'A', 'Pick Up Location');
    }
  );
}
