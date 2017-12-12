import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles as s } from "react-native-style-tachyons";
import moment from 'moment';
import DatePicker from 'react-native-datepicker';

import ReadingStore from '../api/ReadingStore';
import ServerApi from '../api/ServerApi';

class RecordScreen extends Component<{}> {
  static navigationOptions = {
    title: `Record`,
  };

  constructor(props){
    super(props);

    this.state = {
      submitEnabled: false,
      saveForLaterEnabled: false,
      //TODO: change back to null
      pincode: '313603',
      resourceId: '111',
      date: moment().format('DD-MM-YYYY'),
      value: null,

      resourceUnits: null,
      resourceType: null,
      resourceReadingName: null,
      maxValue: null,
      minValue: null,

      hasNetworkAccess: null,
      isAuthenciated: null,
      isResourceValid: null,

      isLoading: false,
    };
  }

  /**
   * Change the loading state in a promise
   */
   setLoading(loading) {
     return new Promise((resolve, reject) =>  {
       this.setState({loading});

       return resolve(loading);
     });
   }

  checkPincodeAndResourceId({ pincode, resourceId }) {
    if (!pincode || !resourceId || resourceId.length < 3 ) {

      this.setState({
        isResourceValid: false,
        hasNetworkAccess: null,
        isAuthenciated: null,
      });
      return Promise.resolve(null);
    }

    return this.setLoading(true)
      .then(() => ServerApi.checkResourceExists({pincode, resourceId}))
      .then(({resourceType, resourceReadingName, resourceUnits, maxValue, minValue}) => {
        return this.setState({
          resourceType,
          resourceReadingName,
          resourceUnits,
          maxValue,
          minValue,
          isResourceValid: true,
          hasNetworkAccess: true,
        });
      })
      .then(() => this.setLoading(false))
      .catch(err => {
        console.log('error', err);

        let newState = {}
        switch (err.status) {
          case 400:
            /* wrong pincode or resourceId */
            newState = {
              hasNetworkAccess: true,
              isAuthenciated: true,
              isResourceValid: false
            };
            break;
          case 401:
            /* unauthenticated */
            newState = {
              hasNetworkAccess: true,
              isAuthenciated: false,
              isResourceValid: null
            };
            break;
          default:
            /*Just assume network error*/
            newState = {
              hasNetworkAccess: false,
              isAuthenciated: null,
              isResourceValid: null
            };
        }

        this.setState(newState);
      })
      .then(() => this.setLoading(false));
  }

  getValuePlaceholderName() {
    if (!this.state.hasNetworkAccess) {
      return `Enter the reading.`;
    }

    return `Enter the ${this.state.resourceReadingName} (${this.state.resourceUnits})`;
  }

  getValueField() {
    if (!this.shouldEnableValueField()) {
      return null;
    }

    return (
      <View>
        <TextInput
          clearButtonMode="always"
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(value) => this.setState({value})}
          value={this.state.value}
          placeholder={this.getValuePlaceholderName()}
          returnKeyType="next"
          keyboardType="numeric"
        />
        <Text>{this.state.resourceUnits}</Text>
      </View>
    );
  }

  getRecordForm() {
    const maxDate = moment().format("DD-MM-YYYY")

    return (
      <View style={[s.center, s.w_100]}>
        <Text style={[s.center, s.w_100]}>Form</Text>
        <TextInput
          clearButtonMode="always"
          style={[s.h2, s.w_100, s.ph2, s.ba, s.jcfs]}
          onChangeText={(pincode) => {
            this.setState({pincode});
            return this.checkPincodeAndResourceId({pincode, resourceId:this.state.resourceId});
          }}
          value={this.state.pincode}
          placeholder={'Enter your Pincode'}
          returnKeyType="next"
          keyboardType="numeric"
        />
        <TextInput
          clearButtonMode="always"
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(resourceId) => {
            this.setState({resourceId});
            return this.checkPincodeAndResourceId({resourceId, pincode:this.state.pincode});
          }}
          value={this.state.resourceId}
          placeholder={'Enter your Resource Id'}
          returnKeyType="next"
          keyboardType="numeric"
        />
        <DatePicker
          style={[s.h2, s.w_100, s.ph2, s.ba, s.jcfs]}
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="DD-MM-YYYY"
          minDate="2016-05-01"
          maxDate={maxDate}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(date) => {this.setState({date: date})}}
        />
        {this.getValueField()}
      </View>
    );
  }

  getLoadingIndicator() {
    if (!this.state.loading) {
      return null;
    }

    return <ActivityIndicator/>
  }

  //TODO: get warning for when new reading is behind old date of reading
  getInvalidReadingWarningText() {
    const { maxValue, minValue, resourceUnits } = this.state;
    let warningText = 'The value you provided is not valid for this resource.';

    const resourceUnitsString = resourceUnits ? resourceUnits : '';

    if (maxValue !== null) {
      warningText += ` The maximum value is ${maxValue.toFixed(2)}${resourceUnitsString}.`
    }

    if (minValue !== null) {
      warningText += ` The minimum value is ${minValue.toFixed(2)}${resourceUnitsString}.`
    }

    return warningText;
  }

  getWarningBanner() {
    const warnings = [];

    if (this.state.hasNetworkAccess === false) {
      warnings.push('Could not connect to server. You can always save your reading for later.');
    }

    if (this.state.pincode && this.state.resourceId && this.state.isResourceValid === false) {
      warnings.push('Could not find a resource with those details. Please check the pincode and resourceId and try again.');
    }

    if(this.state.isAuthenciated === false) {
      warnings.push('You must be logged in to submit your reading');
    }

    if(this.isReadingValueValid() === false) {
      warnings.push(this.getInvalidReadingWarningText());
    }

    if (warnings.length === 0) {
      return null;
    }

    const warningText = warnings.reduce((acc, curr) => acc + '\n' + curr);
    return (
      <View>
        <Text style={[s.white, s.tc]}>
          {warningText}
        </Text>
      </View>
    );
  }


  shouldEnableValueField() {

    //if we don't have internet enable the field
    if (this.state.hasNetworkAccess === false) {
      return true;
    }

    //if we do, then make sure that pincode and resourceId exists
    return this.state.isResourceValid;
  }



  /**
   * Check the max and min values. If null, then just return true
   */
  isReadingValid() {
    const { maxValue, minValue, value, isResourceValid } = this.state;

    if (value === null || typeof value === undefined || value.length === 0) {
      return false;
    }

    if (isResourceValid === false) {
      return false;
    }

    return true;
  }

  /**
   * Check the max and min values. If null, then just return true
   */
  isReadingValueValid() {
    const { maxValue, minValue, value } = this.state;

    if (maxValue !== null && value > maxValue) {
      return false;
    }

    if (minValue !== null && value < minValue) {
      return false;
    }

    return true;
  }

  validateForm() {
    const { pincode } = this.state;

    //TODO: check
  }


  shouldDisableSubmitButton() {
    if (this.state.hasNetworkAccess === false) {
      return true;
    }

    if (this.state.isAuthenciated === false) {
      return true;
    }

    if (this.isReadingValid() === true) {
      return false;
    }

    //if we have no network, return true
    //if all fields are filled in, and valid return false
    return true;
  }

  shouldDisableSaveButton() {
    const { isResourceValid } = this.state;
    const isReadingValid = this.isReadingValid();

    if (isResourceValid === false) {
      return true;
    }

    if (isReadingValid === false) {
      return true;
    }

    //if no network, and all fields are filled out, return false
    //if we have network, and all fields are filled out and valid, return false
    //else, return true

    return false;
  }

  submitReading() {
    console.log('submitting reading');
  }

  saveReading() {
    const {resourceId, date, pincode, value} = this.state;

    return ReadingStore.pushSavedReading({resourceId, date, pincode, value})
    .then(readings => {

      this.props.screenProps.readings = readings;
      this.setState({value: null});
    });
  }

  getRecordButtons() {
    return (
      <View>
        <Button
          disabled={this.shouldDisableSubmitButton()}
          onPress={() => this.submitReading()}
          title="Submit"/>
        <Button
          disabled={this.shouldDisableSaveButton()}
          onPress={() => this.saveReading()}
          title="Save for Later"/>
      </View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss} accessible={false}>
        <View style={[s.jcfs, s.pa2]}>
            {this.getLoadingIndicator()}
            {this.getWarningBanner()}
            {this.getRecordForm()}
            {this.getRecordButtons()}
        </View>
    </TouchableWithoutFeedback>
    );
  }
}

export default RecordScreen;
