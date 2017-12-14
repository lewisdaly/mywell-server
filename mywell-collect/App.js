import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { enhance } from 'react-navigation-addons';


import RecordScreen from './components/RecordScreen';
import SavedReadingsScreen from './components/SavedReadingsScreen';


//TODO: read the saved readings from local storage or something.

const tabNavigatorOptions = {
  tabBarPosition: 'bottom',
  animationEnabled: false,
  tabBarOptions: {
    activeTintColor: 'blue',
  },
};

const AppNavigator = enhance(TabNavigator)({
  Record: {
    screen: RecordScreen,
  },
  Saved: {
    screen: SavedReadingsScreen
  }
}, tabNavigatorOptions);


class App extends Component {
  render() {
    const screenProps = {};

    return (
      <AppNavigator
        onNavigationStateChange={(prev, curr, action) => console.log("state changed")}
        screenProps={screenProps}
      />
    )
  }
}

export default App;
