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
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ position: 'relative' }}>
          <Button size="small" className={cx('nav-button')} onClick={onDetail}>
            <ArrowLeft />
            <BarChart className={cx('nav-icon')} />
          </Button>
        </div>

        <div className={cx('center')}>
          {balance && (
            <div className={cx('header')}>{`${parseTokenValue(
              balance
            )} xP+`}</div>
          )}
          <div className={cx('header')}>{market.title}</div>
          <div className={cx('body')}>
            {market.isScalar ? (
              <OutcomeScalar {...market} {...bounds} />
            ) : (
              <OutcomeCategorical {...market} />
            )}
          </div>
          <div
            className={cx('body')}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <span>{marketStatus}</span>
            <span>{resolutionDate}</span>
            <span>{tradingVolume} xP+</span>
          </div>
        </div>
        {!market.closed && !market.resolved && (
          <div style={{ position: 'relative' }}>
            <Button size="small" className={cx('nav-button')} onClick={onBet}>
              <Toll className={cx('nav-icon')} />
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>
    );
  }
}
