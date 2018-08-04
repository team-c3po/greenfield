const bcrypt = require('bcrypt-nodejs');
const db = require('../db_config.js');

let saveSpots = function(studySpotList) {
  db.getConnection((err, conn) => {
    for (let spot = 0; spot < studySpotList.length; spot++) {
      var currSpot = studySpotList[spot];
      var command = `INSERT INTO locations (id, name, city, state, address) VALUES (?, ?, ?, ?, ?)`;
      var params = [
        currSpot.id,
        currSpot.name,
        currSpot.location.city,
        currSpot.location.state,
        currSpot.location.address1
      ];

      conn.query(command, params, (err, result) => {
        if (err) {
          console.error('Error inserting locations into mySQL');
        } else {
          console.log('Inserted locations into mySQL');
        }
      });
    }

    conn.release();
  });
};

let getRelevantFirst = function(
  studySpotList,
  coffeeMult,
  atmosphereMult,
  comfortMult,
  foodMult,
  cb
) {
  var spotArr = [];
  var spotsWithReviews = [];
  var spotsWithoutReviews = [];
  var results = { businesses: [] };
  let count = 0;
  db.getConnection((err, conn) => {
    for (let spot = 0; spot < studySpotList.length; spot++) {
      conn.query(
        `SELECT AVG(coffeeTea) AS coffeeTea, AVG(atmosphere) AS atmosphere, AVG(comfort) AS comfort, AVG(food) AS food 
        FROM ratings 
        WHERE location=?`,
        studySpotList[spot]['id'],
        (err, result) => {
          let finalScore = 0;
          var resultObj = JSON.parse(JSON.stringify(result))[0];
          if (err) {
            cb(err);
          } else if (resultObj['coffeeTea'] !== null) {
            finalScore =
              resultObj['coffeeTea'] * coffeeMult +
              resultObj['atmosphere'] * atmosphereMult +
              resultObj['comfort'] * comfortMult +
              resultObj['food'] * foodMult;
          }
          spotArr.push([finalScore, studySpotList[spot]]);
          count++;
          if (count === studySpotList.length) {
            spotArr.forEach((pair) => {
              if (pair[0] > 0) {
                spotsWithReviews.push(pair);
              } else {
                spotsWithoutReviews.push(pair);
              }
            });
            spotsWithReviews.sort((a, b) => {
              return b[0] - a[0];
            });
            spotsWithReviews.forEach((pair) => {
              results['businesses'].push(pair[1]);
            });
            spotsWithoutReviews.forEach((pair) => {
              results['businesses'].push(pair[1]);
            });
            cb(null, results);
          }
        }
      );
    }
    conn.release();
  });
};

let getAveragesAndReviewCount = function({ location_id }, cb) {
  db.getConnection((err, conn) => {
    conn.query(
      `SELECT AVG(coffeeTea) AS coffeeTea, AVG(atmosphere) AS atmosphere, AVG(comfort) AS comfort, AVG(food) AS food, COUNT(id) as count
        FROM ratings
        WHERE location=?`,
      location_id,
      (err, result) => {
        if (err) {
          cb(err);
        } else {
          cb(null, JSON.parse(JSON.stringify(result)));
        }
      }
    );

    conn.release();
  });
};

let login = function({ username }, cb) {
  db.getConnection((err, conn) => {
    conn.query(
      `SELECT id, password FROM users WHERE username=?`,
      username,
      (err, result) => {
        if (!result.length) {
          cb('Wrong');
        } else {
          console.log('Found user', result);
          // Return user id
          cb(null, result);
        }
      }
    );

    conn.release();
  });
};

let register = function({ username, password, creditCard }, cb) {

  bcrypt.hash(password, null, null, (err, hash) => {
    if (err) {
      console.error('Error hashing password', err);
    } else {
      var creditCardJSON = JSON.stringify (creditCardJSON)
      var params = [username, hash, creditCardJSON];
      
      db.getConnection((err, conn) => {
        conn.query(
          `INSERT INTO users (username, password, creditCard) VALUES (?, ?, ?)`,

          params,
          (err, result) => {
            if (err) {
              cb(err);
            } else {
              console.log('Registered', result);
              // Return user id
              cb(null, result);
            }
          }
        );

        conn.release();
      });
    }
  });
};

let addRating = function(
  { user_id, location_id, coffeeTea, atmosphere, comfort, food },
  cb
) {
  var command = `INSERT INTO ratings (coffeeTea, atmosphere, comfort, food, location, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
  var params = [coffeeTea, atmosphere, comfort, food, location_id, user_id];

  db.getConnection((err, conn) => {
    conn.query(command, params, (err, results) => {
      if (err) {
        console.error('Error inserting ratings', err);
      } else {
        console.log('Inserted ratings', results);
        cb(null, results);
      }
    });
    conn.release();
  });
};

let getRating = function({ location_id }, cb) {
  var command = `SELECT coffeeTea, atmosphere, comfort, food
                 FROM ratings
                 JOIN locations ON ratings.location=locations.id
                 WHERE locations.id=?`;

  db.getConnection((err, conn) => {
    conn.query(command, location_id, (err, results) => {
      if (err) {
        console.error('Error getting location ratings', location_id, err);
      } else {
        console.log('Retrieved all location ratings', results);
        // Return location ratings for use in cb
        cb(null, results);
      }
    });

    conn.release();
  });
};

let addFavorite = function({ user_id, location_id }, cb) {
  var params = [user_id, location_id];
  db.getConnection((err, conn) => {
    conn.query(
      `INSERT INTO users_locations VALUES (?, ?)`,
      params,
      (err, results) => {
        if (err) {
          console.log('Error inserting into favorites', err);
        } else {
          console.log('Inserted into favorites', results);
          cb(null, results);
        }
      }
    );
    conn.release();
  });
};

let getFavorite = function(user_id, cb) {
  var command = `SELECT id, name, city, state, address, image1, image2, image3
                 FROM locations
                 JOIN users_locations ON locations.id=users_locations.location_id
                 WHERE users_locations.user_id=${user_id}`;

  db.getConnection((err, conn) => {
    conn.query(command, (err, results) => {
      if (err) {
        console.error('Error getting user favorites', err);
      } else {
        console.log('Retrieved all user favorites', results);
        // Return user favorites for use in cb
        cb(null, results);
      }
    });

    conn.release();
  });
};

let addComment = function({ user_id, location_id, text }, cb) {
  var params = [text, user_id, location_id];

  db.getConnection((err, conn) => {
    conn.query(
      `INSERT INTO comments (text, user_id, location) VALUES (?, ?, ?)`,
      params,
      (err, results) => {
        if (err) {
          console.error('Error inserting comment', err);
        } else {
          console.log('Inserted comment', results);
          cb(null, results);
        }
      }
    );
    conn.release();
  });
};

let getComment = function({ location_id }, cb) {
  var command = `SELECT text, user_id
                 FROM comments
                 JOIN locations ON comments.location=locations.id
                 WHERE locations.id=?`;
  db.getConnection((err, conn) => {
    conn.query(command, location_id, (err, results) => {
      if (err) {
        console.error('Error getting location comments', err);
      } else {
        console.log('Retrieved all location comments', results);
        // Returns location comments for use in cb
        cb(null, results);
      }
    });

    conn.release();
  });
};

let addPics = function({ pics, location_id }, cb) {
  var params = [pics[0], pics[1], pics[2], location_id];
  var command = `UPDATE locations
                 SET image1=?, image2=?, image3=?
                 WHERE id=?`;
  db.getConnection((err, conn) => {
    conn.query(command, params, (err, results) => {
      if (err) {
        console.error('Error posting pics to db', err);
      } else {
        console.log('Posted pics to db', results);
        cb(null, results);
      }
    });

    conn.release();
  });
};

let getFullReviews = function({ location_id }, cb) {
  var command = `SELECT r.coffeeTea, r.atmosphere, r.comfort, r.food, c.text, c.user_id
                  FROM comments as c
                  JOIN locations ON c.location=locations.id
                  JOIN ratings as r ON r.location=locations.id
                  WHERE locations.id=?
                  GROUP BY c.text`;

  db.getConnection((err, conn) => {
    conn.query(command, location_id, (err, results) => {
      if (err) {
        console.error('Error getting all location reviews', err);
      } else {
        console.log('Retrieved all location reviews');
        cb(null, results);
      }
    });

    conn.release();
  });
};


let saveFlashcardDeck = function(user_id, newDeck, cb) {
  var command = `INSERT INTO flashcards (user_id, title, front, back, card_id)
                VALUES (?, ?, ?, ?, ?)`
  db.getConnection((err, conn) => {
    newDeck.cards.forEach((card) => {
      var params = [user_id, newDeck.name, card.front, card.back, card.id]
      conn.query(command, params, (err) => {
        if (err) console.log(err)
      })
    })
    conn.query(`INSERT INTO flashcard_decks (user_id, title) VALUES (?, ?)`, [user_id, newDeck.name], 
      (err) => {
        if (err) cb(err)
        else cb(null)
    })
    conn.release();
  });
};

let fetchDeckNames = function(user_id, cb) {
  var command = `SELECT title FROM flashcard_decks WHERE user_id = ${user_id}`
  db.getConnection((err, conn) => {
    conn.query(command, (err, docs) => {
      if (err) cb(err)
      else cb(null, docs)
    })
  });
};

let fetchFullDeck = function(user_id, deckName, cb) {
  var command = `SELECT * FROM flashcards WHERE user_id = ${user_id} AND title = '${deckName}'`
  db.getConnection((err, conn) => {
    conn.query(command, (err, docs) => {
      if (err) cb(err)
      else cb(null, docs)
    })
    conn.release()
  });
};

module.exports = {
  saveSpots: saveSpots,
  getRelevantFirst: getRelevantFirst,
  getAveragesAndReviewCount: getAveragesAndReviewCount,
  login: login,
  register: register,
  addRating: addRating,
  addFavorite: addFavorite,
  getRating: getRating,
  getFavorite: getFavorite,
  addComment: addComment,
  getComment: getComment,
  addPics: addPics,
  getFullReviews: getFullReviews,
  saveFlashcardDeck: saveFlashcardDeck,
  fetchDeckNames: fetchDeckNames,
  fetchFullDeck: fetchFullDeck
};
