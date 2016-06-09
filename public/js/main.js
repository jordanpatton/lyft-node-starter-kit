/**
 * Immediately-Invoked Function Expression
 */
var app = (function (window, document) {

  /*============*/
  /* Properties */
  /*============*/

  var defaultLatitude = 37.760516;
  var defaultLongitude = -122.413126;
  var mapElement = document.getElementById('map');
  var mapObject;
  var locationBeginElement = document.getElementById('locationBegin');
  var locationBeginMarker;
  var locationEndElement = document.getElementById('locationEnd');
  var locationEndMarker;


  /*=====================*/
  /* Convenience Methods */
  /*=====================*/

  function getCurrentPosition(successCallback, failureCallback) {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(successCallback, failureCallback);
      return true;
    } else {
      return false;
    }
  }

  function forwardGeocode(address, callback) {
    var geocoder = new window.google.maps.Geocoder();
    var payload = {address: address};
    geocoder.geocode(payload, callback);
  }

  function reverseGeocode(latitude, longitude, callback) {
    var geocoder = new window.google.maps.Geocoder();
    var payload = {location: {lat: latitude, lng: longitude}};
    geocoder.geocode(payload, callback);
  }


  /*=============*/
  /* Map Methods */
  /*=============*/

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


  /*================*/
  /* Event Handlers */
  /*================*/

  function onChangeLocationBegin(event) {
    forwardGeocode(event.target.value, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationBeginMarker.setPosition(new window.google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
      } else {
        console.log('onChangeLocationBegin:forwardGeocode failed', results, status);
      }
    });
  }

  function onChangeLocationEnd(event) {
    console.log('onChangeLocationEnd', event.target.value);
  }

  function onChangeMarkerBegin(event) {
    reverseGeocode(event.latLng.lat(), event.latLng.lng(), function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationBeginElement.value = results[0].formatted_address;
      } else {
        console.log('onChangeMarkerBegin:reverseGeocode failed', results, status);
      }
    });
  }

  function onChangeMarkerEnd(event) {
    reverseGeocode(event.latLng.lat(), event.latLng.lng(), function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationEndElement.value = results[0].formatted_address;
      } else {
        console.log('onChangeMarkerEnd:reverseGeocode failed', results, status);
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
        window.google.maps.event.addListener(locationBeginMarker, 'dragend', onChangeMarkerBegin);
      },
      /* use default location */
      function failure() {
        mapObject = initializeMap(defaultLatitude, defaultLongitude, mapElement);
        locationBeginMarker = initializeMarker(defaultLatitude, defaultLongitude, mapObject, 'A', 'Pick Up Location');
        window.google.maps.event.addListener(locationBeginMarker, 'dragend', onChangeMarkerBegin);
      }
    );
  }

  return {
    onChangeLocationBegin: onChangeLocationBegin,
    onChangeLocationEnd:   onChangeLocationEnd,
    onChangeMarkerBegin:   onChangeMarkerBegin,
    onChangeMarkerEnd:     onChangeMarkerEnd,
    onGoogleMapsResponse:  onGoogleMapsResponse
  };

})(window, window.document);
