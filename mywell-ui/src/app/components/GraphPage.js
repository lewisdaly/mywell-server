import React, {Component} from 'react'
import PropTypes from 'prop-types';
import moment from 'moment';

import CumulativeGraph from './CumulativeGraph'
import { SelectButton } from './common'
import '../style/App.css'

const DateRange = {
  ONE_YEAR: 0,
  THREE_MONTH: 1,
  ONE_MONTH: 2
};

class GraphPage extends Component {

  constructor(props) {
    super(props);
    const today = moment().startOf('day');

    const startDates = [
      today.clone().subtract(1, 'years').toDate(),
      today.clone().subtract(2, 'years').toDate(),
      today.clone().subtract(3, 'years').toDate(),
    ];

    const endDates = [
      today.toDate(),
      today.clone().subtract(1, 'years').toDate(),
      today.clone().subtract(2, 'years').toDate(),
    ];

    this.state = {
      startDates,
      endDates
    }
  }

  changeDates(dateRangeEnum) {
    let startDates = [];
    const today = moment().startOf('day');
    const oneYear = today.clone().subtract(1, 'years');
    const twoYear = today.clone().subtract(2, 'years');
    const threeYear = today.clone().subtract(3, 'years');

    switch (dateRangeEnum) {
      case DateRange.ONE_YEAR:
        startDates = [
          oneYear.toDate(),
          twoYear.toDate(),
          threeYear.toDate()
        ];
        break;
      case DateRange.THREE_MONTH:
        startDates = [
          today.clone().subtract(3, 'months').toDate(),
          oneYear.clone().subtract(3, 'months').toDate(),
          twoYear.clone().subtract(3, 'months').toDate(),
        ];

        break;
      case DateRange.ONE_MONTH:
      default:
        startDates = [
          today.clone().subtract(1, 'months').toDate(),
          oneYear.clone().subtract(1, 'months').toDate(),
          twoYear.clone().subtract(1, 'months').toDate(),
        ];
      break;
    }

    this.setState({
      startDates
    });
  }

  render() {
    const buttonConfig = [
      { callback:() => this.changeDates(DateRange.ONE_YEAR), name: "1 Year" },
      { callback:() => this.changeDates(DateRange.THREE_MONTH), name: "3 Month" },
      { callback:() => this.changeDates(DateRange.ONE_MONTH), name: "1 Month" },
    ];

    return (
      <div>
        <CumulativeGraph
          resourceId={this.props.resourceId}
          postcode={this.props.postcode}
          startDates={this.state.startDates}
          endDates={this.state.endDates}
        />
        <SelectButton
          buttonConfig={buttonConfig}
          selectedIndex={2}
        />
      </div>
    );
  }
}

GraphPage.propTypes = {
  resourceId: PropTypes.number,
  postcode: PropTypes.number
}

export default GraphPage;
