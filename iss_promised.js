const request = require('request-promise-native');

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = (ip) => {
  let myIP = JSON.parse(ip).ip;
  return request(`https://freegeoip.app/json/${myIP}`);
};

const fetchISSFlyOverTimes = coordsFromIP => {
  let {latitude, longitude} = JSON.parse(coordsFromIP);
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`);
};

module.exports = { nextISSTimesForMyLocation };