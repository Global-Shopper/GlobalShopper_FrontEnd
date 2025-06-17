import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import rootReducer from '../redux/rootReducer';
import gshopApi from '../services/gshopApi';

const store = configureStore({
	reducer: {
		rootReducer,
		[gshopApi.reducerPath]: gshopApi.reducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false
		}).concat(gshopApi.middleware)
});

const persistor = persistStore(store);

//action logout reset state

export { store, persistor };
