import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

import RecordScreen from './components/RecordScreen';
import SavedReadingsScreen from './components/SavedReadingsScreen';


//TODO: read the saved readings from local storage or something.

const tabNavigatorOptions = {
  tabBarPosition: 'bottom',
  animationEnabled: false,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
};

const RecordStack = StackNavigator({
  Home: {
    screen: RecordScreen,
  },
});

const SavedReadingStack = StackNavigator({
  Home: {
    screen: SavedReadingsScreen,
  },
});

const AppNavigator = TabNavigator({
  Record: {
    screen: RecordStack,
  },
  Saved: {
    screen: SavedReadingStack
  }
}, tabNavigatorOptions);


class App extends Component {
  render() {
    const screenProps = {
      savedReadings: [
        {id: 1234},
      ],
      user: {
        name: 'John Doe',
        username: 'johndoe123',
        email: 'john@doe.com',
      },
    }

    return (
      <AppNavigator screenProps={screenProps} />
    )
  }
}

export default App;
