import React from 'react';
import moment from 'moment';
import Button from '../../../../ui-components/Button';
import BarChart from '@material-ui/icons/BarChart';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Toll from '@material-ui/icons/Toll';

import cn from 'classnames/bind';
import OutcomeCategorical from './OutcomeCategorical';
import OutcomeScalar from './OutcomeScalar';
import { RESOLUTION_TIME } from '../../../../utils/constants';
import { parseTokenValue } from '../../../../utils/token';
import style from './index.scss';

const cx = cn.bind(style);
export default class Market extends React.Component {
  render() {
    const { market, onBet, onDetail, balance } = this.props;

    let marketStatus;
    if (!market.closed && !market.resolved) {
      marketStatus = 'OPEN';
    } else if (market.closed) {
      marketStatus = 'CLOSED';
    } else if (market.resolved) {
      marketStatus = 'RESOLVED';
    }

    const tradingVolume = parseTokenValue(market.volume);

    const resolutionDate = moment(market.resolution).format(
      RESOLUTION_TIME.ABSOLUTE_FORMAT
    );
    const bounds = market.bounds
      ? {
          upperBound: market.bounds.upper,
          lowerBound: market.bounds.lower,
          unit: market.bounds.unit,
          decimals: market.bounds.decimals
        }
      : {};

    return (
      <div className={cx('overview-container')}>
        <div className={cx('center')}>
          {/* {balance && (
            <div className={cx('header')}>{`${parseTokenValue(
              balance
            )} xP+`}</div>
          )} */}
          <div className={cx('title-header')}>
            <div className={cx('title')}>{market.title}</div>
            <div className={cx('subtitle')}>{market.description}</div>
          </div>
          <div className={cx('body')}>
            {market.isScalar ? (
              <OutcomeScalar {...market} {...bounds} />
            ) : (
              <OutcomeCategorical {...market} />
            )}
          </div>
          <div className={cx('details')}>
            <div className={cx('resolution-date')}>
              Closing at {resolutionDate}
            </div>
            <div className={cx('volume')}>
              Volume: {tradingVolume} xP+
            </div>
            
          </div>
          {/* <div
            className={cx('body')}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <span>{marketStatus}</span>
            <span>{resolutionDate}</span>
            <span>{tradingVolume} xP+</span>
          </div> */}
        </div>

        <div className={cx('market-nav')}>
          <Button variant="outlined" size="small" className={cx('nav-button', 'pull-left')} onClick={onDetail}>
            <ArrowLeft />
            Market History
          </Button>
          {!market.closed && !market.resolved && (
            <Button variant="contained" size="small" className={cx('nav-button', 'pull-right', 'bet-button')} onClick={onBet}>
              Bet
              <ArrowRight />
            </Button>
          )}
        </div>
        
      </div>
    );
  }
}
