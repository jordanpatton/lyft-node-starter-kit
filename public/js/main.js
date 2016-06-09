var xhr = new XMLHttpRequest();
var gMap;
var gMarkerBegin;
var gMarkerEnd;


//=====================//
// Convenience Methods //
//=====================//

function getCurrentPosition(successCallback, failureCallback) {
  if (window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(successCallback, failureCallback);
    return true;
  } else {
    return false;
  }
}

function reverseGeocode(lat, lng, callback) {
  var payload = {location: {lat: lat, lng: lng}};
  var geocoder = new window.google.maps.Geocoder();
  geocoder.geocode(payload, callback);
}


//=============//
// Map Methods //
//=============//

function initializeMap(lat, lng, element) {
  var gLatLng = new window.google.maps.LatLng(lat, lng);
  return new window.google.maps.Map(element, {
    center: gLatLng,
    mapTypeControl: false,
    signInControl: false,
    streetViewControl: false,
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

function onMarkerBeginUpdate(event) {
  reverseGeocode(event.latLng.lat(), event.latLng.lng(), function (results, status) {
    if (status === window.google.maps.GeocoderStatus.OK && results.length) {
      window.document.getElementById('locationBegin').value = results[0].formatted_address;
    } else {
      console.log('Failed to reverseGeocode:', lat, lng);
    }
  });
}

function onGoogleMapsResponse() {
  /* attempt automatic geolocation */
  getCurrentPosition(
    /* use detected location */
    function success(result) {
      gMap = initializeMap(result.coords.latitude, result.coords.longitude, window.document.getElementById('map'));
      gMarkerBegin = initializeMarker(result.coords.latitude, result.coords.longitude, gMap, 'A', 'Pick Up Location');
      window.google.maps.event.addListener(gMarkerBegin, 'dragend', onMarkerBeginUpdate);
    },
    /* use default location */
    function failure() {
      gMap = initializeMap(37.760516, -122.413126, window.document.getElementById('map'));
      gMarkerBegin = initializeMarker(37.760516, -122.413126, gMap, 'A', 'Pick Up Location');
    }
  );
}
