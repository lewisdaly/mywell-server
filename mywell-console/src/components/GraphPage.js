import React, {Component} from 'react'

import CumulativeGraph from './CumulativeGraph'


class GraphPage extends Component {


  render() {
    return (
      <div>
        <CumulativeGraph resourceId={1111} postcode={313603}/>
      </div>
    );
  }
}

export default GraphPage;
