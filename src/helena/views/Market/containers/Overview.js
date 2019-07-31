import React from 'react';
import Overview from '../components/Overview/index';
import Decimal from 'decimal.js';
import { pmService } from '../../../services';
import { getOutcomeTokenCount, buyShares } from './Bet/BuyTokens/utils';

const NUMBER_REGEXP = /^-?\d+\.?\d*$/;
const INTERVAL_TRADES_REFRESH = 15000;
export default class OverviewContainer extends React.Component {
  constructor(props) {
    super(props);

    const market = Object.assign({}, this.props.market);
    const { outcomeTokensSold } = market;

    this.originalOutcomeTokensSold = [...outcomeTokensSold];
    this.state = {
      amount: '',
      errorAmount: null,
      selectedOutcome: null,
      outcomeTokensSold,
      canBet: false,
      // My Trades
      trades: []
    };
  }

  componentDidUpdate() {
    const { canInteract } = this.props;
    if (canInteract && !this.tradesInterval) {
      this.refreshTrades();

      this.tradesInterval = setInterval(
        this.refreshTrades,
        INTERVAL_TRADES_REFRESH
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.tradesInterval);
  }

  refreshTrades = () => {
    pmService.getAccountTrades(this.props.market.address).then((trades) => {
      this.setState({ trades });
    });
  };

  simulateBet = () => {
    const { selectedOutcome, amount } = this.state;
    const originalOutcomeSold = [...this.originalOutcomeTokensSold];

    const haveSelected = selectedOutcome === 0 || selectedOutcome;
    const canRunSimulation = !this.checkAmount(amount) && haveSelected;

    if (canRunSimulation) {
      const selectedOutcomeSold = Decimal(originalOutcomeSold[selectedOutcome]);
      const newOutcomeSold = selectedOutcomeSold.add(Decimal(amount).mul(1e18));
      const newOutcomeTokensSold = originalOutcomeSold;
      newOutcomeTokensSold[selectedOutcome] = newOutcomeSold.toString();
      this.setState({ outcomeTokensSold: newOutcomeTokensSold });
    }

    if (!amount) {
      this.setState({ outcomeTokensSold: originalOutcomeSold });
    }
  };

  checkAmount = (investmentValue) => {
    if (!investmentValue) {
      return 'Enter the amount';
    }

    const validInvestment =
      NUMBER_REGEXP.test(investmentValue) &&
      Decimal(investmentValue).gte(1e-18);

    if (!validInvestment) {
      return 'Invalid amount';
    }

    const decimalValue = Decimal(investmentValue);
    if (decimalValue.lte(0)) {
      return "Number can't be negative or equal to zero";
    }

    const balance = Decimal(this.props.balance).div(1e18);
    if (decimalValue.gt(balance)) {
      return "You're trying to enter more tokens than you have";
    }

    return undefined;
  };

  onChangeAmount = (ev) => {
    console.log('amoun')
    const value = ev.target.value;
    const investmentValue = value.trim();

    const valueCheckError = this.checkAmount(investmentValue);
    this.setState((prevState) => {
      const canBet =
        (prevState.selectedOutcome === 0 || prevState.selectedOutcome) &&
        !valueCheckError;
      return {
        amount: investmentValue,
        errorAmount: valueCheckError,
        canBet
      };
    });
  };

  handleBuyTokens = (outcomeIndex) => () => {
    const { market } = this.props;
    const { amount } = this.state;
    const selectedOutcome = outcomeIndex;

    const outcomeTokenCount = getOutcomeTokenCount(
      market,
      amount,
      selectedOutcome
    );

    this.setState({ canBet: false });
    return buyShares(market, selectedOutcome, outcomeTokenCount, amount)
      .then(() => {
        this.setState({ canBet: true });
        this.props.refreshMarket();
      })
      .catch(() => {
        this.setState({ canBet: true });
      });
  };

  render() {
    // const { onDetail, onBet, market } = this.props;
    const {
      amount,
      errorAmount,
      selectedOutcome,
      outcomeTokensSold,
      canBet,
      trades
    } = this.state;
    return (
      <Overview 
        amount={amount}
        onChangeAmount={this.onChangeAmount}
        errorAmount={errorAmount}
        trades={trades}
        outcomeTokensSold={outcomeTokensSold}
        handleBuyTokens={this.handleBuyTokens}
        canBet={canBet}
        {...this.props} 
      />
    );
  }
}
