import React from 'react';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  Button
} from 'react-bootstrap';
import StarRatings from 'react-star-ratings';

class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // renders the ability to submit star ratings & write review if there is a user logged in
    if (this.props.loggedIn) {
      return (
        <div>
          <Grid>
            <Row>
              <Col xs={6} md={2}>
                Coffee/Tea:<br />
                <StarRatings
                  numberOfStars={5}
                  rating={this.props.coffeeRating}
                  changeRating={this.props.handleCoffee}
                  starDimension="25px"
                  starSpacing="1px"
                  starRatedColor="gold"
                  starEmptyColor="grey"
                  starHoverColor="gold"
                />
              </Col>
              <Col xs={6} md={2}>
                Atmosphere:<br />
                <StarRatings
                  numberOfStars={5}
                  rating={this.props.atmosphereRating}
                  changeRating={this.props.handleAtmosphere}
                  starDimension="25px"
                  starSpacing="1px"
                  starRatedColor="gold"
                  starEmptyColor="grey"
                  starHoverColor="gold"
                />
              </Col>
              <Col xs={6} md={2}>
                Comfort:<br />
                <StarRatings
                  numberOfStars={5}
                  rating={this.props.comfortRating}
                  changeRating={this.props.handleComfort}
                  starDimension="25px"
                  starSpacing="1px"
                  starRatedColor="gold"
                  starEmptyColor="grey"
                  starHoverColor="gold"
                />
              </Col>
              <Col xs={6} md={2}>
                Food:<br />
                <StarRatings
                  numberOfStars={5}
                  rating={this.props.foodRating}
                  changeRating={this.props.handleFood}
                  starDimension="25px"
                  starSpacing="1px"
                  starRatedColor="gold"
                  starEmptyColor="grey"
                  starHoverColor="gold"
                />
              </Col>
            </Row>
          </Grid>
          <br />

          <div style={{ width: '500' }}>
            <FormGroup controlId="formControlsTextarea">
              <FormControl
                componentClass="textarea"
                placeholder="Enter your review here"
                value={this.props.review}
                onChange={this.props.enterReview}
              />
            </FormGroup>
          <Button onClick={this.props.submitReview}> Submit </Button>
          </div>

        </div>
      );
    // if user is not logged in, will not render review page
    } else {
      return null;
    }
  }
}

export default Review;
