import React, { Component } from 'react'
import {ApolloProvider, createNetworkInterface, ApolloClient} from 'react-apollo'
import PropTypes from 'prop-types';

import GraphPage from './GraphPage'

const networkInterface = createNetworkInterface({
  uri: REACT_APP_GRAPHQL_ENDPOINT
});

const client = new ApolloClient({networkInterface})

class ApolloGraphContainer extends Component {
  constructor() {
    super();
  }

  render() {

    return (
      <ApolloProvider client={client}>
        <GraphPage
          resourceId={this.props.resourceId}
          postcode={this.props.postcode}
        />
      </ApolloProvider>
    )
  }
};

ApolloGraphContainer.propTypes = {
  resourceId: PropTypes.number.isRequired,
  postcode: PropTypes.number.isRequired
};

export default ApolloGraphContainer;
