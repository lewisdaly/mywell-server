import React, {Component} from 'react'
import { compose, gql, graphql } from 'react-apollo'
import PropTypes from 'prop-types';
import { VictoryAxis, VictoryLine, VictoryTheme, VictoryLegend, VictoryChart, VictoryGroup, VictoryBar } from 'victory';
import moment from 'moment';

import { Loading } from '../common'
import { DateRange } from '../../enums'


class CumulativeGraph extends Component {

  isLoading() {
    if (this.props.thisYearQuery.loading ||
        this.props.lastYearQuery.loading ||
        this.props.twoYearQuery.loading) {
          return true;
        }

    return false
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
    let lastMonth = null;
    switch(this.props.dateRangeEnum) {
      case DateRange.ONE_YEAR:

        let monthCount = 1;
        const ticks = this.props.thisYearQuery.cumulativeWeeklyReadings.map((reading, idx) => {
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

        return this.props.thisYearQuery.cumulativeWeeklyReadings.map((reading, idx) => {
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
      return this.props.thisYearQuery.cumulativeWeeklyReadings.map((reading, idx) => {
        return moment(reading.week).format('DD-MMM');
      });
    }
  }

  render() {
    if (this.isLoading()) {
      return <Loading/>
    }

    const xTicks = this.getXTicks();

    return (
      <div>
        <VictoryChart
          domainPadding={{y: 5}}
          theme={VictoryTheme.material}
        >
          <VictoryLegend
            data={[
              {name: '2 Years Ago'},
              {name: '1 Year Ago'},
              {name: 'This Year'}
              ]}
          />
          <VictoryAxis
            tickValues={xTicks}
            tickFormat={xTicks}
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
            label={"Cumulative Rainfall (mm)"}
            tickCount={10}
          />
          <VictoryGroup
            style={{
              parent: {
                border: "1px solid #ccc"
              },
              data: {
                fillOpacity: 0.0, strokeWidth: 1
              }
            }}
          >
            <VictoryLine
              data={this.transformGraphData(this.props.twoYearQuery.cumulativeWeeklyReadings)}
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
  dateaRangeEnum: PropTypes.number,
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
        startDate: startDates[0].getTime(),
        endDate: endDates[0].getTime()
      }
    })
  }),
  graphql(LastYearQuery, {
    name: 'lastYearQuery',
    options: ({ postcode, resourceId, startDates, endDates }) => ({
      variables: {
        postcode,
        resourceId,
        startDate: startDates[1].getTime(),
        endDate: endDates[1].getTime()
      }
    })
  }),
  graphql(TwoYearQuery, {
    name: 'twoYearQuery',
    options: ({ postcode, resourceId, startDates, endDates }) => ({
      variables: {
        postcode,
        resourceId,
        startDate: startDates[2].getTime(),
        endDate: endDates[2].getTime()
      }
    })
  })
)(CumulativeGraph);

export default CumulativeGraphWithQueries;
