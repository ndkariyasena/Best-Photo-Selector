import { UserTypes, CommonTypes } from "../constants";

export const getUserDetails = () => {

  return async dispatch => {

    try {

      const user = {
        "id": "101",
        "createdAt": "2019-10-28 16:07:53",
        "name": "PastBook Dev",
        "firstName": "PastBook",
        "lastName": "Dev",
        "picture": "https://www.pastbook.com/one-click-photo-products/assets/images/Logo-01.png",
        "source": "Facebook",
        "lang": "eu",
        "country": "eu",
        "sourceId": "101030302",
        "email": "help@pastbook.com",
        "collectionId": "CHhASmTpKjaHyAsSaauThRqMMjWanYkQ"
      };

      dispatch({
        type: UserTypes.GET_USER_DETAILS,
        payload: {
          status: CommonTypes.STATUS_SUCCESS,
          user,
        }
      });

      return user;

    } catch (error) {
      throw error;
    }

  };

};

export const getUserCollectionDetails = (userId) => {

  return async dispatch => {

    try {

      const collections = {
        "id": 2270,
        "code": "CHhASmTpKjaHyAsSaauThRqMMjWanYkQ",
      }

      dispatch({
        type: UserTypes.GET_USER_COLLECTIONS_DETAILS,
        payload: {
          status: CommonTypes.STATUS_SUCCESS,
          details: collections,
          userId,
        }
      });

      return collections;

    } catch (error) {
      throw error;
    }

  };

};