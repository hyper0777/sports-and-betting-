import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Bet {
  id: string;
  matchId: string;
  matchName: string;
  stake: number;
  odds: number;
  result: 'win' | 'loss' | 'pending';
  profit: number;
  createdAt: string;
  bettingOn: string; // e.g., "Home Win", "Draw", "Away Win"
}

interface BettingContextType {
  bankroll: number;
  balance: number;
  bets: Bet[];
  setBankroll: (amount: number) => void;
  addBet: (matchId: string, matchName: string, stake: number, odds: number, bettingOn: string) => void;
  settleBet: (betId: string, result: 'win' | 'loss') => void;
  getTotalProfit: () => number;
  getWinRate: () => number;
  getTotalBets: () => number;
  getWinCount: () => number;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [bankroll, setBankrollState] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [bets, setBets] = useState<Bet[]>([]);

  const setBankroll = useCallback((amount: number) => {
    if (amount <= 0) {
      throw new Error('Bankroll must be greater than 0');
    }
    setBankrollState(amount);
    setBalance(amount);
    setBets([]);
  }, []);

  const addBet = useCallback((
    matchId: string,
    matchName: string,
    stake: number,
    odds: number,
    bettingOn: string
  ) => {
    if (stake <= 0 || odds <= 0) {
      throw new Error('Stake and odds must be greater than 0');
    }

    if (stake > balance) {
      throw new Error('Insufficient balance for this bet');
    }

    const newBet: Bet = {
      id: `bet_${Date.now()}`,
      matchId,
      matchName,
      stake,
      odds,
      result: 'pending',
      profit: 0,
      createdAt: new Date().toISOString(),
      bettingOn,
    };

    setBets((prev) => [...prev, newBet]);
    setBalance((prev) => prev - stake);
  }, [balance]);

  const settleBet = useCallback((betId: string, result: 'win' | 'loss') => {
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === betId && bet.result === 'pending') {
          let profit = 0;
          if (result === 'win') {
            profit = bet.stake * bet.odds - bet.stake;
          } else {
            profit = -bet.stake;
          }

          return {
            ...bet,
            result,
            profit,
          };
        }
        return bet;
      })
    );

    setBalance((prev) => {
      const bet = bets.find((b) => b.id === betId);
      if (!bet || bet.result !== 'pending') return prev;

      let profit = 0;
      if (result === 'win') {
        profit = bet.stake * bet.odds - bet.stake;
      } else {
        profit = -bet.stake;
      }

      return prev + profit;
    });
  }, [bets]);

  const getTotalProfit = useCallback(() => {
    return balance - bankroll;
  }, [balance, bankroll]);

  const getTotalBets = useCallback(() => {
    return bets.filter((b) => b.result !== 'pending').length;
  }, [bets]);

  const getWinCount = useCallback(() => {
    return bets.filter((b) => b.result === 'win').length;
  }, [bets]);

  const getWinRate = useCallback(() => {
    const settledBets = getTotalBets();
    if (settledBets === 0) return 0;
    return (getWinCount() / settledBets) * 100;
  }, [getTotalBets, getWinCount]);

  return (
    <BettingContext.Provider
      value={{
        bankroll,
        balance,
        bets,
        setBankroll,
        addBet,
        settleBet,
        getTotalProfit,
        getWinRate,
        getTotalBets,
        getWinCount,
      }}
    >
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within BettingProvider');
  }
  return context;
}
