import React from 'react';
import {
  Grid,
  Row,
  Col,
  Thumbnail,
  Button,
  Carousel,
  Modal,
  Tabs,
  Tab,
} from 'react-bootstrap';
import StackGrid from 'react-stack-grid';
import ScrollToTop from 'react-scroll-up';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import ShowReviews from './ShowReviews.jsx';
import Review from './Review.jsx';
import AmazonBar from './AmazonBar.jsx';
import '../style.css';
import Map from './Map.jsx';

class Display extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCafe: {},
      currentCafeAvgRating: {},
      currentCafeReviews: {},
      review: '',
      submittedReview: false,
      coffeeRating: 0,
      atmosphereRating: 0,
      comfortRating: 0,
      showMap: false
    };

    this.cafeView = this.cafeView.bind(this);

    this.submitReview = this.submitReview.bind(this);
    this.enterReview = this.enterReview.bind(this);
    this.closeReviewSubmission = this.closeReviewSubmission.bind(this);
    this.handleCoffee = this.handleCoffee.bind(this);
    this.handleAtmosphere = this.handleAtmosphere.bind(this);
    this.handleComfort = this.handleComfort.bind(this);
    this.handleFood = this.handleFood.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.addToFave = this.addToFave.bind(this);
  }

  // function that sets state to clicked cafe
  cafeView(cafe) {
    // window.scrollTo(0, document.getElementById('search-button').offsetTop);
    axios
      .get('/ratings', {
        params: {
          location_id: cafe.id,
          average: true
        }
      })
      // gets the stored reviews for the current cafe
      .then((res) => {
        axios
          .get('/pics', {
            params: {
              location_id: cafe.id
            }
          })
          .then((result) => {
            axios
              .post('/pics', {
                pics: result.data.photos,
                location_id: cafe.id
              })
              .catch((err) => {
                console.log(err);
              });

            var newCafe = Object.assign({ pics: result.data.photos }, cafe);
            this.setState({
              currentCafe: newCafe,
              currentCafeAvgRating: res.data[0]
            });
            this.props.renderIndivCafe(true);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        axios
          .get('/reviews', {
            params: {
              location_id: cafe.id
            }
          })
          .then((reviews) => {
            this.setState({
              currentCafeReviews: reviews
            });
          });
      })
      .catch((err) => {
        console.log('GET REVIEWS ERR', err);
      });
  }

  // submits review comment
  submitReview() {
    axios
      .post('/ratings', {
        user_id: this.props.userId,
        location_id: this.state.currentCafe.id,
        coffeeTea: this.state.coffeeRating,
        atmosphere: this.state.atmosphereRating,
        comfort: this.state.comfortRating,
        food: this.state.foodRating
      })
      .then(() => {
        // submits review stars
        axios
          .post('/comments', {
            user_id: this.props.userId,
            location_id: this.state.currentCafe.id,
            text: this.state.review
          })
          .then(() => {
            axios
              .get('/ratings', {
                params: {
                  location_id: this.state.currentCafe.id,
                  average: true
                }
              })
              .then((res) => {
                this.setState({
                  currentCafeAvgRating: res.data[0],
                  review: '',
                  submittedReview: true,
                  coffeeRating: 0,
                  atmosphereRating: 0,
                  comfortRating: 0,
                  foodRating: 0,
                  addFave: 0
                });
              })
              .catch((err) => {
                console.log('UPDATE REVIEWS ERR', err);
              });
          })
          .catch((err) => {
            console.log('ADD COMMENT ERR', err);
          });
      })
      .catch((err) => {
        console.log('ADD RATING ERR', err);
      });
  }

  //sets state with review comment entered in textbox
  enterReview(e) {
    this.setState({
      review: e.target.value
    });
  }

  //sets state when review modal is closed
  closeReviewSubmission(e) {
    this.setState({
      submittedReview: false
    });
  }

  // sets state with star rating for coffee
  handleCoffee(rating) {
    this.setState({
      coffeeRating: rating
    });
  }

  // sets state with star rating for atmosphere
  handleAtmosphere(rating) {
    this.setState({
      atmosphereRating: rating
    });
  }

  // sets state with star rating for comfort
  handleComfort(rating) {
    this.setState({
      comfortRating: rating
    });
  }

  // sets state with star rating for food
  handleFood(rating) {
    this.setState({
      foodRating: rating
    });
  }

  
  handleSelect(key) {
    console.log(key)
    if (key === 1) {
      this.setState({
        showMap: false
      });
    } else {
      this.setState({
        showMap: true
      });
    }
  }

  addToFave() {
    axios
      .post('/favorites', {
        user_id: this.props.userId,
        location_id: this.state.currentCafe.id
      })
      .then((response) => {
        // console.log(response);
      });
  }

  render() {
    // page shows no search results
    if (!this.props.cafes.length) {
      return null;
      // page shows search results after successful search
    } else {
      return (
        <div>
          <Tabs id="search-map" onSelect={this.handleSelect} activeKey={this.state.showMap ? 2 : 1}>
            <Tab eventKey={1} title="Results"></Tab>
            <Tab eventKey={2} title="Map"></Tab>
          </Tabs>
          {this.state.showMap ? (
            <div style={{ marginTop: '1%' }}>
              <Map cafes={this.props.cafes} cafeView={this.cafeView} />
            </div>
          ) : (
              <div style={{ marginTop: '1%' }}>
                <StackGrid columnWidth={300} monitorImagesLoaded={true}>
                  {this.props.cafes.map((cafe) => {
                    return (
                      <div key={cafe.id} className='cafe-card'>
                        <Thumbnail
                          src={cafe.image_url}
                          height="250"
                          onClick={() => this.cafeView(cafe)}
                        >
                          <h3>{cafe.name}</h3>
                          <p>
                            {cafe.location.address1}, {cafe.location.city},{' '}
                            {cafe.location.state}, {cafe.location.zip_code}
                          </p>
                        </Thumbnail>
                      </div>
                    );
                  })}
                </StackGrid>

                <ScrollToTop showUnder={100}>
                  <div>
                    <img
                      src="http://www.pngmart.com/files/3/Up-Arrow-PNG-Picture.png"
                      height="50"
                      style={{ display: 'block', margin: 'auto' }}
                    />
                    <div>Back to Top</div>
                  </div>
                </ScrollToTop>

                <div style={{ marginBottom: '5%' }} className="parallax" /></div>
            )}
          <div>
        {this.props.showIndivCafe ? (
              <Modal
                show={this.props.showIndivCafe}
                onHide={() => this.props.renderIndivCafe(false)}
                dialogClassName="cafeView-modal"
              >
                <Modal.Header closeButton className="modal-header">
                  {/* <Modal.Title>{this.state.currentCafe.name}</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                  <div align="center" style={{ marginBottom: 8 }}>
                    {/* current cafe name & avg star ratings */}
                    <h3>{this.state.currentCafe.name}</h3>
                    <h4>{(this.state.currentCafe.distance * 0.000621371).toFixed(2)} miles away</h4>
                    <p>
                    {this.state.currentCafe.location.address1}
                    <br/> 
                    {this.state.currentCafe.location.city},{' '}
                    {this.state.currentCafe.location.state},{' '}
                    {this.state.currentCafe.location.zip_code}
                  </p>

                    <ShowReviews
                      reviews={this.state.currentCafeReviews.data}
                      cafe={this.state.currentCafe}
                    />

                    {this.props.loggedIn ? <Button onClick={this.addToFave} style={{ marginTop: '5px' }}>
                      Add to Favorites
            </Button> : null}
                    <Grid>
                      <Row>
                        <Col xs={6} md={2}>
                          Coffee/Tea:{' '}
                          <br />
                          <StarRatings
                            numberOfStars={5}
                            rating={this.state.currentCafeAvgRating.coffeeTea || 0}
                            starDimension="20px"
                            starSpacing="1px"
                            starRatedColor="gold"
                            starEmptyColor="grey"
                          />
                        </Col>
                        <Col xs={6} md={2}>
                          Atmosphere:{' '}
                          <br />
                          <StarRatings
                            numberOfStars={5}
                            rating={this.state.currentCafeAvgRating.atmosphere || 0}
                            starDimension="20px"
                            starSpacing="1px"
                            starRatedColor="gold"
                            starEmptyColor="grey"
                          />
                        </Col>
                        <Col xs={6} md={2}>
                          Comfort:{' '}
                          <br />
                          <StarRatings
                            numberOfStars={5}
                            rating={this.state.currentCafeAvgRating.comfort || 0}
                            starDimension="20px"
                            starSpacing="1px"
                            starRatedColor="gold"
                            starEmptyColor="grey"
                          />
                        </Col>
                        <Col xs={6} md={2}>
                          Food:{' '}
                          <br />
                          <StarRatings
                            numberOfStars={5}
                            rating={this.state.currentCafeAvgRating.food || 0}
                            starDimension="20px"
                            starSpacing="1px"
                            starRatedColor="gold"
                            starEmptyColor="grey"
                          />
                        </Col>
                      </Row>
                    </Grid>
                    <AmazonBar creditCard={this.props.creditCard} shippingAddress={
                    {
                      address1: this.state.currentCafe.location.address1,
                      address2: this.state.currentCafe.location.address2 ? this.state.currentCafe.location.address2 : '',
                      state: this.state.currentCafe.location.state,
                      city: this.state.currentCafe.location.city,
                      zip_code: this.state.currentCafe.location.zip_code
                    }
                    } />

                    <Carousel bsClass='sidebysideRight carousel'>
                      <Carousel.Item>
                        <img
                          style={{ maxWidth: '600px', height: '50%' }}
                          alt="600x200"
                          src={this.state.currentCafe.pics[0]}
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          style={{ maxWidth: '600px', height: '50%' }}
                          alt="600x200"
                          src={this.state.currentCafe.pics[1]}
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          style={{ maxWidth: '600px', height: '50%' }}
                          alt="600x200"
                          src={this.state.currentCafe.pics[2]}
                        />
                      </Carousel.Item>
                    </Carousel>
                    <br />

                    <div>
                      <Review
                        username={this.props.username}
                        userId={this.props.userId}
                        loggedIn={this.props.loggedIn}
                        review={this.state.review}
                        coffeeRating={this.state.coffeeRating}
                        atmosphereRating={this.state.atmosphereRating}
                        comfortRating={this.state.comfortRating}
                        foodRating={this.state.foodRating}
                        handleCoffee={this.handleCoffee}
                        handleAtmosphere={this.handleAtmosphere}
                        handleComfort={this.handleComfort}
                        handleFood={this.handleFood}
                        enterReview={this.enterReview}
                        submitReview={this.submitReview}
                      />
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            ) : null}

          </div>
        )
          }
          <Modal
            id="reviewSubmissionModal"
            show={this.state.submittedReview}
            onHide={this.closeReviewSubmission}
          >
            <Modal.Body style={{ overflow: 'hidden' }}>
              <div style={{ textAlign: 'center' }}>
                {' '}
                Your review has been submitted!{' '}
              </div>
              <Button
                onClick={this.closeReviewSubmission}
                style={{ float: 'right' }}
              >
                {' '}
                Close{' '}
              </Button>
            </Modal.Body>
          </Modal>
        </div>
      );
    }
  }
}

export default Display;
