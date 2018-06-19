import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
//import OneSignal from 'react-native-onesignal';

import { Provider } from 'react-redux'
import store from './Store'
import AppNavigation from './Navigation'
//import { ONE_SIGNAL_APP_ID } from "./src/Consts";

if (__DEV__) {
  require('./ReactotronConfig');

  const Reactotron = require('reactotron-react-native').default;
}

export default class App extends React.Component {

  componentDidMount() {
    //OneSignal.init(ONE_SIGNAL_APP_ID, { kOSSettingsKeyAutoPrompt: true });
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          {/* <StatusBar
            backgroundColor={primary}
            barStyle="light-content"
          /> */}
          <AppNavigation />
        </View>
      </Provider>
    );
  }
}
