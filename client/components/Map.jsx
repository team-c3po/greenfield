import React from 'react';
import {
  Thumbnail,
  Button,
} from 'react-bootstrap';
import { compose, withProps, withHandlers, withStateHandlers } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';

let GOOGLE_MAPS_API_KEY;
try {
  GOOGLE_MAPS_API_KEY = require('../../config.js').GOOGLE_MAPS_API_KEY;
} catch (err) {
  GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
}

const Map = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%'}} />,
    containerElement: <div style={{ height: '850px'}} />,
    mapElement: <div style={{ height: '100%', width: '80%'}} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    }
  }),
  withStateHandlers(() => ({
    isOpen: false,
    infoIndex: null
  }), {
    showInfo: ({ isOpen, infoIndex }) => (index) => ({
      isOpen: infoIndex !== index || !isOpen,
      infoIndex: index
    })
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  let {latitude, longitude} = props.cafes[0].coordinates;
  let cafeView = props.cafeView;
  return (
    <GoogleMap
      defaultZoom={16}
      defaultCenter={{ lat: latitude, lng: longitude }}
    >
      <MarkerClusterer
        onClick={props.onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={60}
      >
        {props.cafes.map((cafe, index) => {
          cafe.index = index;
          return (
            <Marker
              key={cafe.id}
              position={{ lat: cafe.coordinates.latitude, lng: cafe.coordinates.longitude }}
              onClick={() => props.showInfo(cafe.index)}
            >
              {(props.isOpen && props.infoIndex === cafe.index) &&
                <InfoWindow onCloseClick={props.showInfo}>
                  <div>
                    <h3>{cafe.name}</h3>
                    <p>
                      {cafe.location.address1}, {cafe.location.city},{' '}
                      {cafe.location.state}, {cafe.location.zip_code}
                    </p>
                    <Button 
                      onClick={() => props.cafeView(cafe)}
                      bsStyle="primary"
                      bsSize="small"
                    >
                     STUD(y) Details
                    </Button>
                  </div>
                </InfoWindow>}
            </Marker>
          );
        })}
      </MarkerClusterer>
    </GoogleMap>
  );
});

export default Map;

