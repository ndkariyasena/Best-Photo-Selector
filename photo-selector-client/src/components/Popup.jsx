/* cSpell:ignore fortawesome fontawesome vcenter */
import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { Container, Row, Col, Image, Button, Modal } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const Popup = (props) => {

  const [selectedImage, setSelectedImage] = useState(false);
  const [disableSave, setDisableSave] = useState(true);

  const handlePhotoSelect = (event) => {
    if (event.target.id) {
      setSelectedImage(event.target.id);
      setDisableSave(false);
    }
  };

  const callUpdateOrder = () => {
    setDisableSave(true);
    props.updateExistingOrder(selectedImage);
  };

  const photoGalleryGenerator = () => {
    try {

      const outPut = [];
      const userPhotos = [...props.userPhotos];

      if (userPhotos && userPhotos.length > 0) {

        const numberOfPhotos = userPhotos.length;
        const photosPerRow = Math.floor(numberOfPhotos / 6);

        for (let index = 0; index < numberOfPhotos; index += photosPerRow) {

          const images = [];

          for (let point = index; point < (photosPerRow + index); point++) {

            if (!userPhotos[point]) break;

            if (userPhotos[point].id === props.imageId) continue;

            const item = userPhotos[point];

            const _selectedImage = Number(selectedImage) === Number(item.id);

            let classesList = 'effects padding-non margin-non';
            classesList += _selectedImage ? ' selected-image' : '';

            const keyValue = _selectedImage ? (item.id + '_selected') : item.id;

            images.push(
              <div className={'position-relative'} key={point}>
                {_selectedImage ? <span className={'selected-image-icon'}><FontAwesomeIcon icon={faCheckCircle} size="lg" /></span> : null}
                <Image alt={'...image'} key={keyValue} id={item.id} src={item.picture} thumbnail className={classesList} onClick={handlePhotoSelect} />
              </div>
            );

          }

          outPut.push(
            <Col xs={12} sm={12} md={2} lg={2} key={index} className="padding-non" >{images}</Col>
          );

        }

      }

      return outPut;

    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Select image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              {photoGalleryGenerator()}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={disableSave} onClick={callUpdateOrder}>Save</Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Popup.propTypes = {
  updateExistingOrder: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  userPhotos: PropTypes.array.isRequired,
  imageId: PropTypes.string.isRequired,
  activeOrderId: PropTypes.string.isRequired,
};

export default Popup;
