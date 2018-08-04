import React from 'react';
import { Thumbnail, Modal } from 'react-bootstrap';
import StackGrid from 'react-stack-grid';

import axios from 'axios';

class Favorites extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorites: []
    };
  }
  

  modalBody() {
    if (this.props.favorites.length) {
      return (
        <div>
          <Modal.Body>
            <StackGrid columnWidth={300} monitorImagesLoaded={true}>
              {this.props.favorites.map((cafe) => {
                return (
                  <div key={cafe.id}>
                    <Thumbnail height="250">
                      <h3>{cafe.name}</h3>
                      <p>
                        {cafe.address}, {cafe.city}, {cafe.state}
                      </p>
                    </Thumbnail>
                  </div>
                );
              })}
            </StackGrid>
          </Modal.Body>
        </div>
      );
    } else {
      return (
        <div>
          <Modal.Body>No favorites to show.</Modal.Body>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.showFavorites}
          onHide={this.props.closeFavorites}
        >
          <Modal.Header closeButton>
            <Modal.Title>Favorites</Modal.Title>
          </Modal.Header>

          <div>{this.modalBody()}</div>
        </Modal>
      </div>
    );
  }
}

export default Favorites;
