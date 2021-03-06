import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
} from 'react-native';
import NativeTachyons, { styles as s } from "react-native-style-tachyons";
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/MaterialIcons';


import SavedListItem from './SavedListItem';
import ReadingStore from '../api/ReadingStore';
import ServerApi from '../api/ServerApi';
import { showAlert } from '../util';

class SavedReadingsScreen extends Component<{}> {
  static navigationOptions = {
    //TODO: give this a number badge with the number of saved readings
    title: `Saved Readings`,
    tabBarIcon: ({tintColor}) => (
      <Icon name="toc" size={30} color={tintColor} />
    )
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

  saveReadingAndRemove(reading, key) {

    return ServerApi.submitReading(reading)
    .then(() => {
      showAlert('Saved!', 'Saved your reading. Thanks!');
      return this.removeReading(key);
    })
    .catch(error => {
      console.log(error);
      showAlert('Problem Saving Reading', 'There was a problem saving the reading. Please check and try again.');

      //make sure the cell gets the error
      return Promise.reject(error);
    });
  }

  removeReading(key) {
    return ReadingStore.removeSavedReading(key)
    .then(() => this.fetchData());
  }

  loadReadingRow(key, reading) {
    return (
      <SavedListItem
        key={key}
        reading={reading}
        onSavePressed={() => this.saveReadingAndRemove(reading, key)}
        onDeletePressed={() => this.removeReading(key)}
      />
    );
  }

  loadReadings() {
    const { readings } = this.state;

    if (!readings || Object.keys(readings).length < 1) {
      return (
        <Text style={[s.tc, s.f5, s.flx_1, s.pa4]}>
          Nothing here. Go to "Record" to save some new readings.
        </Text>
      );
    }

    return (
      <ScrollView style={[s.pa2, s.flx_1]}>
        {Object.keys(readings).map(key => this.loadReadingRow(key, readings[key]))}
      </ScrollView>
    )
  }


  render() {

    return (
      <View style={{flex: 1}}>
        <NavigationBar
          tintColor={'lightblue'}
          title={{title:'Saved Readings'}}
        />
        <View style={{flex: 1}}>
          {this.loadReadings()}
        </View>
      </View>
    );
  }
}

export default NativeTachyons.wrap(SavedReadingsScreen);
