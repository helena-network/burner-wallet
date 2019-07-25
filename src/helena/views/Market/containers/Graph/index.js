import React from 'react';

import { pmService } from '../../../../services';
import Graph from '../index';
import getMarketGraph from './utils/getGraph';

export default class GraphContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      marketGraph: []
    };
  }

  componentDidMount() {
    const { market } = this.props;
    pmService.getMarketTrades(market.address).then((trades) => {
      const marketGraph = getMarketGraph(market, trades);
      console.log(marketGraph);
      this.setState({ marketGraph });
    });
  }

  render() {
    const { onOverview, market } = this.props;
    const { marketGraph } = this.state;
    return <Graph onOverview={onOverview} data={marketGraph} market={market} />;
  }
}
