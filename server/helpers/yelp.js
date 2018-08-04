const axios = require('axios');

let YELP_API_KEY;
try {
  YELP_API_KEY = require('../../config.js').YELPAPI;
} catch (err) {
  YELP_API_KEY = process.env.YELP_API_KEY;
}

let options = {
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`
  }
};

let getClosestWithinRadius = (loc, radius) => {
  // See https://www.yelp.com/developers/documentation/v3/business_search for more info
  options.params = {
    term: 'study spots',
    radius: radius,
    location: loc,
    sort_by: 'distance'
  };

  return axios
    .get(`https://api.yelp.com/v3/businesses/search`, options)
    .catch((err) => {
      console.log(err);
    });
};

let getAdditionalPics = (locId) => {
  // See https://www.yelp.com/developers/documentation/v3/business for more info
  return axios
    .get(`https://api.yelp.com/v3/businesses/${locId}`, options)
    .catch((err) => {
      console.log({
        err
      });
    });
};

module.exports.getClosestWithinRadius = getClosestWithinRadius;
module.exports.getAdditionalPics = getAdditionalPics;
