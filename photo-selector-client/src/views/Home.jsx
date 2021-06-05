/* cSpell:ignore notif */
import React, { useEffect, useState } from 'react';

import { connect } from "react-redux";

// import { Container, Row, Col, Toast, Button } from 'react-bootstrap';

import PropTypes from 'prop-types';

// import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import history from '../store/history'

import Loading from "../components/Loading";
import PhotoGallery from "../components/PhotoGallery";
import Notification from "../components/Notification";

import { getExistingPhoto } from "../store/actions/PhotoRepo.actions";
import { savePhotoOrder, isPhotoOrdesAvailableForUser } from "../store/actions/BestPhotos.actions";
import { getUserDetails, getUserCollectionDetails } from "../store/actions/User.actions";

import "../assets/styles/home.css";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   }
// }));


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
                    collectionId: user.collectionsId,
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
  const addNotifications = (head = '', message = '', type = 'error') => {
    const notif = [...notifications];
    notif.push({ head, message, id: new Date().getTime(), type });
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

      <Notification notifications={notifications} closeNotifications={closeNotifications} />

      <div >
        <Grid container spacing={3}>

          {/* Header */}
          <Grid item xs={12}>
            <div className="header">
              <h1>Photo Gallery</h1>
              <p>Select your best 9 photos.</p>
            </div>
          </Grid>

          {/* Info and buttons section */}
          <Grid item xs={null} sm={1} />
          <Grid item xs={12} sm={9}>
            {selectedLabel()}
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button className="margin-bottom-10 button-basic" onClick={handleSelectedPhotosSave} disabled={topPhotosList.length === 0} >Save</Button>
          </Grid>
          <Grid item xs={null} sm={1} />

          {/* Photo display grids */}
          <Grid item xs={null} sm={1} />
          <Grid item xs={12} sm={10} spacing={3} className={'fix-box'}>
            <PhotoGallery photoList={props.userPhotos} handlePhotoSelect={handlePhotoSelect} selectedPhotos={topPhotosList} selection={'multiple'} />
          </Grid>
          <Grid item xs={null} sm={1} />

          {/* Empty space */}
          <Grid item xs={12} sm={12} />

        </Grid>
      </div>

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
