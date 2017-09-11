import React, {Component} from 'react'
import { compose, gql, graphql } from 'react-apollo'
import PropTypes from 'prop-types';
import { VictoryAxis, VictoryScatter, VictoryTheme, VictoryLegend, VictoryChart, VictoryGroup, VictoryBar } from 'victory';
import moment from 'moment';

import { Loading } from '../common'
import { DateRange } from '../../enums'


/**
 * ScatterGraph is a graph that shows individual readings (per day),
 * and the total for the entire graph at the top
 */
class ScatterGraph extends Component {

  constructor(props) {
    super(props);
  }

  getTotal() {
    const { readings } = this.props.data;

    return readings.reduce((acc, curr) => {
      return acc + curr.value;
    }, 0);
  }

  getMax() {
    const { readings } = this.props.data;

    let max = -1;
    readings.forEach(reading => {
      if (reading.value >= max) {
        max = reading.value;
      }
    });

    //Default to 10mm
    if (max <= 0) {
      return 10;
    }

    return max;
  }

  transformData(readings) {
    return readings.map(reading => {
      return {
        x: reading.date,
        y: reading.value
      };
    });
  }


  getXTicks() {
    let lastMonth = null;
    switch(this.props.dateRangeEnum) {
      case DateRange.ONE_YEAR:

        let monthCount = 1;
        const ticks = this.props.data.readings.map((reading, idx) => {
          let formatted = moment(reading.week).format('MMM')

          if (!lastMonth) {
            lastMonth = formatted;
          } else if (lastMonth !== formatted){
            lastMonth = formatted;
            return formatted;
          }
          return null;
        })
        .map((month,idx) => {
          if (month !== null) {
            monthCount += 1
          }

          if (monthCount % 2) {
            return month;
          }
          return null;
        });

        return ticks;

      case DateRange.THREE_MONTH:

        return this.props.data.readings.map((reading, idx) => {
          let formatted = moment(reading.week).format('MMM')
          if (!lastMonth) {
            lastMonth = formatted;
          } else if (lastMonth !== formatted){
            lastMonth = formatted;
            return formatted;
          }
          return null;
        });

      case DateRange.ONE_MONTH:
      default:
      return this.props.data.readings.map((reading, idx) => {
        return moment(reading.week).format('DD-MMM');
      });
    }
  }

  getDomain() {
    const { startDate, endDate } = this.props;
    const domain = {
      x: [moment(startDate).format('x'), moment(endDate).format('x')],
      y: [0, this.getMax()],
    };

    console.log("domain, ", domain);
    return domain;
  }

  render() {
    if (this.props.data.loading) {
      //TODO: give loading a nice fixed height
      return <Loading/>
    }

    //TODO: fill in empty dates



    return (
      <div>
        <p>Total Rainfall: {this.getTotal()} mm</p>
        <VictoryChart
          domainPadding={{y: 5}}
          domain={this.getDomain()}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            tickFormat={(tick) => {
              console.log("tick", tick);
              return moment(tick).format("DD-MMM")
            }}
            style={{
              grid: {
               fill: "transparent",
               stroke: "transparent"
              }
            }}
          />
          <VictoryAxis
            dependentAxis
            domain={[0, 10]}
            style={{
              axis: {stroke: "#756f6a"},
              axisLabel: {fontSize: 15, padding: 30},
              tickLabels: {fontSize: 10, padding: 5},
              grid: {
               fill: "transparent",
               stroke: "transparent"
              }
            }}
            tickFormat={(y) => (y)}
            label={"Rainfall (mm)"}
            tickCount={10}
          />
          <VictoryScatter
            size={2}
            data={this.transformData(this.props.data.readings)}
          />
        </VictoryChart>
      </div>
    );
  }
}

ScatterGraph.propTypes = {
  dateRangeEnum: PropTypes.number,
  resourceId: PropTypes.number,
  postcode: PropTypes.number,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
};

const ReadingsQuery = gql`
  query readings($resourceId: Int!, $postcode: Int!, $startDate: DateTime!, $endDate: DateTime!) {
    readings(resourceId:$resourceId, postcode:$postcode, startDate:$startDate, endDate:$endDate) {
      id
      date
      value
    }
  }
`

const ScatterGraphWithReadingsQuery = graphql(ReadingsQuery, {
  options: ({ postcode, resourceId, startDate, endDate }) => ({
    variables: {
      postcode,
      resourceId,
      startDate: startDate.getTime(),
      endDate: endDate.getTime()
    }
  })
})(ScatterGraph);

export default ScatterGraphWithReadingsQuery;
