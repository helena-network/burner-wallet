import React from 'react';
import Button from '../../../../ui-components/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ArrowLeft from '@material-ui/icons/ArrowLeft';
import History from '@material-ui/icons/History';
import CompareArrows from '@material-ui/icons/CompareArrows';
import Toll from '@material-ui/icons/Toll';

import cn from 'classnames/bind';
import BuyTokens from './BuyTokens';
import MyShares from './MyShares';
import MyTrades from './MyTrades';
import { parseTokenValue } from '../../../../utils/token'
import style from './index.scss';

const cx = cn.bind(style);

export default class Bet extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      onOverview,
      balance,
      amount,
      onChangeAmount,
      errorAmount,
      market,
      trades,
      onChangeOutcome,
      selectedOutcome,
      outcomeTokensSold,
      handleBuyTokens,
      canBet
    } = this.props;

    const { value } = this.state;

    const formattedBalance = parseTokenValue(balance);
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ position: 'relative' }}>
          <Button onClick={onOverview} className={cx('back-button')}>
            <ArrowLeft />
          </Button>
        </div>
        <div style={{ width: '100%' }}>
          <div className={cx('header')}>My balance: {formattedBalance} xP+</div>
          <div className={cx('market-title')}>{market.title}</div>
          <div style={{ display: 'flex' }}>
            <div className={cx('tab-content')}>
              {value === 0 && (
                <BuyTokens
                  amount={amount}
                  onChangeAmount={onChangeAmount}
                  errorAmount={errorAmount}
                  onChangeOutcome={onChangeOutcome}
                  selectedOutcome={selectedOutcome}
                  market={market}
                  outcomeTokensSold={outcomeTokensSold}
                  handleBuyTokens={handleBuyTokens}
                  canBet={canBet}
                />
              )}
              {value === 1 && <MyShares />}
              {/* {value === 2 && <MyTrades trades={trades} market={market} />} */}
            </div>
          </div>
        </div>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          variant="fullWidth"
          classes={{
            root: cx('tabs-root'),
            indicator: cx('tabs-indicator'),
            flexContainer: cx('tabs-flex')
          }}
        >
          <Tab
            classes={{ root: cx('tab-root'), selected: cx('tab-selected') }}
            icon={<Toll className={cx('icon')} />}
          />
          <Tab
            classes={{ root: cx('tab-root'), selected: cx('tab-selected') }}
            icon={<CompareArrows className={cx('icon')} />}
          />
          {/* <Tab
            classes={{ root: cx('tab-root'), selected: cx('tab-selected') }}
            icon={<History className={cx('icon')} />}
          /> */}
        </Tabs>
      </div>
    );
  }
}
