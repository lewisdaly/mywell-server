import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  Button,
  Text,
} from 'react-native';
import { styles as s } from "react-native-style-tachyons";
import PropTypes from 'prop-types';

import { getHashForReading } from '../util';

class SavedListItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  getButtons() {
    const { loading } = this.state;

    if (loading) {
      return (
        <ActivityIndicator style={[s.flx_1, s.flx_row]}/>
      );
    }

    return (
      <View style={[s.flx_1, s.flx_row]}>
        <Button
          title="Save"
          onPress={() => {
            this.setState({loading:true});

            return this.props.onSavePressed()
            .catch(err => {
              console.log("save pressed error");
              this.setState({loading:false});
            });
          }}/>
        <Button
          title="Delete"
          onPress={() => this.props.onDeletePressed()}/>
      </View>
    );
  }

  render() {
    const { reading: {resourceId, value, date, pincode} } = this.props;

    const cellContents = `${date}: ${pincode}/${resourceId} ${value}`;
    return (
      <View style={[s.flx_1, s.flx_row, s.h3, s.bb, s.b__red]}>
        <Text>{cellContents}</Text>
        {this.getButtons()}
      </View>
    );
  }
}

SavedListItem.propTypes = {
  reading: PropTypes.shape({
    resourceId: PropTypes.string,
    value: PropTypes.string,
    date: PropTypes.string,
    pincode: PropTypes.string
  }),
  onDeletePressed: PropTypes.func,
  onSavePressed: PropTypes.func,
}

export default SavedListItem;
