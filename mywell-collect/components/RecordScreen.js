import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import Button from 'apsl-react-native-button'
import NativeTachyons, { styles as s } from "react-native-style-tachyons";
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ReadingStore from '../api/ReadingStore';
import ServerApi from '../api/ServerApi';
import { showAlert } from '../util';

class RecordScreen extends Component<{}> {
  static navigationOptions = {
    title: `Record`,
    tabBarIcon: ({tintColor}) => (
      <Icon name="assignment" size={30} color={tintColor} />
    )
  };

  constructor(props){
    super(props);

    this.state = {
      submitEnabled: false,
      saveForLaterEnabled: false,
      pincode: null,
      resourceId: null,
      date: moment().format('YYYY-MM-DD'),
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
        <Text cls="b mb2">Reading Value ({this.state.resourceUnits})</Text>
        <TextInput
          cls="ba pa2 mb2"
          clearButtonMode="always"
          onChangeText={(value) => this.setState({value})}
          value={this.state.value}
          placeholder={this.getValuePlaceholderName()}
          returnKeyType="next"
          keyboardType="numeric"
        />
      </View>
    );
  }

  getRecordForm() {
    const maxDate = moment().format("DD-MM-YYYY")

    return (
      <View
        cls="pb2"
        style={{}}
      >
        <Text cls="b mb2">Pincode</Text>
        <TextInput
          cls="ba pa2 mb2"
          clearButtonMode="always"
          onChangeText={(pincode) => {
            this.setState({pincode});
            return this.checkPincodeAndResourceId({pincode, resourceId:this.state.resourceId});
          }}
          value={this.state.pincode}
          placeholder={'Enter the pincode of the resource.'}
          returnKeyType="next"
          keyboardType="numeric"
        />

        <Text cls="b mb2">Resource Id</Text>
        <TextInput
          clearButtonMode="always"
          cls="ba pa2 mb2"
          onChangeText={(resourceId) => {
            this.setState({resourceId});
            return this.checkPincodeAndResourceId({resourceId, pincode:this.state.pincode});
          }}
          value={this.state.resourceId}
          placeholder={'Enter the id of the resource.'}
          returnKeyType="next"
          keyboardType="numeric"
        />

        <Text cls="b mb2">Date</Text>
        <DatePicker
          cls="pv2 mb2 asc w5"
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="2016-05-01"
          maxDate={maxDate}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => {this.setState({date: date})}}
        />

        {this.getValueField()}
      </View>
    );
  }

  getLoadingIndicator() {
    if (!this.state.loading) {
      return <View cls="ma2 h2"></View>;
    }

    return (
      <ActivityIndicator
        cls="ma2 h2"
      />
    );
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
      return <View></View>
    }

    const warningText = warnings.reduce((acc, curr) => acc + '\n' + curr);

    return (
      <View>
        <Text style={[s.tc]}>
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

    if (this.isReadingValueValid() === false) {
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

    if (this.isReadingValueValid() === false) {
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
    const {resourceId, date, pincode, value} = this.state;

    Keyboard.dismiss();
    this.setState({loading:true});

    return ServerApi.submitReading({resourceId, date, pincode, value})
    .then(() => {
      showAlert('Saved!', 'Saved your reading. Thanks!');
      this.setState({
        loading:false,
        value:null
      });
    })
    .catch(error => {
      console.log(error);
      //TODO: show alert
      showAlert('Problem Saving Reading', 'There was a problem saving the reading. Please check and try again.');
      this.setState({
        loading: false
      });
    });
  }

  saveReading() {
    const {resourceId, date, pincode, value} = this.state;

    Keyboard.dismiss();

    return ReadingStore.pushSavedReading({resourceId, date, pincode, value})
    .then(readings => {
      this.props.screenProps.readings = readings;
      this.setState({value: null});
    });
  }

  getRecordButtons() {
    return (
      <View style={{flexDirection:'row'}}>
        <Button
          style={{flex:1}}
          cls="br2 ba ph3 pa2 mb2 mr1"
          textStyle={{fontSize: 18}}
          onPress={() => this.submitReading()}
          isDisabled={this.shouldDisableSubmitButton()}
        >
          Submit
        </Button>
        <Button
          style={{flex:1}}
          cls="br2 ba ph3 pa2 mb2 ml1"
          textStyle={{fontSize: 18}}
          onPress={() => this.saveReading()}
          isDisabled={this.shouldDisableSaveButton()}
        >
          Save for Later
        </Button>
      </View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}>
        <View style={{flex: 1}}>
          <NavigationBar
            tintColor={'lightblue'}
            title={{title:'Record'}}
          />
            {this.getLoadingIndicator()}
          <View
            style={{flex: 1}}
            cls="ph2"
            >
            {this.getWarningBanner()}
            {this.getRecordForm()}
            {this.getRecordButtons()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default NativeTachyons.wrap(RecordScreen);
