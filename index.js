// index.js
const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

fetchCoordsByIP('207.81.125.54', (error, data) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log("It worked. Returned coordinates: ", data);
});
