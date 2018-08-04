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

var AmazonBarCollapse  = ({product, handleConfirm}) => {
  return (
    <Collapse in = {product.open}>
      <div>
        <Well>
          Buy {product.productName}?
          <div>
            <Button onClick = {() => {handleConfirm(product)}} >Yes</Button>
          </div>
        </Well>
      </div>
    </Collapse>
  
  )
}
export default AmazonBarCollapse;