import React from 'react';
import {
  Nav,
  NavItem,
  Button,
  Popover,
  OverlayTrigger,
  Collapse,
  Well
} from 'react-bootstrap';
import StackGrid from 'react-stack-grid';
import ScrollToTop from 'react-scroll-up';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import '../style.css';
import AmazonBarCollapse from './AmazonBarCollapse.jsx'

class AmazonBar extends React.Component {
  constructor (props) {
    super (props);
    this.state = {

      amazonSource: 'http://merivisfoundation.org/wp-content/uploads/2018/02/Amazon-Logo-Transparent-PNG.png',
      pens: {
        source:'https://cdn1.iconfinder.com/data/icons/education-set-4/512/roller-pencil-512.png',
        productName:'pens',
        ID:'B00347A8NK',
        open: false
      },
      paper: {
        source: 'http://www.free-icons-download.net/images/a-stack-of-paper-icon-92340.png',
        productName: 'paper',
        productID: 'B00005C55O',
        open: false
      },
      postits: {
        source: 'https://d30y9cdsu7xlg0.cloudfront.net/png/7161-200.png',
        productName: 'postits',
        productID: 'B079X87CY1',
        open: false

      },
      highlighters: {
        source: 'https://d30y9cdsu7xlg0.cloudfront.net/png/231154-200.png',
        productName: 'highlighters',
        productID: 'B002BA5WMI',
        open: false
      }
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }
  handleSelect (key) {
    let productObj = Object.assign ({}, this.state[key.productName])
    productObj.open = !productObj.open;
    this.setState ({[key.productName]: productObj})
//    console.log (this.props.creditCard)
//    console.log (this.props.shippingAddress)

  }
  
  handleConfirm (product) {
      axios
      .post('/orders', {
        params: {
          shippingAddress: this.props.shippingAddress,
          creditCard: this.props.creditCard,
          productID: product.productID
        }
    }).then (function (response) {
      console.log (response.data.params)
    }).catch (function (error) {
      console (error)
    })
  }

  
  render() {
    return (
      <div align='center'>
        <Nav bsStyle='pills' activeKey={1} onSelect={this.handleSelect} className='amz nav'>

          <NavItem disabled >
            <img src={this.state.amazonSource} width='100' height='100' />
          </NavItem>

          <NavItem eventKey={
            this.state.pens
          }>
            <img src={this.state.pens.source} width='75' height='75' />
            <AmazonBarCollapse product={this.state.pens} handleConfirm={this.handleConfirm} />

          </NavItem>
          <NavItem eventKey={
            this.state.paper
          }>
            <img src={this.state.paper.source} width='75' height='75' />
            <AmazonBarCollapse product={this.state.paper} handleConfirm={this.handleConfirm} />


          </NavItem>
          <NavItem eventKey={
            this.state.postits
          }>
            <img src={this.state.postits.source} width='75' height='75' />
            <AmazonBarCollapse product={this.state.postits} handleConfirm={this.handleConfirm} />

          </NavItem>
          <NavItem eventKey={
            this.state.highlighters
          }>
            <img src={this.state.highlighters.source} width='75' height='75' />
            <AmazonBarCollapse product={this.state.highlighters} handleConfirm={this.handleConfirm} />


          </NavItem>


        </Nav>
      </div>
    )
  }
}
export default AmazonBar