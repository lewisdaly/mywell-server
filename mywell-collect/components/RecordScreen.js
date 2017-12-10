import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { styles as s } from "react-native-style-tachyons";
import moment from 'moment';
import DatePicker from 'react-native-datepicker';

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
      pincode: null,
      resourceId: null,
      date: moment().format('DD-MM-YYYY'),

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

  shouldEnableValueField() {

    //if we don't have internet enable the field
    if (!this.state.hasNetworkAccess) {
      return true;
    }

    //if we do, then make sure that pincode and resourceId exists
    return this.state.isResourceValid;
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

  checkPincodeAndResourceId() {
    //TODO: validate fields
    const { pincode, resourceId } = this.state;
    console.log(pincode, resourceId);

    if (!pincode || !resourceId) {
      return Promise.resolve(null);
    }

    return this.setLoading(true)
      .then(() => ServerApi.checkResourceExists({pincode, resourceId}))
      .then(({resourceType, resourceReadingName, resourceUnits, maxValue, minValue}) => {
        console.log('checkResourceExists response:', resourceType, resourceReadingName, resourceUnits);
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
        console.error(err);

        let newState = {}
        switch (err.statusCode) {
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
    return `Enter the ${this.state.resourceReadingName} (${this.state.resourceUnits})`;
  }


  validateForm() {
    const { pincode } = this.state;

    //TODO: check
  }

  getValueField() {
    if (!this.shouldEnableValueField()) {
      return null;
    }

    let valueText = null
    if (this.state.value) {
      valueText = `${this.state.value} ${this.state.resourceUnits}`
    }

    return (
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(value) => this.setState({value})}
        value={valueText}
        placeholder={this.getValuePlaceholderName()}
        returnKeyType="next"
        keyboardType="numeric"
      />
    );
  }

  getRecordForm() {
    const maxDate = moment().format("DD-MM-YYYY")

    return (
      <View style={[s.center, s.w_100]}>
        <Text style={[s.center, s.w_100]}>Form</Text>
        <TextInput
          style={[s.h2, s.w_100, s.ph2, s.ba, s.jcfs]}
          onChangeText={(pincode) => {
            return this.checkPincodeAndResourceId({pincode, resourceId:this.state.resourceId})
              .then(() => this.setState({pincode}));
          }}
          value={this.state.pincode}
          placeholder={'Enter your Pincode'}
          returnKeyType="next"
          keyboardType="numeric"
        />
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(resourceId) => {
            return this.checkPincodeAndResourceId({resourceId, pincode:this.state.pincode})
              .then(() => this.setState({resourceId}));
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

  getWarningBanner() {
    const warnings = [];

    if (this.state.hasNetworkAccess === false) {
      warnings.push('Could not connect to server. You can always save your reading for later.');
    }

    if (this.state.pincode && this.state.resouceId && this.state.isResourceValid === false) {
      warnings.push('Resource is not valid. Please check the pincode and resourceId and try again.');
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


  shouldDisableSubmitButton() {
    //if we have no network, return true
    //if all fields are filled in, and valid return false

    return true;
  }

  shouldDisableSaveButton() {

    //if no network, and all fields are filled out, return false
    //if we have network, and all fields are filled out and valid, return false
    //else, return true

    return false;
  }

  submitReading() {
    console.log('submitting reading');
  }

  saveReading() {
    console.log('saving reading for later');
  }

  getRecordButtons() {
    return (
      <View>
        <Button
          disabled={this.shouldDisableSubmitButton()}
          onPress={this.submitReading()}
          title="Submit"/>
        <Button
          disabled={this.shouldDisableSaveButton()}
          onPress={this.saveReading()}
          title="Save for Later"/>
      </View>
    );
  }

  render() {
    return (
      <View style={[s.jcfs, s.pa2]}>
        {this.getLoadingIndicator()}
        {this.getWarningBanner()}
        {this.getRecordForm()}
        {this.getRecordButtons()}
      </View>
    );
  }
}

export default RecordScreen;
