/**
 * App Component
 */
window.AppComponent = (function (window, document, log) {

  /*============*/
  /* Properties */
  /*============*/

  /* none at this time */


  /*=============*/
  /* API Methods */
  /*=============*/

  function getApiStatus(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        log('local server status: ' + responseJson.status + ' @ ' + responseJson.meta.timestamp);
      }
    });
    xhr.open('GET', '/api/status', true);
    xhr.send();
  }

  function getApiUsers(callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        for (var i = 0, l = responseJson.users.length; i < l; i++) {
          log('hasLyftAuthorizationCode: ' + responseJson.users[i].hasLyftAuthorizationCode);
          log('lyftStatus: ' + responseJson.users[i].lyftStatus);
        }
      }
    });
    xhr.open('GET', '/api/users', true);
    xhr.send();
  }


  /*==================*/
  /* Lyft API Methods */
  /*==================*/

  function getApiLyftDrivers(latitude, longitude, callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        console.log(responseJson);
        for (var i = 0, l = responseJson.nearby_drivers.length; i < l; i++) {
          log(responseJson.nearby_drivers[i].ride_type + ': ' + responseJson.nearby_drivers[i].drivers.length + ' drivers');
        }
      }
    });
    xhr.open('GET', '/api/lyft/drivers?lat='+latitude+'&lng='+longitude, true);
    xhr.send();
  }

  function getApiLyftEta(latitude, longitude, callback) {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = (typeof callback === 'function') ? callback : (function (event) {
      if (event.target.readyState === 4) {
        responseJson = window.JSON.parse(event.target.response);
        for (var i = 0, l = responseJson.eta_estimates.length; i < l; i++) {
          log(responseJson.eta_estimates[i].display_name + ': ' + responseJson.eta_estimates[i].eta_seconds + ' seconds');
        }
      }
    });
    xhr.open('GET', '/api/lyft/eta?lat='+latitude+'&lng='+longitude, true);
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
        log('remote server status: ' + responseJson.status + ' @ ' + responseJson.meta.timestamp);
      }
    });
    xhr.open('GET', '/api/lyft/status', true);
    xhr.send();
  }


  /*=======================================*/
  /* Publicly-Exposed Properties & Methods */
  /*=======================================*/

  return {
    getApiStatus:      getApiStatus,
    getApiUsers:       getApiUsers,
    getApiLyftDrivers: getApiLyftDrivers,
    getApiLyftEta:     getApiLyftEta,
    getApiLyftProfile: getApiLyftProfile,
    getApiLyftRides:   getApiLyftRides,
    getApiLyftStatus:  getApiLyftStatus
  };

})(window, window.document, (window.LogComponent ? window.LogComponent.log : console.log));
