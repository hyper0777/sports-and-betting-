import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseClientConfig } from '@/lib/supabaseConfig';
import { useAuth } from './AuthContext';

export interface Bet {
  id: string;
  matchId: string;
  matchName: string;
  stake: number;
  odds: number;
  result: 'win' | 'loss' | 'pending';
  profit: number;
  createdAt: string;
  bettingOn: string;
}

interface BettingContextType {
  bankroll: number;
  balance: number;
  bets: Bet[];
  loading: boolean;
  setBankroll: (amount: number) => Promise<void>;
  addBet: (matchId: string, matchName: string, stake: number, odds: number, bettingOn: string) => Promise<void>;
  settleBet: (betId: string, result: 'win' | 'loss') => Promise<void>;
  getTotalProfit: () => number;
  getWinRate: () => number;
  getTotalBets: () => number;
  getWinCount: () => number;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [bankroll, setBankrollState] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(false);

  const supabaseConfig = getSupabaseClientConfig();
  const supabase = supabaseConfig
    ? createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey)
    : null;

  // Load bankroll and bets when user logs in
  useEffect(() => {
    if (!user || !supabase) {
      setBankrollState(0);
      setBalance(0);
      setBets([]);
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      try {
        // Load bankroll
        const { data: bankrollData } = await supabase
          .from('bankroll')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (bankrollData) {
          setBankrollState(bankrollData.initial_amount);
          setBalance(bankrollData.current_balance);
        }

        // Load bets
        const { data: betsData } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (betsData) {
          const formattedBets = betsData.map((bet: any) => ({
            id: bet.id,
            matchId: bet.match_id,
            matchName: bet.match_name,
            stake: bet.stake,
            odds: bet.odds,
            result: bet.result,
            profit: bet.profit,
            createdAt: bet.created_at,
            bettingOn: bet.betting_on,
          }));
          setBets(formattedBets);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, supabase]);

  const setBankroll = useCallback(
    async (amount: number) => {
      if (amount <= 0) throw new Error('Bankroll must be greater than 0');

      try {
        if (supabase && user) {
          await supabase.from('bankroll').upsert({
            user_id: user.id,
            initial_amount: amount,
            current_balance: amount,
          });
        } else {
          console.warn('Supabase not configured. Using local session only.');
        }

        setBankrollState(amount);
        setBalance(amount);
        setBets([]);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Error setting bankroll');
      }
    },
    [user, supabase]
  );

  const addBet = useCallback(
    async (matchId: string, matchName: string, stake: number, odds: number, bettingOn: string) => {
      if (stake <= 0 || odds <= 0) throw new Error('Stake and odds must be greater than 0');
      if (stake > balance) throw new Error('Insufficient balance');

      try {
        const newBalance = balance - stake;

        if (supabase && user) {
          const { data: newBet, error } = await supabase
            .from('bets')
            .insert({
              user_id: user.id,
              match_id: matchId,
              match_name: matchName,
              stake,
              odds,
              result: 'pending',
              profit: 0,
              betting_on: bettingOn,
            })
            .select()
            .single();

          if (error) throw error;

          // Update local balance
          setBalance(newBalance);

          // Update bankroll in database
          await supabase
            .from('bankroll')
            .update({ current_balance: newBalance })
            .eq('user_id', user.id);

          // Add to bets list
          if (newBet) {
            const bet: Bet = {
              id: newBet.id,
              matchId: newBet.match_id,
              matchName: newBet.match_name,
              stake: newBet.stake,
              odds: newBet.odds,
              result: newBet.result,
              profit: newBet.profit,
              createdAt: newBet.created_at,
              bettingOn: newBet.betting_on,
            };
            setBets((prev) => [bet, ...prev]);
          }
        } else {
          // Local fallback - no persistence
          console.warn('Supabase not configured. Bet saved locally only (will not persist).');
          setBalance(newBalance);
          const bet: Bet = {
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
          setBets((prev) => [bet, ...prev]);
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Error adding bet');
      }
    },
    [user, balance, supabase]
  );

  const settleBet = useCallback(
    async (betId: string, result: 'win' | 'loss') => {
      try {
        const bet = bets.find((b) => b.id === betId);
        if (!bet || bet.result !== 'pending') throw new Error('Invalid bet');

        let profit = 0;
        if (result === 'win') {
          profit = bet.stake * bet.odds - bet.stake;
        } else {
          profit = -bet.stake;
        }

        // Update balance locally
        const newBalance = balance + profit;

        if (supabase && user) {
          // Update bet in database
          await supabase
            .from('bets')
            .update({ result, profit, settled_at: new Date().toISOString() })
            .eq('id', betId);

          // Update bankroll in database
          await supabase
            .from('bankroll')
            .update({ current_balance: newBalance })
            .eq('user_id', user.id);
        } else {
          console.warn('Supabase not configured. Bet settled locally only (will not persist).');
        }

        setBalance(newBalance);

        // Update local bets
        setBets((prev) =>
          prev.map((b) =>
            b.id === betId
              ? { ...b, result, profit }
              : b
          )
        );
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Error settling bet');
      }
    },
    [user, balance, bets, supabase]
  );

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
        loading,
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
