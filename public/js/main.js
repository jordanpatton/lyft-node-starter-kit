/**
 * Immediately-Invoked Function Expression
 */
window.app = (function (window, document) {

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
  /* API Methods */
  /*=============*/

  function getLocalServerStatus(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        console.log('local server status', window.JSON.parse(event.target.response));
      }
    });
    xhr.open('GET', '/api/status', true);
    xhr.send();
  }

  function getRemoteServerStatus(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        console.log('remote server status', window.JSON.parse(event.target.response));
      }
    });
    xhr.open('GET', '/api/lyft/status', true);
    xhr.send();
  }

  function getLyftEta(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        console.log('lyft eta', window.JSON.parse(event.target.response));
      }
    });
    xhr.open('GET', '/api/lyft/eta?lat='+locationBeginMarker.position.lat()+'&lng='+locationBeginMarker.position.lng(), true);
    xhr.send();
  }


  /*=============*/
  /* Map Methods */
  /*=============*/

  function initializeMap(latitude, longitude, element) {
    return new window.google.maps.Map(element, {
      center: (new window.google.maps.LatLng(latitude, longitude)),
      mapTypeControl: false,
      signInControl: false,
      streetViewControl: false,
      zoom: 13
    });
  }

  function initializeMarker(latitude, longitude, map, label, title) {
    return new window.google.maps.Marker({
      draggable: true,
      label: label,
      map: map,
      position: (new window.google.maps.LatLng(latitude, longitude)),
      title: title
    });
  }


  /*================*/
  /* Event Handlers */
  /*================*/

  function onChangeLocationBeginElement(event) {
    forwardGeocode(event.target.value, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationBeginMarker.setPosition(new window.google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
      } else {
        console.log('onChangeLocationBeginElement:forwardGeocode failed', results, status);
      }
    });
  }

  function onChangeLocationEndElement(event) {
    forwardGeocode(event.target.value, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationEndMarker.setPosition(new window.google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
      } else {
        console.log('onChangeLocationEndElement:forwardGeocode failed', results, status);
      }
    });
  }

  function onChangeLocationBeginMarker(event) {
    reverseGeocode(event.latLng.lat(), event.latLng.lng(), function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationBeginElement.value = results[0].formatted_address;
      } else {
        console.log('onChangeLocationBeginMarker:reverseGeocode failed', results, status);
      }
    });
  }

  function onChangeLocationEndMarker(event) {
    reverseGeocode(event.latLng.lat(), event.latLng.lng(), function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationEndElement.value = results[0].formatted_address;
      } else {
        console.log('onChangeLocationEndMarker:reverseGeocode failed', results, status);
      }
    });
  }

  function __onGoogleMapsResponseHelper(latitude, longitude) {
    /* initialize mapObject & mapElement */
    mapObject = initializeMap(latitude, longitude, mapElement);
    /* initialize locationBeginMarker & locationBeginElement */
    locationBeginMarker = initializeMarker(latitude, longitude, mapObject, 'A', 'Pick Up Location');
    window.google.maps.event.addListener(locationBeginMarker, 'dragend', onChangeLocationBeginMarker);
    window.google.maps.event.trigger(locationBeginMarker, 'dragend', {
      latLng: {lat: function () {return latitude;}, lng: function () {return longitude;}}
    });
    /* initialize locationEndMarker & locationEndElement */
    locationEndMarker = initializeMarker(latitude, longitude, mapObject, 'B', 'Drop Off Location');
    window.google.maps.event.addListener(locationEndMarker, 'dragend', onChangeLocationEndMarker);
    window.google.maps.event.trigger(locationEndMarker, 'dragend', {
      latLng: {lat: function () {return latitude;}, lng: function () {return longitude;}}
    });
  }
  function onGoogleMapsResponse() {
    /* attempt automatic geolocation */
    getCurrentPosition(
      /* use detected location */
      function success(result) {__onGoogleMapsResponseHelper(result.coords.latitude, result.coords.longitude);},
      /* use default location */
      function failure() {__onGoogleMapsResponseHelper(defaultLatitude, defaultLongitude);}
    );
  }


  /*=======================================*/
  /* Publicly-Exposed Properties & Methods */
  /*=======================================*/

  return {
    getLocalServerStatus:         getLocalServerStatus,
    getRemoteServerStatus:        getRemoteServerStatus,
    getLyftEta:                   getLyftEta,
    onChangeLocationBeginElement: onChangeLocationBeginElement,
    onChangeLocationEndElement:   onChangeLocationEndElement,
    onGoogleMapsResponse:         onGoogleMapsResponse
  };

})(window, window.document);
