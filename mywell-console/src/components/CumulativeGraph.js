import React, {Component} from 'react'
import { gql, graphql } from 'react-apollo'
import PropTypes from 'prop-types';
import { VictoryAxis, VictoryLine, VictoryChart, VictoryGroup, VictoryBar } from 'victory';
import moment from 'moment';

import { Loading } from './common'
import CumulativeGraphLine from './CumulativeGraphLine'

class CumulativeGraph extends Component {

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

  render() {
    if (this.props.data.loading || this.props.lastYearQuery.loading) {
      return <Loading/>
    }

    const xTicks = this.props.data.cumulativeWeeklyReadings.map((reading, idx) => {
      if (idx % 10) {
        return null;
      }
      return moment(reading.week).format('MMM');
    });

    const data = this.props.data.cumulativeWeeklyReadings.map(reading => {
      const date = moment(reading.week).format('D-M-Y');
      console.log(reading.value)
      return {
        x:reading.week,
        y: reading.value
        // value: idx * this.props.max
      };
    });

    const data2 = this.props.lastYearQuery.cumulativeWeeklyReadings.map(reading => {
      const date = moment(reading.week).format('D-M-Y');
      return {
        x:reading.week,
        y: reading.value
        // value: idx * this.props.max
      };
    })

    console.log("xTicks:", xTicks);

    //Hmm this is tricky - we need to plot all graphs on the same scale. This means finding the Max for 3 graphs (min will be 0),
    //And scaling each one.
    //Getting less and less confident that this will work.

    return (
      <div>
        {this.getTestChart()}
        <VictoryChart
          domainPadding={20}
        >
          {/* <VictoryAxis
            // tickValues={xTicks}
            // tickFormat={xTicks}
          /> */}
          <VictoryAxis
            dependentAxis
            // tickValues={}
            tickFormat={(y) => (y)}
            domain={[0, 500  ]}
            label={"Cumulative Rainfall (mm)"}
          />
          <VictoryGroup
            // colorScale={["tomato", "orange", "gold"]}
            offset={20}
            colorScale={"qualitative"}
            style={{
              parent: {
                border: "1px solid #ccc"
              },
              data: {
                fillOpacity: 0.0, stroke: "black", strokeWidth: 3
              }
            }}
          >
            <VictoryLine
              style={this.props.style}
              data={data}
            />
            <VictoryLine
              style={this.props.style}
              data={data2}
            />
            {/* <CumulativeGraphLine
              // style={{
              //   data: { stroke: "#c43a31" },
              // }}
              resourceId={this.props.resourceId}
              postcode={this.props.postcode}
              startDate={moment('2016-08-01').toDate()}
              endDate={moment('2017-08-01').toDate()}
              max={10}
            /> */}
            {/* <CumulativeGraphLine
              style={{
                data: { stroke: "#a12b31" },
                fillOpacity: 0.5
              }}
              resourceId={this.props.resourceId}
              postcode={this.props.postcode}
              startDate={moment('2015-08-01').toDate()}
              endDate={moment('2016-08-01').toDate()}
              max={100}
            />
            <CumulativeGraphLine
              // style={{
              //   data: { stroke: "#f43a31" }
              // }}
              resourceId={this.props.resourceId}
              postcode={this.props.postcode}
              startDate={moment('2014-08-01').toDate()}
              endDate={moment('2015-08-01').toDate()}
            /> */}
          </VictoryGroup>
        </VictoryChart>
      </div>
    );
  }
}

CumulativeGraph.propTypes = {
  resourceId: PropTypes.number,
  postcode: PropTypes.number,
}

const CumulativeQuery = gql`
  query cumulativeWeeklyReadings($resourceId: Int!, $postcode: Int!, $startDate: DateTime!, $endDate: DateTime!) {
    cumulativeWeeklyReadings(resourceId:$resourceId, postcode:$postcode, startDate:$startDate, endDate:$endDate) {
      week
      value
    }
  }
`


const GraphPageWithCumulativeQuery = graphql(CumulativeQuery, {
  options: () => ({
    variables: {
      resourceId:1111,
      postcode:313603,
      startDate: moment('2014-08-01').toDate(),
      endDate: moment('2015-08-01').toDate()
    }
  })
})(CumulativeGraph);

const LastYearCumulativeQuery = gql`
  query lastYearCumulativeWeeklyReadings($resourceId: Int!, $postcode: Int!, $startDate: DateTime!, $endDate: DateTime!) {
    cumulativeWeeklyReadings(resourceId:$resourceId, postcode:$postcode, startDate:$startDate, endDate:$endDate) {
      week
      value
    }
  }
`
const GraphPageWithLastYearCumulativeQuery = graphql(LastYearCumulativeQuery, {
  name: 'lastYearQuery',
  options: () => ({
    variables: {
      resourceId:1111,
      postcode:313603,
      startDate: moment('2015-08-01').toDate(),
      endDate: moment('2016-08-01').toDate()
    }
  })
})(GraphPageWithCumulativeQuery);

export default GraphPageWithLastYearCumulativeQuery;
