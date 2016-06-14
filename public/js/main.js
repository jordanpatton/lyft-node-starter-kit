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
  var logElement = document.getElementById('logTarget');


  /*=====================*/
  /* Convenience Methods */
  /*=====================*/

  function log() {
    /* log to browser console */
    if (console && console.log) {console.log.apply(console, arguments);}
    /* log to app console */
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0, l = args.length; i < l; i++) {
      logElement.value = logElement.value + (logElement.value.length ? '\n' : '') + args[i];
      logElement.scrollTop = logElement.scrollHeight;
    }
  }

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

  function getApiStatus(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        log('local server status: ' + responseJson.status + ' @ ' + responseJson.timestamp);
      }
    });
    xhr.open('GET', '/api/status', true);
    xhr.send();
  }

  function getApiLyftEta(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        for (var i = 0, l = responseJson.eta_estimates.length; i < l; i++) {
          log(responseJson.eta_estimates[i].display_name + ': ' + responseJson.eta_estimates[i].eta_seconds + ' seconds');
        }
      }
    });
    xhr.open('GET', '/api/lyft/eta?lat='+locationBeginMarker.position.lat()+'&lng='+locationBeginMarker.position.lng(), true);
    xhr.send();
  }

  function getApiLyftProfile(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        log('id: ' + responseJson.id);
      }
    });
    xhr.open('GET', '/api/lyft/profile', true);
    xhr.send();
  }

  function getApiLyftRides(callback) {
    var start_time = (new Date(Date.now() - (30 * 24 * 60 * 60 * 1000))).toISOString();
    var end_time = (new Date()).toISOString();
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        for (var i = 0, l = responseJson.ride_history.length; i < l; i++) {
          log(responseJson.ride_history[i].ride_id + ': ' + responseJson.ride_history[i].status);
        }
      }
    });
    xhr.open('GET', '/api/lyft/rides?start_time='+start_time+'&end_time='+end_time, true);
    xhr.send();
  }

  function getApiLyftStatus(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        log('remote server status: ' + responseJson.status + ' @ ' + responseJson.timestamp);
      }
    });
    xhr.open('GET', '/api/lyft/status', true);
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
        log('onChangeLocationBeginElement:forwardGeocode failed', results, status);
      }
    });
  }

  function onChangeLocationEndElement(event) {
    forwardGeocode(event.target.value, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationEndMarker.setPosition(new window.google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
      } else {
        log('onChangeLocationEndElement:forwardGeocode failed', results, status);
      }
    });
  }

  function onChangeLocationBeginMarker(event) {
    reverseGeocode(event.latLng.lat(), event.latLng.lng(), function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationBeginElement.value = results[0].formatted_address;
      } else {
        log('onChangeLocationBeginMarker:reverseGeocode failed', results, status);
      }
    });
  }

  function onChangeLocationEndMarker(event) {
    reverseGeocode(event.latLng.lat(), event.latLng.lng(), function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK && results.length) {
        locationEndElement.value = results[0].formatted_address;
      } else {
        log('onChangeLocationEndMarker:reverseGeocode failed', results, status);
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
    getApiStatus:                 getApiStatus,
    getApiLyftEta:                getApiLyftEta,
    getApiLyftProfile:            getApiLyftProfile,
    getApiLyftRides:              getApiLyftRides,
    getApiLyftStatus:             getApiLyftStatus,
    onChangeLocationBeginElement: onChangeLocationBeginElement,
    onChangeLocationEndElement:   onChangeLocationEndElement,
    onGoogleMapsResponse:         onGoogleMapsResponse
  };

})(window, window.document);
