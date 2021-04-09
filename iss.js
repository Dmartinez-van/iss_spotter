const request = require('request');

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }

    fetchCoordsByIP(ip, (error, myCoords) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }

      fetchISSFlyOverTimes(myCoords, (error, passes) => {
        if (error) {
          console.log("It didn't work!" , error);
          return;
        }
      
        callback(null, passes);
      });
    });
  });
};

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    callback(error, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (response.statusCode === 404) {
      const msg = `Status code ${response.statusCode}, PAGE NOT FOUND`;
      callback(Error(msg), null);
      return;
    }

    const coords = {
      lat: JSON.parse(body).latitude,
      long: JSON.parse(body).longitude
    };

    callback(error, coords);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.long}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (response.statusCode === 404) {
      const msg = `Status code ${response.statusCode}, PAGE NOT FOUND`;
      callback(Error(msg), null);
      return;
    }

    const flyBys = JSON.parse(body).response;
    callback(error, flyBys);
  });
};

module.exports = { nextISSTimesForMyLocation };