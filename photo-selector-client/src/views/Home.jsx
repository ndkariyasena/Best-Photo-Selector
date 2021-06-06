/* cSpell:ignore notif */
import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { Grid, Button } from '@material-ui/core';

import history from '../store/history';

import Loading from '../components/Loading';
import PhotoGallery from '../components/PhotoGallery';

import { getExistingPhoto } from '../store/actions/PhotoRepo.actions';
import { savePhotoOrder, isPhotoOrdesAvailableForUser } from '../store/actions/BestPhotos.actions';
import { getUserDetails, getUserCollectionDetails } from '../store/actions/User.actions';
import { addNotification } from '../store/actions/Notification.actions';

import '../assets/styles/home.css';


const Home = (props) => {

  const [topPhotosList, setTopPhotosList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* Run at the page load */
  useEffect(() => {

    try {

      /* Get all gallery images */
      const getAllPhotos = async (collectionId) => {
        await props.getExistingPhoto(collectionId)
          .catch(() => {
            addNotifications('Error', 'Something went wrong! Please try again.');
            setIsLoading(false);
          });
      };

      /* Get user details */
      const getUserDetails = async () => {

        if (!props.authUser || Object.keys(props.authUser).length === 0) {
          await props.getUserDetails()
            .then(getPhotoGalleryDetails);

        } else {
          await getPhotoGalleryDetails(props.authUser)
            .then(() => { setIsLoading(false); });
        }

      };

      /* Get photo gallery details */
      const getPhotoGalleryDetails = async (user = props.authUser) => {
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

          });
      };

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

        await props.savePhotoOrder({ ...topPhotosList }, props.authUser.id)
          .then(response => {

            if (response && response.id) {

              /* After save, redirect to album page */
              history.push({ pathname: '/top-photos' }, {
                userId: props.authUser.id,
                orderId: response.id,
                collectionId: props.collectionDetails.code,
              });

              props.history.go();

            }
            else addNotifications('Error', 'Something went wrong! Please try again.');
          })
          .catch(() => { addNotifications('Error', 'Something went wrong! Please try again.'); });

      }

    } catch (error) {
      console.log(error);

    }
  };

  /* Add notifications to notifications array */
  const addNotifications = (head = '', message = '', type = 'error') => {
    props.addNotification({ head, message, type });
  };

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
  );
};

Home.defaultProps = {
  authUser: {},
  userPhotos: [],
};

Home.propTypes = {
  history: PropTypes.any.isRequired,
  authUser: PropTypes.object.isRequired,
  collectionDetails: PropTypes.object.isRequired,
  userPhotos: PropTypes.array.isRequired,
  getExistingPhoto: PropTypes.func.isRequired,
  savePhotoOrder: PropTypes.func.isRequired,
  getUserDetails: PropTypes.func.isRequired,
  getUserCollectionDetails: PropTypes.func.isRequired,
  isPhotoOrdesAvailableForUser: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userPhotos: state.PhotoRepo.collection,
  authUser: state.PhotoRepo.author,
  collectionDetails: state.PhotoRepo.details,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getExistingPhoto: (collectionId) => dispatch(getExistingPhoto(collectionId)),
    savePhotoOrder: (photoOrder, userId) => dispatch(savePhotoOrder(photoOrder, userId)),
    getUserDetails: () => dispatch(getUserDetails()),
    getUserCollectionDetails: (userId) => dispatch(getUserCollectionDetails(userId)),
    isPhotoOrdesAvailableForUser: (userId) => dispatch(isPhotoOrdesAvailableForUser(userId)),
    addNotification: (notification) => dispatch(addNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
