/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigator from './navigation';
import { store, persistor } from './redux/store';
import TimerWrapper from './components/TimerWrapper';
import { PersistGate } from 'redux-persist/integration/react';

const App: FC = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TimerWrapper>
            <RootStackNavigator />
          </TimerWrapper>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
