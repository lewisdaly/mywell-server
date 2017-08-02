import React from 'react'
import ReactDOM from 'react-dom'
// import ListPage from './components/ListPage'
// import CreatePage from './components/CreatePage'
// import DetailPage from './components/DetailPage'
// import ThreadPage from './components/ThreadPage'
// import ThreadCreate from './components/ThreadCreate'
// import ThreadDetailPage from './components/ThreadDetailPage'
// import AccountPage from './components/AccountPage'
import GraphPage from './components/GraphPage'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {ApolloProvider, createNetworkInterface, ApolloClient} from 'react-apollo'
import 'tachyons'
import './index.css'

import { Nav } from './components/common'

const networkInterface = createNetworkInterface({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
})

const client = new ApolloClient({networkInterface})

//TODO: load the current phone number from local storage, and pass into nav.
//Or just try and load the user here? And pass it through somehow...

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Nav/>
        {/* <Route exact path='/' component={ThreadPage} /> */}
        <Route path='/graphs' component={GraphPage} />
        {/* <Route path='/thread/:id' component={ThreadDetailPage} /> */}
        {/* <Route path='/user/:phone' component={AccountPage}/> */}
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
)
