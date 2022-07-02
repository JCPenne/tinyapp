const { assert } = require('chai');

const { userChecker } = require('../helpers.js');

const testUsers = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = userChecker(testUsers, 'email', 'user@example.com').user;
    const expectedUserID = 'userRandomID';
    assert.strictEqual(user, expectedUserID);
  });
  it(`should return undefined with an invalid email`, () => {
    const user = userChecker(testUsers, 'email', 'user3@example.com').user;
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });
});
