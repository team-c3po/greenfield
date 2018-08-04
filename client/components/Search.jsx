import React from 'react';
import axios from 'axios';
import { Grid, Col, FormControl, Button, Collapse, Row, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: '',
      prefs: [],
      radius: null,
      radiusButton: 'Radius',
      advanced: false
    };

    this.saveLocation = this.saveLocation.bind(this);
    this.getOrderOfPref = this.getOrderOfPref.bind(this);
    this.savePref = this.savePref.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.showAdvanced = this.showAdvanced.bind(this);
    this.renderAdvancedSearch = this.renderAdvancedSearch.bind(this);
    this.search = this.search.bind(this);

    this.handleRadius = this.handleRadius.bind(this);
  }

  saveLocation(e) {
    e.preventDefault();
    this.setState({
      location: e.target.value
    });
  }

  getCurrentPref() {
    return (
      <div align='center'>
        <h4>Pick Your Preferences in Order:</h4>
      </div>
    );
  }

  getOrderOfPref(item) {
    if (this.state.prefs.indexOf(item) === -1) {
      return item;
    } else {
      return this.state.prefs.indexOf(item) + 1 + `. ${item}`;
    }
  }

  savePref(e) {
    var newPrefs = this.state.prefs;
    if (this.state.prefs.indexOf(e.target.value) === -1) {
      newPrefs.push(e.target.value);
      this.setState({ prefs: newPrefs });
    } else {
      newPrefs.splice(newPrefs.indexOf(e.target.value), 1);
      this.setState({ prefs: newPrefs });
    }
  }

  isSelected(item) {
    if (this.state.prefs.indexOf(item) > -1) {
      return 'success';
    }
  }

  showAdvanced(e) {
    e.preventDefault();
    this.setState({ advanced: !this.state.advanced });
  }

  renderAdvancedSearch() {
    return (
      <Collapse in={this.state.advanced}>
        <div>
          {this.getCurrentPref()}
          <Grid >
          <Row>
            <Col sm={6} md={3}>
              <Button
                value="Coffee"
                onClick={this.savePref}
                bsStyle={this.isSelected('Coffee')}
                block
              >
                {this.getOrderOfPref('Coffee')}
              </Button>
            </Col>
            <Col sm={6} md={3}>
              <Button
                value="Atmosphere"
                onClick={this.savePref}
                bsStyle={this.isSelected('Atmosphere')}
                block
              >
                {this.getOrderOfPref('Atmosphere')}
              </Button>
            </Col>
            <Col sm={6} md={3}>
              <Button
                value="Comfort"
                onClick={this.savePref}
                bsStyle={this.isSelected('Comfort')}
                block
              >
                {this.getOrderOfPref('Comfort')}
              </Button>
            </Col>
            <Col sm={6} md={3}>
              <Button
                value="Food"
                onClick={this.savePref}
                bsStyle={this.isSelected('Food')}
                block
              >
                {this.getOrderOfPref('Food')}
              </Button>
            </Col>
            </Row>
          </Grid>
        </div>
      </Collapse>
    );
  }

  search(e) {
    e.preventDefault();

    axios
      .get('/search', {
        // Defaults priorities to value 0, or set value by order clicked 
        params: {
          location: this.state.location,
          coffee: this.state.prefs.indexOf('Coffee') + 1 || 0,
          atmosphere: this.state.prefs.indexOf('Atmosphere') + 1 || 0,
          comfort: this.state.prefs.indexOf('Comfort') + 1 || 0,
          food: this.state.prefs.indexOf('Food') + 1 || 0,
          radius: this.state.radius || 800
        }
      })
      .then((res) => {
        // Set state of cafes to data retrieved from Yelp
        // Use function passed down from index.jsx (handleYelp)
        this.props.handleYelp(res.data.businesses);
        this.props.renderIndivCafe(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleRadius(e, rad) {
    this.setState({
      radiusButton: e.target.text,
      radius: rad
    });
  }

  render() {
    return (
      <div>
        <div className="text-center" style={{ marginTop: '5%', width:'50%' }}>
          <FormGroup>
            <InputGroup>
              <FormControl
              type="text"
              value={this.state.location}
              onChange={this.saveLocation}
              placeholder='Enter your address to find a STUD(y) spot...' />

              <DropdownButton
                componentClass={InputGroup.Button}
                id="input-dropdown-addon"
                title={this.state.radiusButton}
              >
                <MenuItem value='1600' onClick={ (e) => this.handleRadius(e, 1600) }>1 Mile</MenuItem>
                <MenuItem value='2400' onClick={ (e) => this.handleRadius(e, 2400) }>1.5 Miles</MenuItem>
                <MenuItem value='3200' onClick={ (e) => this.handleRadius(e, 3200) }>2 Miles</MenuItem>
                <MenuItem value='4000' onClick={ (e) => this.handleRadius(e, 4000) }>2.5 Miles</MenuItem>
                <MenuItem value='4800' onClick={ (e) => this.handleRadius(e, 4800) }>3 Miles</MenuItem>
              </DropdownButton>
            </InputGroup>
          </FormGroup>
          
          <a href="" align="center" onClick={this.showAdvanced}>
            {this.state.advanced ? 'Hide Advanced Search' : 'Advanced Search'}
          </a>
          </div>

        <div>
        {this.renderAdvancedSearch()}
        </div>

        <div id="search-button">

          <Button
            className="center"
            onClick={(e) => this.search(e)}
            style={{ marginTop: '1%' }}
          >
            Search STUD(y) Spots
          </Button>

        </div>

      </div>
    );
  }
}

export default Search;
