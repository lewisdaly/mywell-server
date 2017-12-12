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
    console.log('SavedReadingsScreen component will mount');

    ReadingStore.getSavedReadings()
    .then(readings => {
      console.log("saved readings are: ", readings);

      //TODO: load saved readings
      this.setState({
        readings
      });
    });
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', this._fetchData);
  }

  componentWillUnmount() {
   this.props.navigation.removeListener('focus', this._fetchData);
 }

  _fetchData() {
    console.log('loading data');
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
