import React, {Component} from 'react'
import PropTypes from 'prop-types';
import moment from 'moment';

import CumulativeGraph from './CumulativeGraph'
import ScatterGraph from './ScatterGraph'
import { SelectButton } from '../common'
import { DateRange } from '../../enums'

console.log("dateRange", DateRange)

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
      endDates,
      dateRangeEnum: DateRange.ONE_YEAR
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
      startDates,
      dateRangeEnum
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
        <SelectButton
          buttonConfig={buttonConfig}
          selectedIndex={0}
        />
        <CumulativeGraph
          className="mw-50"
          resourceId={this.props.resourceId}
          postcode={this.props.postcode}
          startDates={this.state.startDates}
          endDates={this.state.endDates}
          dateRangeEnum={this.state.dateRangeEnum}
        />
        <ScatterGraph
          resourceId={this.props.resourceId}
          postcode={this.props.postcode}
          startDate={this.state.startDates[0]}
          endDate={this.state.endDates[0]}
          dateRangeEnum={this.state.dateRangeEnum}
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
