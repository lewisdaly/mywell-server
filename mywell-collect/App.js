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

const App = TabNavigator({
  Record: {
    screen: RecordStack,
  },
  Saved: {
    screen: SavedReadingStack
  }
}, tabNavigatorOptions);

export default App;

// export default class App extends Component<{}> {
//   render() {
//     return (
//       <View>
//         <RecordPage/>
//       </View>
//     );
//   }
// }
