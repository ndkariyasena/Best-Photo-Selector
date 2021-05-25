/* cSpell:ignore notif */
import React, { useEffect, useState } from 'react';

import { connect } from "react-redux";

import { Container, Row, Col, Image, Button, DropdownButton, Dropdown } from 'react-bootstrap';

import PropTypes from 'prop-types';

import Popup from "../components/Popup";

import { getExistingPhoto } from "../store/actions/PhotoRepo.actions";
import { updatePhotoOrder, getAllBestPhotoOrderForUser } from "../store/actions/BestPhotos.actions";

import "../assets/styles/home.css";
import "../assets/styles/topPhotos.css";

function TopPhotos(props) {

  const [authUserId, setUserId] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isHovered, setHover] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(false);
  const [imageOrderPosition, setImageOrderPosition] = useState(false);
  const [openPopup, setPopup] = useState(false);

  const historyLocation = { ...props.history.location };

  useEffect(() => {

    try {

      let orderId = null;
      let userId = null;

      if (historyLocation.state && historyLocation.state.orderId) orderId = historyLocation.state.orderId;

      if (historyLocation.state && historyLocation.state.userId) userId = historyLocation.state.userId;
      else if (props.photoAuth.id) userId = props.photoAuth.id;

      if (userId) setUserId(userId);
      if (orderId) setActiveOrderId(orderId);

      const getAllPhotosAndPhotoOrders = async () => {
        await props.getExistingPhoto()
          .then(async (response) => {

            if (!userId && response.author && response.author.id) {
              userId = response.author.id;
              setUserId(userId);
            }

            await props.getAllBestPhotoOrderForUser(userId)
              .then((photoOrders) => {

                if (!orderId && Object.keys(photoOrders).length > 0) {
                  setActiveOrderId(photoOrders[Object.keys(photoOrders)[0]].id);
                }

              });
          })
          .catch(() => {
            addNotifications('Error', 'Something went wrong! Please try again.');
          });
      };

      getAllPhotosAndPhotoOrders();

    } catch (error) {
      console.log(error);
    }

  }, []);

  const addNotifications = (head = '', message = '') => {
    const notif = [...notifications];
    notif.push({ head, message, id: new Date().getTime() });
    setNotifications(notif);
  }

  const imageHover = (hovered, id, imagePosition) => {
    if (hovered) {
      setHover(true);
      setHoveredImage(id);
      setImageOrderPosition(imagePosition);
    } else {
      setHover(false);
    }
  }

  const handleChangeImagePopup = (state) => {
    setPopup(state);
  }

  const updateExistingOrder = async (replacingImageId) => {

    if (replacingImageId) {

      const activePhotosOrder = { ...props.bestPhotosOrders[activeOrderId].order };
      activePhotosOrder[imageOrderPosition] = Number(replacingImageId);

      await props.updatePhotoOrder(activePhotosOrder, authUserId, activeOrderId)
        .catch(error => {
          addNotifications('Error', 'Something went wrong! Please try again.');
        })
        .finally(() => {
          handleChangeImagePopup(false);
          props.history.go();
        });

    }

  }

  const photoGalleryGenerator = () => {
    try {

      const outPut = [];
      const userPhotos = [...props.userPhotos];

      if (userPhotos && userPhotos.length > 0) {

        let bestPhotosOrder = null;

        if (activeOrderId) bestPhotosOrder = props.bestPhotosOrders[activeOrderId];
        else if (Object.keys(props.bestPhotosOrders).length > 0) {
          bestPhotosOrder = props.bestPhotosOrders[Object.keys(props.bestPhotosOrders)[0]];
        }

        if (bestPhotosOrder) {

          let images = [];

          let counter = 0;

          for (const orderItem in bestPhotosOrder.order) {

            for (const imageItem of userPhotos) {

              if (imageItem && Number(imageItem.id) === Number(bestPhotosOrder.order[orderItem])) {

                images.push(
                  <div className={'position-relative'} key={orderItem} onMouseOver={() => imageHover(true, imageItem.id, orderItem)}
                    onMouseLeave={() => imageHover(false, imageItem.id)}>
                    {isHovered && imageItem.id === hoveredImage && (
                      <Button size="sm" className="hover-button" variant="primary" onClick={() => handleChangeImagePopup(true)} >
                        Change
                      </Button>
                    )}
                    <Image alt={'...image'} key={imageItem.id} id={imageItem.id} src={imageItem.picture} fluid className='customize' />
                  </div>
                );

                counter++;

                if (counter % 3 === 0) {
                  outPut.push(
                    <Col xs={12} sm={12} md={4} lg={4} key={`col-${counter}`} className="padding-non" >{images}</Col>
                  );

                  images = [];
                }

                break;
              }

            }

          }

        }

      }

      return outPut;

    } catch (error) {
      console.log(error);
      return [];
    }
  }

  return (
    <>
      <div className="header">
        <h1>Your Best Selections</h1>
      </div>

      <div className="spacing-bottom-25">
        <Container>
          <Row>
            <Col sm={6} md={10}>
              {
                props.bestPhotosOrders && Object.keys(props.bestPhotosOrders).length > 1 && (
                  <DropdownButton
                    id="bestPhotoOrders"
                    variant="primary"
                    title={"List of Orders"}
                  // onChange={}
                  >
                    {
                      Object.keys(props.bestPhotosOrders).map((id) => (
                        <Dropdown.Item eventKey="1" key={id} value={id}>{id}</Dropdown.Item>
                      ))
                    }
                  </DropdownButton>

                )
              }
            </Col>
            <Col sm={6} md={1}></Col>
            <Col sm={6} md={1}></Col>
          </Row>
        </Container>
      </div>

      {
        openPopup && (<Popup imageId={hoveredImage} userPhotos={props.userPhotos} show={openPopup}
          activeOrderId={activeOrderId} onHide={() => handleChangeImagePopup(false)} updateExistingOrder={updateExistingOrder} />)
      }

      <Container className="spacing-bottom-50">
        <Row>
          {photoGalleryGenerator()}
        </Row>
      </Container>
    </>
  )
}

TopPhotos.defaultProps = {
  photoAuth: {},
  bestPhotosOrders: {},
  userPhotos: [],
};

TopPhotos.propTypes = {
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
    getExistingPhoto: () => dispatch(getExistingPhoto()),
    updatePhotoOrder: (photoOrder, userId, orderId) => dispatch(updatePhotoOrder(photoOrder, userId, orderId)),
    getAllBestPhotoOrderForUser: (userId) => dispatch(getAllBestPhotoOrderForUser(userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopPhotos);
