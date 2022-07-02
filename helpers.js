/**
 * Return a 6 character random string to create the TinyURL hyperlink
 * @param {String}
 * @returns {String}
 */

const generateRandomString = () => {
  result = '';

  for (let i = 0; i < 6; i++) {
    result += Math.random().toString(36).slice(-1);
  }

  return result;
};

/**
 * Return an object showing whether a user exists within the database, based on dynamic values, using a boolean value.
 * @param {Object} data
 * @param {String} key
 * @param {String} value
 * @returns {Object}
 */

const userChecker = (data, key, value) => {
  const users = data;

  let resultObj = {
    result: false,
  };

  for (let user in users) {
    let currentKey = users[user][key];

    if (value === currentKey) {
      resultObj = {
        user,
        result: true,
      };
    }
  }
  return resultObj;
};

/**
 * Return an object showing whether a URL in the database belongs to the current user.
 * @param {Object} obj
 * @param {String} user
 * @returns {Object}
 */

const URLChecker = (obj, user) => {
  let result = {};

  for (entry in obj) {
    userID = obj[entry].userID;
    if (userID === user) {
      result[entry] = obj[entry];
    }
  }
  return result;
};

module.exports = { generateRandomString, userChecker, URLChecker };
