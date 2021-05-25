/* cSpell:ignore notif */
import React, { useEffect, useState } from 'react';

import { connect } from "react-redux";

import { Container, Row, Col, Image, Toast, Button } from 'react-bootstrap';

import PropTypes from 'prop-types';

import history from '../store/history'

import { getExistingPhoto } from "../store/actions/PhotoRepo.actions";
import { savePhotoOrder } from "../store/actions/BestPhotos.actions";

import "../assets/styles/home.css";

const Home = (props) => {

  const [topPhotosList, setTopPhotosList] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    try {

      const getAllPhotos = async () => {
        await props.getExistingPhoto()
          .catch(() => {
            addNotifications('Error', 'Something went wrong! Please try again.');
          });
      };

      getAllPhotos();

    } catch (error) {
      console.log(error);
    }

  }, []);

  const handleSelectedPhotosSave = async () => {
    try {

      if (!topPhotosList || topPhotosList.length < 9) addNotifications('Error', 'Please select 9 photo');
      else {

        await props.savePhotoOrder({ ...topPhotosList }, props.photoAuth.id)
          .then(response => {

            if (response && response.id) {

              history.push({ pathname: '/top-photos' }, {
                userId: props.photoAuth.id,
                orderId: response.id
              });

              props.history.go();

            }
            else addNotifications('Error', 'Something went wrong! Please try again.');
          })
          .catch((err) => { addNotifications('Error', 'Something went wrong! Please try again.') });

      }

    } catch (error) {
      console.log(error);

    }
  }

  const closeNotifications = (notifId) => {
    const notif = notifications.filter(item => item.id !== notifId);
    setNotifications(notif);
  }

  const addNotifications = (head = '', message = '') => {
    const notif = [...notifications];
    notif.push({ head, message, id: new Date().getTime() });
    setNotifications(notif);
  }

  const handlePhotoSelect = (event) => {

    const selectedImageId = Number(event.target.id);
    const photosList = [...topPhotosList];

    if (photosList.includes(selectedImageId)) photosList.splice(photosList.indexOf(selectedImageId), 1);
    else if (photosList.length < 9) photosList.push(selectedImageId);
    else addNotifications('', 'Maximum 9 images can be selected');

    setTopPhotosList(photosList);
  };

  const photoGalleryGenerator = () => {
    try {

      const outPut = [];
      const userPhotos = [...props.userPhotos];

      if (userPhotos && userPhotos.length > 0) {

        const numberOfPhotos = userPhotos.length;
        const photosPerRow = Math.floor(numberOfPhotos / 4);

        for (let index = 0; index < numberOfPhotos; index += photosPerRow) {

          const images = [];

          for (let point = index; point < (photosPerRow + index); point++) {

            if (!userPhotos[point]) break;

            const item = userPhotos[point];

            let classesList = 'effects';
            classesList += topPhotosList.includes(item.id) ? ' selected-image' : '';

            const keyValue = topPhotosList.includes(item.id) ? (item.id + '_selected') : item.id;

            images.push(
              <div className={'position-relative'} key={point}>
                {topPhotosList.includes(item.id) ? <span className={'selected-image-number'}>{topPhotosList.indexOf(item.id) + 1}</span> : null}
                <Image alt={'...image'} key={keyValue} id={item.id} src={item.picture} thumbnail className={classesList} onClick={handlePhotoSelect} />
              </div>
            );

          }

          outPut.push(
            <Col xs={12} sm={12} md={3} lg={3} key={index} >{images}</Col>
          );

        }

      }

      return outPut;

    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const selectedLabel = () => {

    let selectedPhotoCountLabel = <p> </p>;
    if (topPhotosList.length > 0) {
      if (topPhotosList.length === 1) selectedPhotoCountLabel = <p>1 photo selected.</p>;
      else selectedPhotoCountLabel = <p>{topPhotosList.length} photos selected.</p>;

    }

    return selectedPhotoCountLabel;
  }



  return (
    <>

      {
        notifications.length > 0 && (
          <div aria-live="polite" aria-atomic="true" className={'notifications-wrapper'} >
            <div className={'notifications'} >
              {
                notifications.map((item) => (
                  <Toast className="toast-notify" key={item.id} onClose={() => closeNotifications(item.id)}>
                    <Toast.Header>
                      <strong className="mr-auto">{item.head}</strong>
                    </Toast.Header>
                    <Toast.Body>{item.message}</Toast.Body>
                  </Toast>
                ))
              }
            </div>
          </div>
        )
      }

      <div className="header">
        <h1>Photo Gallery</h1>
        <p>Select your best 9 photos.</p>
      </div>

      <div>
        <Container>
          <Row>
            <Col sm={6} md={11}>{selectedLabel()}</Col>
            <Col sm={6} md={1}>{topPhotosList.length > 0 ? <Button onClick={handleSelectedPhotosSave} >Save</Button> : null}</Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          {photoGalleryGenerator()}
        </Row>
      </Container>

    </>
  )
}

Home.defaultProps = {
  photoAuth: {},
  userPhotos: [],
};

Home.propTypes = {
  photoAuth: PropTypes.object.isRequired,
  userPhotos: PropTypes.array.isRequired,
  getExistingPhoto: PropTypes.func.isRequired,
  savePhotoOrder: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  userPhotos: state.PhotoRepo.collection,
  photoAuth: state.PhotoRepo.author,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getExistingPhoto: () => dispatch(getExistingPhoto()),
    savePhotoOrder: (photoOrder, userId) => dispatch(savePhotoOrder(photoOrder, userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
