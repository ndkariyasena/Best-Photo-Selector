import { combineReducers } from 'redux';

import BestPhotos from './BestPhotos.reducer';
import PhotoRepo from './PhotoRepo.reducer';
import Notifications from './Notification.reducer';

const rootReducer = combineReducers({
  BestPhotos,
  PhotoRepo,
  Notifications,
});

export default rootReducer;