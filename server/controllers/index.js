const express = require('express');
const parser = require('body-parser');
const {
  getClosestWithinRadius,
  getAdditionalPics
} = require('../helpers/yelp.js');
const models = require('../db/models/_model.js');

const bcrypt = require('bcrypt-nodejs');
const session = require('express-session');

const app = express();

app.use(express.static(__dirname + '/../../client'));
app.use(parser.json());
app.use(
  session({
    secret: 'very secret'
  })
);

function auth(req, res, next) {
  if (req.session.userData) next();
  else {
    res.redirect('/');
  }
}

app.get('/logout', (req, res) => {
  delete req.session.userData;
  res.send();
});

app.post ('/orders', (req, res) => {
  console.log (req.body)
  let creditCard = req.body.params.creditCard;
  let productID = req.body.params.productID;
  let shippingAddress = req.body.params.shippingAddress;
  if (creditCard.number.length !== 16) {
    res.send ('Error: Credit Card is not 16 digits long')
  }
  if (creditCard.code === '') {
    res.send ('Error: No Security Code Provided')
  }  
  if (creditCard.name === '') {
    res.send ('Error: No Card Owner Name Provided')
  }  
  if (creditCard.year < 2018) {
    res.send ('Error: Credit Card Expiration Year is past')
  }
  if (creditCard.month > 12 || creditCard < 1) {
    res.send ('Error: Credit Card Expiration Month is not valid')
  }
  res.send (req.body)
})

app.get('/search', (req, res) => {
  // req.query should have [coffee, atmosphere, comfort, food, location, radius] as keys

  var params = req.query;
  var coffeeMult = 5 - params.coffee;
  var atmosphereMult = 5 - params.atmosphere;
  var comfortMult = 5 - params.comfort;
  var foodMult = 5 - params.food;
  getClosestWithinRadius(params.location, params.radius)
    .then((studySpotList) => {
      models.saveSpots(studySpotList.data.businesses);
      if (coffeeMult + atmosphereMult + comfortMult + foodMult === 20) {
        res.send(studySpotList.data);
      } else {
        models.getRelevantFirst(
          studySpotList.data.businesses,
          coffeeMult,
          atmosphereMult,
          comfortMult,
          foodMult,
          (err, results) => {
            if (err) {
              console.log(err);
            }
            res.send(results);
          }
        );
      }
    })
    .catch((err) => {
      console.log('Error searching for location: ' + err);
    });
});

app.post('/login', (req, res) => {
  // both login and register req.query should have [username, password] as keys

  models.login(req.body, (err, data) => {
    if (err) {
      res.status(404).send();
    } else {
      bcrypt.compare(req.body.password, data[0].password, (err, match) => {
        if (match) {
          var sess = {
            username: req.body.username,
            userId: data[0].id,
            login: true
          };

          req.session.userData = sess;
          res.send(JSON.stringify(data[0].id));
        }
      });
    }
  });
});

app.post('/register', (req, res) => {
  console.log (req.body)
  models.register(req.body, (err, data) => {
    if (err) {
      console.error('Username is taken');
      console.log (err)
    } else {
      var sess = {
        username: req.body.username,
        userId: data.insertId,
        creditCard: req.body.creditCard,
        login: true
      };

      req.session.userData = sess;
      res.send(JSON.stringify(data.insertId));
    }
  });
});

app.post('/ratings', (req, res) => {
  // req.body should have [user_id, location_id, coffeeTea, atmosphere, comfort, food] as keys

  models.addRating(req.body, (err, data) => {
    if (err) {
      res.send();
    } else {
      res.send(JSON.stringify(data));
    }
  });
});

app.get('/ratings', (req, res) => {
  // req.query should have location_id as a key
  // OPTIONAL: if req.query has a key, 'average', will provide average rating and rating count
  if (req.query.average) {
    models.getAveragesAndReviewCount(req.query, (err, data) => {
      if (err) {
        res.send();
      } else {
        res.send(JSON.stringify(data));
      }
    });
  } else {
    models.getRating(req.query, (err, data) => {
      if (err) {
        res.send();
      } else {
        res.send(JSON.stringify(data));
      }
    });
  }
});

app.post('/favorites', (req, res) => {
  // req.body should have user_id and location_id as keys

  models.addFavorite(req.body, (err, data) => {
    if (err) {
      res.send();
    } else {
      res.send(JSON.stringify(data));
    }
  });
});

app.get('/favorites', (req, res) => {
  // req.query should have user_id as a key
  console.log(req.query.user_id);
  
  models.getFavorite(req.query.user_id, (err, data) => {
    if (err) {
      console.log('Express server received db error: ', err);
    } else {
      res.send(JSON.stringify(data));
    }
  });
});

app.post('/comments', (req, res) => {
  // req.body should have user_id, location_id, text as keys

  models.addComment(req.body, (err, data) => {
    if (err) {
      res.send();
    } else {
      res.send(JSON.stringify(data));
    }
  });
});

app.get('/comments', (req, res) => {
  // req.query should have location_id as a key

  models.getComment(req.query, (err, data) => {
    if (err) {
      res.send();
    } else {
      res.send(JSON.stringify(data));
    }
  });
});

app.get('/pics', (req, res) => {
  // req.query should have location_id as a key

  getAdditionalPics(req.query.location_id)
    .then((result) => {
      res.send(result.data);
    })
    .catch((err) => {
      res.send();
    });
});

app.post('/pics', (req, res) => {
  // req.body should have pics and location_id as keys

  models.addPics(req.body, (err, data) => {
    if (err) {
      res.send();
    } else {
      res.send(JSON.stringify(data));
    }
  });
});

app.get('/reviews', (req, res) => {
  models.getFullReviews(req.query, (err, data) => {
    if (err) {
      res.send();
    } else {
      res.send(JSON.stringify(data));
    }
  });
});

app.get('/flashcardDecks', (req, res) => {
  //Gets the list of deck names that the user has made
  let user_id = req.query.user_id
  models.fetchDeckNames(user_id, (err, data) => {
    if (err) console.log(err)
    else {
      let arr = [];
      data.forEach((item) => arr.push(item.title))
      res.send(arr)
    }
  })
})

app.get('/flashcardDeck', (req, res) => {
  //Gets all the flashcards for a particular user and title
  let {user_id, deckName} = req.query
  models.fetchFullDeck(user_id, deckName, (err, data) => {
    //assembles the deck into the format it will be used on the client side
    let deckToSend = {id: 1, name: deckName, cards: []}
    data.forEach((card) => {
      deckToSend.cards.push({
        id: card.card_id,
        front: card.front,
        back: card.back
      })
    })
    res.send(deckToSend)
  })
})

app.get('/*', auth, (req, res) => {
  res.send(req.session.userData);
});

app.post('/flashcards', (req, res) => {
  //saves a series of flashcards to the database
  let {user_id, newDeck} = req.body
  models.saveFlashcardDeck(user_id, newDeck, (err) => {
    if (err) console.log('In the server, err sending to the db', err)
    else res.sendStatus(201)
  })
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('App is listening to port', port);
});
