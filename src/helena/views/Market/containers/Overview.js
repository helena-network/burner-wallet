import React from 'react';
import Overview from '../components/Overview/index';

export default class OverviewContainer extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    // const { onDetail, onBet, market } = this.props;
    return <Overview {...this.props} />;
  }
}
