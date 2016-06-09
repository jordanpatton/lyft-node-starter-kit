var defaultLatitude = 37.760516;
var defaultLongitude = -122.413126;
var mapElement = window.document.getElementById('map');
var mapObject;
var locationBeginElement = window.document.getElementById('locationBegin');
var locationBeginMarker;
var locationEndElement = window.document.getElementById('locationEnd');
var locationEndMarker;


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
  return new window.google.maps.Map(element, {
    center: (new window.google.maps.LatLng(lat, lng)),
    mapTypeControl: false,
    signInControl: false,
    streetViewControl: false,
    zoom: 13
  });
}

function initializeMarker(lat, lng, map, label, title) {
  return new window.google.maps.Marker({
    draggable: true,
    label: label,
    map: map,
    position: (new window.google.maps.LatLng(lat, lng)),
    title: title
  });
}

function onMarkerBeginUpdate(event) {
  reverseGeocode(event.latLng.lat(), event.latLng.lng(), function (results, status) {
    if (status === window.google.maps.GeocoderStatus.OK && results.length) {
      locationBeginElement.value = results[0].formatted_address;
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
      mapObject = initializeMap(result.coords.latitude, result.coords.longitude, mapElement);
      locationBeginMarker = initializeMarker(result.coords.latitude, result.coords.longitude, mapObject, 'A', 'Pick Up Location');
      window.google.maps.event.addListener(locationBeginMarker, 'dragend', onMarkerBeginUpdate);
    },
    /* use default location */
    function failure() {
      mapObject = initializeMap(defaultLatitude, defaultLongitude, mapElement);
      locationBeginMarker = initializeMarker(defaultLatitude, defaultLongitude, mapObject, 'A', 'Pick Up Location');
      window.google.maps.event.addListener(locationBeginMarker, 'dragend', onMarkerBeginUpdate);
    }
  );
}
