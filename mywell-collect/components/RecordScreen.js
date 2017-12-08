import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { styles as s } from "react-native-style-tachyons";

class RecordScreen extends Component<{}> {
  static navigationOptions = {
    title: `Record`,
  };

  constructor(props){
    super(props);

    this.state = {
      submitEnabled: false,
      saveForLaterEnabled: false,

    };
  }

  getRecordForm() {
    return (
      <View style={[s.center, s.w_100]}>
        <Text style={[s.center, s.w_100]}>Form</Text>
      </View>
    );
  }

  getRecordButtons() {
    return (
      <View>
        <Button title="Submit"/>
        <Button title="Save for Later"/>
      </View>
    );
  }

  render() {
    return (
      <View style={[s.ba, s.jcfs, s.pa2]}>
        <Text style={[s.white, s.tc]}>
          Something
        </Text>
        {this.getRecordForm()}
        {this.getRecordButtons()}
      </View>
    );
  }
}

export default RecordScreen;
