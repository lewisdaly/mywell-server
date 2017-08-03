import React, {Component} from 'react'
import { gql, graphql } from 'react-apollo'
import PropTypes from 'prop-types';
import { VictoryAxis, VictoryLine, VictoryChart } from 'victory';
import moment from 'moment';

import { Loading } from './common'
import CumulativeGraphLine from './CumulativeGraphLine'

class CumulativeGraph extends Component {

  render() {
    if (this.props.data.loading) {
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
      return {
        date,
        value: reading.value
      };
    });

    //Hmm this is tricky - we need to plot all graphs on the same scale. This means finding the Max for 3 graphs (min will be 0),
    //And scaling each one.
    //Getting less and less confident that this will work.

    return (
      <div>
        <VictoryChart
          domainPadding={20}
        >
          <VictoryAxis
            tickValues={xTicks}
            tickFormat={xTicks}
          />
          <VictoryAxis
            dependentAxis
            // tickValues={}
            tickFormat={(y) => (y)}
            domain={[0, 5300  ]}
            label={"Cumulative Rainfall (mm)"}
          />

          {/* <VictoryLine
            data={data}
            x="date"
            y="value"
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
          /> */}

          <CumulativeGraphLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc"}
            }}
            resourceId={this.props.resourceId}
            postcode={this.props.postcode}
            startDate={moment('2016-08-01').toDate()}
            endDate={moment('2017-08-01').toDate()}
            max={10}
          />
          <CumulativeGraphLine
            style={{
              data: { stroke: "#a12b31" },
              parent: { border: "1px solid #ccc"}
            }}
            resourceId={this.props.resourceId}
            postcode={this.props.postcode}
            startDate={moment('2015-08-01').toDate()}
            endDate={moment('2016-08-01').toDate()}
            max={100}
          />
          {/* <CumulativeGraphLine
            style={{
              data: { stroke: "#f43a31" },
              parent: { border: "1px solid #ccc"}
            }}
            resourceId={this.props.resourceId}
            postcode={this.props.postcode}
            startDate={moment('2014-08-01').toDate()}
            endDate={moment('2015-08-01').toDate()}
          /> */}
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
  query cumulativeWeeklyReadings($resourceId: Int!, $postcode: Int!) {
    cumulativeWeeklyReadings(resourceId:$resourceId, postcode:$postcode) {
      week
      value
    }
  }
`

const GraphPageWithCumulativeQuery = graphql(CumulativeQuery, {
  // options: ({ match }) => ({variables: {
  //   resourceId: match.params.resourceId,
  //   postcode: match.params.postcode,
  // }})
})(CumulativeGraph);

export default GraphPageWithCumulativeQuery;
