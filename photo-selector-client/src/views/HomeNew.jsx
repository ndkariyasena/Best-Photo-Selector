/* cSpell:ignore notif */
import React, { useEffect, useState } from 'react';

import { connect } from "react-redux";

import { Container, Row, Col, Toast, Button } from 'react-bootstrap';

import PropTypes from 'prop-types';

import history from '../store/history'

import Loading from "../components/Loading";
import PhotoGallery from "../components/PhotoGallery";

import { getExistingPhoto } from "../store/actions/PhotoRepo.actions";
import { savePhotoOrder, isPhotoOrdesAvailableForUser } from "../store/actions/BestPhotos.actions";
import { getUserDetails, getUserCollectionDetails } from "../store/actions/User.actions";

import "../assets/styles/home.css";

const Home = (props) => {

  const [topPhotosList, setTopPhotosList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* Run at the page load */
  useEffect(() => {

    try {

      /* Get all gallery images */
      const getAllPhotos = async (collectionId) => {
        await props.getExistingPhoto(collectionId)
          .catch(() => {
            addNotifications('Error', 'Something went wrong! Please try again.');
          });
      };

      const getUserDetails = async () => {
        /* Get user details */
        await props.getUserDetails()
          .then(async user => {
            /* Check is there any best-photo-order album in server */
            await props.isPhotoOrdesAvailableForUser(user.id)
              .then(async isAvailable => {

                /* If album available, redirect to album page */
                if (isAvailable) {
                  history.push({ pathname: '/top-photos' }, {
                    userId: user.id,
                    collectionId:user.collectionsId,
                  });

                  props.history.go();

                } else { /* Else get user photo gallery details */
                  await props.getUserCollectionDetails(user.id)
                    .then(async (details) => {
                      /* get photo gallery data */
                      await getAllPhotos(details.code)
                        .then(() => { setIsLoading(false); });
                    });
                }

              })
          })
      }

      /* Set loading true */
      setIsLoading(true);

      /* Get data */
      getUserDetails();

    } catch (error) {
      console.log(error);
    }

  }, []);

  /* Handle selected photos from gallery as a new best-photos-order */
  const handleSelectedPhotosSave = async () => {
    try {

      if (!topPhotosList || topPhotosList.length < 9) addNotifications('Error', 'Please select 9 photo');
      else {

        await props.savePhotoOrder({ ...topPhotosList }, props.photoAuth.id)
          .then(response => {

            if (response && response.id) {

              /* After save, redirect to album page */
              history.push({ pathname: '/top-photos' }, {
                userId: props.photoAuth.id,
                orderId: response.id,
                collectionId: props.collectionDetails.code,
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

  /* handle notification popups */
  const closeNotifications = (notifId) => {
    const notif = notifications.filter(item => item.id !== notifId);
    setNotifications(notif);
  }

  /* Add notifications to notifications array */
  const addNotifications = (head = '', message = '') => {
    const notif = [...notifications];
    notif.push({ head, message, id: new Date().getTime() });
    setNotifications(notif);
  }

  /* handle photo selections from the gallery list */
  const handlePhotoSelect = (event) => {

    const selectedImageId = Number(event.target.id);
    const photosList = [...topPhotosList];

    if (photosList.includes(selectedImageId)) photosList.splice(photosList.indexOf(selectedImageId), 1);
    else if (photosList.length < 9) photosList.push(selectedImageId);
    else addNotifications('', 'Maximum 9 images can be selected');

    setTopPhotosList(photosList);
  };

  /* Display number of images selected */
  const selectedLabel = () => {

    let selectedPhotoCountLabel = <p> </p>;
    if (topPhotosList.length > 0) {
      if (topPhotosList.length === 1) selectedPhotoCountLabel = <p>1 photo selected.</p>;
      else selectedPhotoCountLabel = <p>{topPhotosList.length} photos selected.</p>;

    }

    return selectedPhotoCountLabel;
  }


  if (isLoading) {
    return (
      <div className={'loadingWrapper'}>
        <Loading />
      </div>
    )
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
            <Col sm={6} md={1}><Button className="margin-bottom-10" onClick={handleSelectedPhotosSave} disabled={topPhotosList.length === 0} >Save</Button></Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          {/* {photoGalleryGenerator()} */}
          <PhotoGallery photoList={props.userPhotos} handlePhotoSelect={handlePhotoSelect} selectedPhotos={topPhotosList} />
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
  collectionDetails: state.PhotoRepo.details,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getExistingPhoto: (collectionId) => dispatch(getExistingPhoto(collectionId)),
    savePhotoOrder: (photoOrder, userId) => dispatch(savePhotoOrder(photoOrder, userId)),
    getUserDetails: () => dispatch(getUserDetails()),
    getUserCollectionDetails: (userId) => dispatch(getUserCollectionDetails(userId)),
    isPhotoOrdesAvailableForUser: (userId) => dispatch(isPhotoOrdesAvailableForUser(userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
