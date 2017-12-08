import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { styles as s } from "react-native-style-tachyons";

class SavedReadingsScreen extends Component<{}> {
  static navigationOptions = {
    //TODO: give this a number badge with the number of saved readings
    title: `Saved Readings`,
  };

  constructor(props){
    super(props);

    //TODO: load saved readings
    this.state = {

    };
  }



  render() {
    return (
      <View style={[s.ba, s.jcfs, s.pa2]}>
        <Text style={[s.white, s.tc]}>
          Saved readings
        </Text>
      </View>
    );
  }
}

export default SavedReadingsScreen;
