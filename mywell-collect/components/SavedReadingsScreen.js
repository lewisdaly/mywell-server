import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { styles as s } from "react-native-style-tachyons";

import ReadingStore from '../api/ReadingStore';
import ServerApi from '../api/ServerApi';

class SavedReadingsScreen extends Component<{}> {
  static navigationOptions = {
    //TODO: give this a number badge with the number of saved readings
    title: `Saved Readings`,
  };

  constructor(props){
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.fetchData();
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => this.fetchData());
  }

  componentWillUnmount() {
   this.props.navigation.removeListener('focus', () => this.fetchData());
 }

  fetchData() {
    ReadingStore.getSavedReadings()
    .then(readings => {

      this.setState({readings});
    });
  }

  loadReadingRow(key, reading) {

    return (
      <View key={key}>
        <Text>{reading.resourceId}</Text>
        <Text>{reading.pincode}</Text>
        <Text>{reading.date}</Text>
        <Text>{reading.value}</Text>
      </View>
    )
  }


  render() {
    const { readings } = this.state;

    return (
      <View style={[s.ba, s.jcfs, s.pa2]}>
        {
          readings &&
          Object.keys(readings).length > 0 &&
          Object.keys(readings).map(key => this.loadReadingRow(key, readings[key]))
        }
      </View>
    );
  }
}

export default SavedReadingsScreen;
