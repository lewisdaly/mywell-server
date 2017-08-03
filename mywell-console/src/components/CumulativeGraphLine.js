import React, {Component} from 'react'
import { gql, graphql } from 'react-apollo'
import PropTypes from 'prop-types';
import { VictoryAxis, VictoryLine, VictoryChart } from 'victory';
import moment from 'moment';


class CumulativeGraphLine extends Component {

  render() {
    if (this.props.data.loading) {
      return null;
    }

    const data = this.props.data.cumulativeWeeklyReadings.map((reading, idx) => {
      const date = moment(reading.week).format('D-M-Y');
      return {
        date,
        // value: this.props.max/reading.value
        value: idx * this.props.max
      };
    });

    console.log(data.map(data => data.value));

    return (
      <VictoryLine
        style={this.props.style}
        data={data}
        x="date"
        y="value"
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }
        }}
      />
    )
  }
}

CumulativeGraphLine.propTypes = {
  resourceId: PropTypes.number,
  postcode: PropTypes.number,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  style: PropTypes.object,

}

const CumulativeQuery = gql`
  query cumulativeWeeklyReadings($resourceId: Int!, $postcode: Int!, $startDate: DateTime!, $endDate: DateTime!) {
    cumulativeWeeklyReadings(resourceId:$resourceId, postcode:$postcode, startDate:$startDate, endDate:$endDate) {
      week
      value
    }
  }
`
const CumulativeGraphLineWithCumulativeQuery = graphql(CumulativeQuery)(CumulativeGraphLine);

export default CumulativeGraphLineWithCumulativeQuery;
