const assert = require('assert')
const expect = require('chai').expect
const axios = require ('axios')
describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
      });
    });
  });


/////////Parker Test











////Kiernan Test


describe ('Amazon Order Bar', function () {
  describe ('Server Connection', function () {
    it ('should take in an object that has a product ID', function () {
      axios.post('/orders', {
        params: {
          shippingAddress: {},
          creditCard: {number : '123456789012345'},
          productID: ''
        }
        }).then (function (response) {
          expect(response.data).to.equal('Error: Credit Card is not 16 digits long')
        })
    })
  })
})






/////Martin Test
const db = require('./../server/db/models/_model')

describe('database', () => {
  describe('fetch Deck names', () => {
    it('should receive an array of names from the db', () => {
        db.fetchDeckNames(1, (err, docs) => { 
          expect(docs[0]).to.have.property('title')
        })
    })
  })
})