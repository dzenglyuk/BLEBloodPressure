import logger from 'redux-logger';

import { configureStore } from '@reduxjs/toolkit';
import bluetoothReducer from './modules/bluetooth/reducer';
import { useDispatch } from 'react-redux';
import { combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { bluetoothSaga } from './modules/bluetooth/sagas';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
};

const sagaMiddleware = createSagaMiddleware();

const rootSaga = function* rootSaga() {
  yield all([fork(bluetoothSaga)]);
};

const persistedBluetoothReducer = persistReducer(persistConfig, bluetoothReducer.reducer);

const rootReducer = combineReducers({
  bluetooth: persistedBluetoothReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(logger)
      .concat(sagaMiddleware);
  },
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
