import { combineReducers } from 'redux';
import categoryReducer from './reducers/categorySlice'
import userSlice from './user/userSlice'
import listingReducer from './reducers/listingSlice'
import productSlice from './reducers/productSlice'

const rootReducers = combineReducers({
    user: userSlice,
    category: categoryReducer,
    listing: listingReducer,
    product: productSlice,
});

export default rootReducers