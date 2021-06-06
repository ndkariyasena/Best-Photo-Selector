/* cSpell:ignore notif */
import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Button } from '@material-ui/core';

import Loading from '../components/Loading';
import PhotoGallery from '../components/PhotoGallery';
import ChangeOrder from '../components/ChangeOrder';
// import Notification from '../components/Notification';

import { getExistingPhoto } from '../store/actions/PhotoRepo.actions';
import { updatePhotoOrder, getAllBestPhotoOrderForUser } from '../store/actions/BestPhotos.actions';
import { getUserDetails } from '../store/actions/User.actions';
import { addNotification } from '../store/actions/Notification.actions';

import '../assets/styles/home.css';
import '../assets/styles/topPhotos.css';

function PhotoAlbum(props) {

  const [authUserId, setUserId] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [changeOrder, setChangeOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      else if (props.authUser.id) userId = props.authUser.id;

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
                  console.log(_order);
                  setActiveOrderId(_order.id);
                }

              });
          })
          .catch(() => {
            addNotifications('Error', 'Something went wrong! Please try again.');
          })
          .finally(() => { setIsLoading(false); });
      };

      const getAllDetails = async () => {
        await props.getUserDetails()
          .then(user => {
            setUserId(user.id);

            getAllPhotosAndPhotoOrders(user.collectionId);

            // generateImageAlbumData();
          })
          .finally(() => { setIsLoading(false); });
      };

      /* Set loading true */
      setIsLoading(true);

      /* If collectionId not available, get user details and other data */
      if (!collectionsId) getAllDetails();
      else getAllPhotosAndPhotoOrders(); /* Else get gallery photos and album data */

    } catch (error) {
      console.log(error);
    }

  }, []);

  const generateImageAlbumData = () => {
    try {

      const imageAlbum = [];

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

      return imageAlbum;

    } catch (error) {
      return [];
    }
  };

  /* Add notifications to notifications array */
  const addNotifications = (head = '', message = '', type = 'error') => {
    props.addNotification({ head, message, type });
  };

  const updateFullOrder = async (newPhotoOrder) => {

    const changedOrder = newPhotoOrder.map((item) => (Number(item.id)));

    await props.updatePhotoOrder({ ...changedOrder }, authUserId, activeOrderId)
      .catch(() => {
        addNotifications('Error', 'Something went wrong! Please try again.');
      })
      .finally(() => {
        props.history.go();
      });

  };

  const handleChangeOrder = () => {
    setChangeOrder(!changeOrder);
  };


  if (isLoading) {
    return (
      <div className={'loadingWrapper'}>
        <Loading />
      </div>
    );
  }

  return (
    <>

      {
        changeOrder && (
          <ChangeOrder photoList={generateImageAlbumData()} open={changeOrder} onClose={handleChangeOrder} updateExistingOrder={updateFullOrder} />)
      }

      <div >
        <Grid container spacing={3}>

          {/* Header */}
          <Grid item xs={12}>
            <div className="header">
              <h1>Your Best Selections</h1>
            </div>
          </Grid>

          {/* Info and buttons section */}
          <Grid item xs={null} sm={9} />
          <Grid item xs={12} sm={2}>
            {
              activeOrderId &&
              (<Button className="margin-bottom-10 button-basic" size="sm" variant="primary" onClick={handleChangeOrder} >
                Change the order
              </Button>)
            }
          </Grid>
          <Grid item xs={null} sm={1} />

          {/* Photo display grids */}
          <Grid item xs={null} sm={1} />
          <Grid item xs={12} sm={10} spacing={3}>
            <PhotoGallery photoList={generateImageAlbumData()} displayType={'inactive'} />
          </Grid>
          <Grid item xs={null} sm={1} />

          {/* Empty space */}
          <Grid item xs={12} sm={12} />

        </Grid>
      </div>

    </>
  );
}

PhotoAlbum.defaultProps = {
  authUser: {},
  bestPhotosOrders: {},
  userPhotos: [],
};

PhotoAlbum.propTypes = {
  history: PropTypes.object.isRequired,
  authUser: PropTypes.object.isRequired,
  bestPhotosOrders: PropTypes.object.isRequired,
  userPhotos: PropTypes.array.isRequired,
  getExistingPhoto: PropTypes.func.isRequired,
  updatePhotoOrder: PropTypes.func.isRequired,
  getAllBestPhotoOrderForUser: PropTypes.func.isRequired,
  getUserDetails: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userPhotos: state.PhotoRepo.collection,
  authUser: state.PhotoRepo.author,
  bestPhotosOrders: state.BestPhotos.orders,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getExistingPhoto: (collectionId) => dispatch(getExistingPhoto(collectionId)),
    updatePhotoOrder: (photoOrder, userId, orderId) => dispatch(updatePhotoOrder(photoOrder, userId, orderId)),
    getAllBestPhotoOrderForUser: (userId) => dispatch(getAllBestPhotoOrderForUser(userId)),
    getUserDetails: () => dispatch(getUserDetails()),
    addNotification: (notification) => dispatch(addNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAlbum);
