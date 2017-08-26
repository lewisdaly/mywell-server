import React from 'react'
import ReactDOM from 'react-dom'
import GraphPage from './components/GraphPage'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {ApolloProvider, createNetworkInterface, ApolloClient} from 'react-apollo'
import 'tachyons'
import './index.css'

import { Nav } from './components/common'

console.log(process.env.REACT_APP_GRAPHQL_ENDPOINT);

const networkInterface = createNetworkInterface({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
})

const client = new ApolloClient({networkInterface})

//TODO: load the current phone number from local storage, and pass into nav.
//Or just try and load the user here? And pass it through somehow...

ReactDOM.render(
  // <ApolloProvider client={client}>
  //   <Router>
  //     <div>
  //       <Nav/>
  //       {/* <Route exact path='/' component={ThreadPage} /> */}
  //       <Route path='/graphs' component={GraphPage} />
  //       {/* <Route path='/thread/:id' component={ThreadDetailPage} /> */}
  //       {/* <Route path='/user/:phone' component={AccountPage}/> */}
  //     </div>
  //   </Router>
  // </ApolloProvider>,

  <ApolloProvider client={client}>
    <GraphPage/>
  </ApolloProvider>,
  document.getElementById('cumulativeGraphs'),
)
