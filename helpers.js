const generateRandomString = URL => {
  result = '';

  for (let i = 0; i < 6; i++) {
    result += Math.random().toString(36).slice(-1);
  }

  return result;
};

const userChecker = (data, key, value) => {
  const users = data
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
