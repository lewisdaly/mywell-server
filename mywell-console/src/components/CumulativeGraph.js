import React, {Component} from 'react'
import { compose, gql, graphql } from 'react-apollo'
import PropTypes from 'prop-types';
import { VictoryAxis, VictoryLine, VictoryTheme, VictoryChart, VictoryGroup, VictoryBar } from 'victory';
import moment from 'moment';

import { Loading } from './common'
import CumulativeGraphLine from './CumulativeGraphLine'

class CumulativeGraph extends Component {

  isLoading() {
    if (this.props.thisYearQuery.loading ||
        this.props.lastYearQuery.loading ||
        this.props.twoYearQuery.loading) {
          return true;
        }

    return false
  }

  getTestChart() {
    return (
      <VictoryChart>
        <VictoryGroup offset={20}
          colorScale={"qualitative"}
        >
          <VictoryLine
            data={[{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 5 }]}
          />
          <VictoryLine
            data={[{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 7 }]}
          />
        </VictoryGroup>
      </VictoryChart>
    );
  }

  transformGraphData(readings) {
    return readings.map(reading => {
      const date = moment(reading.week).format('D-M');
      return {
        x: date,
        y: reading.value
      };
    });
  }

  getXTicks() {
    return this.props.thisYearQuery.cumulativeWeeklyReadings.map((reading, idx) => {
      if (idx % 10) {
        return null;
      }
      return moment(reading.week).format('MMM');
    });
  }

  render() {
    console.log("rendering!");

    if (this.isLoading()) {
      return <Loading/>
    }

    const xTicks = this.getXTicks();
    console.log(xTicks.length);

    return (
      <div>
        <VictoryChart
          domainPadding={{y: 5}}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            tickValues={xTicks}
            tickFormat={xTicks}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: {stroke: "#756f6a"},
              axisLabel: {fontSize: 15, padding: 30},
              tickLabels: {fontSize: 10, padding: 5}
            }}
            tickFormat={(y) => (y)}
            label={"Cumulative Rainfall (mm)"}
          />
          <VictoryGroup
            style={{
              parent: {
                border: "1px solid #ccc"
              },
              data: {
                fillOpacity: 0.0, strokeWidth: 5
              }
            }}
          >
            <VictoryLine
              data={this.transformGraphData(this.props.twoYearQuery.cumulativeWeeklyReadings)}
              labels={datum => {
                if (datum.eventKey === Math.floor((xTicks.length - 10) / 3)) {
                  return '2 Years Ago';
                }
                return '';
              }}
              style={{
                parent: {
                  border: "1px solid #ccc"
                },
                labels: {
                  fontSize: 10,
                }
              }}
            />
            <VictoryLine
              data={this.transformGraphData(this.props.lastYearQuery.cumulativeWeeklyReadings)}
              labels={datum => {
                if (datum.eventKey === Math.floor((xTicks.length - 2) / 3) * 2 ) {
                  return 'Last Year';
                }
                return '';
              }}
              style={{
                parent: {
                  border: "1px solid #ccc"
                },
                labels: {
                  fontSize: 10,
                }
              }}
            />
            <VictoryLine
              data={this.transformGraphData(this.props.thisYearQuery.cumulativeWeeklyReadings)}
              labels={datum => {
                if (datum.eventKey === Math.floor(xTicks.length - 2)) {
                  return 'This Year';
                }
                return '';
              }}
              style={{
                parent: {
                  border: "1px solid #ccc"
                },
                labels: {
                  fontSize: 10,
                }
              }}
            />
          </VictoryGroup>
        </VictoryChart>
      </div>
    );
  }
}

CumulativeGraph.propTypes = {
  resourceId: PropTypes.number,
  postcode: PropTypes.number,
  startDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  endDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
}

const ThisYearQuery = gql`
  query thisYearCumulativeWeeklyReadings($resourceId: Int!, $postcode: Int!, $startDate: DateTime!, $endDate: DateTime!) {
    cumulativeWeeklyReadings(resourceId:$resourceId, postcode:$postcode, startDate:$startDate, endDate:$endDate) {
      week
      value
    }
  }
`
const LastYearQuery = gql`
  query lastYearCumulativeWeeklyReadings($resourceId: Int!, $postcode: Int!, $startDate: DateTime!, $endDate: DateTime!) {
    cumulativeWeeklyReadings(resourceId:$resourceId, postcode:$postcode, startDate:$startDate, endDate:$endDate) {
      week
      value
    }
  }
`

const TwoYearQuery = gql`
  query twoYearCumulativeWeeklyReadings($resourceId: Int!, $postcode: Int!, $startDate: DateTime!, $endDate: DateTime!) {
    cumulativeWeeklyReadings(resourceId:$resourceId, postcode:$postcode, startDate:$startDate, endDate:$endDate) {
      week
      value
    }
  }
`

const CumulativeGraphWithQueries = compose(
  graphql(ThisYearQuery, {
    name: 'thisYearQuery',
    options: ({ postcode, resourceId, startDates, endDates }) => ({
      variables: {
        postcode,
        resourceId,
        startDate: startDates[0],
        endDate: endDates[0]
      }
    })
  }),
  graphql(LastYearQuery, {
    name: 'lastYearQuery',
    options: ({ postcode, resourceId, startDates, endDates }) => ({
      variables: {
        postcode,
        resourceId,
        startDate: startDates[1],
        endDate: endDates[1]
      }
    })
  }),
  graphql(TwoYearQuery, {
    name: 'twoYearQuery',
    options: ({ postcode, resourceId, startDates, endDates }) => ({
      variables: {
        postcode,
        resourceId,
        startDate: startDates[2],
        endDate: endDates[2]
      }
    })
  })
)(CumulativeGraph);

export default CumulativeGraphWithQueries;
