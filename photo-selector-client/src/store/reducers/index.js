import { combineReducers } from 'redux';

import BestPhotos from "./BestPhotos.reducer";
import PhotoRepo from "./PhotoRepo.reducer";

const rootReducer = combineReducers({
  BestPhotos,
  PhotoRepo,
});

export default rootReducer;