/* cSpell:ignore notif */
import React, { useEffect, useState } from 'react';

import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { Container, Row, Col, Button} from 'react-bootstrap';

import PhotoGallery from "../components/PhotoGallery";
import ChangeOrder from "../components/ChangeOrder";

import { getExistingPhoto } from "../store/actions/PhotoRepo.actions";
import { updatePhotoOrder, getAllBestPhotoOrderForUser } from "../store/actions/BestPhotos.actions";
import { getUserDetails } from "../store/actions/User.actions";

import "../assets/styles/home.css";
import "../assets/styles/topPhotos.css";

function PhotoAlbum(props) {

  const [authUserId, setUserId] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [changeOrder, setChangeOrder] = useState(false);

  const historyLocation = { ...props.history.location };

  /* Run at the page load */
  useEffect(() => {

    try {

      let orderId = null;
      let userId = null;
      let collectionsId = null;

      /* Extract data from route history */
      if (historyLocation.state && historyLocation.state.orderId) orderId = historyLocation.state.orderId;

      if (historyLocation.state && historyLocation.state.collectionsId) collectionsId = historyLocation.state.collectionsId;

      if (historyLocation.state && historyLocation.state.userId) userId = historyLocation.state.userId;
      else if (props.photoAuth.id) userId = props.photoAuth.id;

      if (userId) setUserId(userId);
      if (orderId) setActiveOrderId(orderId);

      const getAllPhotosAndPhotoOrders = async (collectionsId) => {
        /* Get gallery photos */
        await props.getExistingPhoto(collectionsId)
          .then(async (response) => {

            if (!userId && response.author && response.author.id) {
              userId = response.author.id;
              setUserId(userId);
            }

            /* get album photos */
            await props.getAllBestPhotoOrderForUser(userId)
              .then((photoOrders) => {

                if (!orderId && Object.keys(photoOrders).length > 0) {
                  const _order = photoOrders[Object.keys(photoOrders)[0]];
                  console.log(_order)
                  setActiveOrderId(_order.id);
                }

              });
          })
          .catch(() => {
            addNotifications('Error', 'Something went wrong! Please try again.');
          });
      };

      const getAllDetails = async () => {
        await props.getUserDetails()
          .then(user => {
            setUserId(user.id);

            getAllPhotosAndPhotoOrders(user.collectionId);

            // generateImageAlbumData();
          })
      }

      /* If collectionId not available, get user details and other data */
      if (!collectionsId) getAllDetails()
      else getAllPhotosAndPhotoOrders(); /* Else get gallery photos and album data */

    } catch (error) {
      console.log(error);
    }

  }, []);

  const generateImageAlbumData = () => {
    try {

      let imageAlbum = [];

      const userPhotos = [...props.userPhotos];
      const bestPhotosOrder = props.bestPhotosOrders[activeOrderId].order;

      for (const item of Object.values(bestPhotosOrder)) {
        for (const photoData of userPhotos) {
          if (Number(item) === Number(photoData.id)) {
            imageAlbum.push(photoData);

            break;
          }
        }
      }

      // setPhotoOrder(imageAlbum);

      return imageAlbum;

    } catch (error) {
      return [];
    }
  }

  /* Add notifications to notifications array */
  const addNotifications = (head = '', message = '') => {
    const notif = [...notifications];
    notif.push({ head, message, id: new Date().getTime() });
    setNotifications(notif);
  }

  const updateFullOrder = async (newPhotoOrder) => {

    let changedOrder = newPhotoOrder.map((item) => (Number(item.id)));

    await props.updatePhotoOrder({ ...changedOrder }, authUserId, activeOrderId)
      .catch(() => {
        addNotifications('Error', 'Something went wrong! Please try again.');
      })
      .finally(() => {
        props.history.go();
      });

  }

  const handleChangeOrder = () => {
    setChangeOrder(!changeOrder);
  }

  return (
    <>
      <div className="header">
        <h1>Your Best Selections</h1>
      </div>

      <div className="spacing-bottom-25">
        <Container>
          <Row>
            <Col sm={6} md={10}></Col>
            <Col sm={6} md={2}>
              {
                activeOrderId &&
                <Button size="sm" variant="primary" onClick={handleChangeOrder} >
                  Change the order
                </Button>
              }
            </Col>
          </Row>
        </Container>
      </div>

      {
        changeOrder && (
          <ChangeOrder photoList={generateImageAlbumData()} open={changeOrder} onClose={handleChangeOrder} updateExistingOrder={updateFullOrder} />)
      }

      <Container className="spacing-bottom-50">
        <Row>
          <PhotoGallery photoList={generateImageAlbumData()} />
        </Row>
      </Container>
    </>
  )
}

PhotoAlbum.defaultProps = {
  photoAuth: {},
  bestPhotosOrders: {},
  userPhotos: [],
};

PhotoAlbum.propTypes = {
  history: PropTypes.object.isRequired,
  photoAuth: PropTypes.object.isRequired,
  bestPhotosOrders: PropTypes.object.isRequired,
  userPhotos: PropTypes.array.isRequired,
  getExistingPhoto: PropTypes.func.isRequired,
  updatePhotoOrder: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  userPhotos: state.PhotoRepo.collection,
  photoAuth: state.PhotoRepo.author,
  bestPhotosOrders: state.BestPhotos.orders,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getExistingPhoto: (collectionId) => dispatch(getExistingPhoto(collectionId)),
    updatePhotoOrder: (photoOrder, userId, orderId) => dispatch(updatePhotoOrder(photoOrder, userId, orderId)),
    getAllBestPhotoOrderForUser: (userId) => dispatch(getAllBestPhotoOrderForUser(userId)),
    getUserDetails: () => dispatch(getUserDetails()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAlbum);
