import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface Habit {
  id: string;
  name: string;
  timesPerDay: number;
  color: string;
  period: 'morning' | 'afternoon' | 'night';
  streak: number;
  completedToday: number;
  date: string;
  daysOfWeek: string[];
}

interface HabitsContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedToday'>) => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
  clearAllHabits: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch habits and their completions
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const fetchHabits = async () => {
      try {
        const { data: habitsData, error: habitsError } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id);

        if (habitsError) throw habitsError;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
          .toISOString()
          .split('T')[0];

        // Fetch completions for today and yesterday to calculate streaks
        const { data: completionsData, error: completionsError } = await supabase
          .from('habit_completions')
          .select('habit_id, completed_at')
          .gte('completed_at', yesterday);

        if (completionsError) throw completionsError;

        const habitsWithCompletions = habitsData.map(habit => {
          const todayCompletions = completionsData.filter(
            completion => 
              completion.habit_id === habit.id && 
              completion.completed_at.startsWith(today)
          ).length;

          const yesterdayCompletions = completionsData.filter(
            completion => 
              completion.habit_id === habit.id && 
              completion.completed_at.startsWith(yesterday)
          ).length;

          // Calculate streak based on completions
          const wasCompletedYesterday = yesterdayCompletions >= habit.times_per_day;
          const isCompletedToday = todayCompletions >= habit.times_per_day;

          let streak = habit.streak || 0;
          if (isCompletedToday) {
            streak = wasCompletedYesterday ? streak + 1 : 1;
          } else if (!wasCompletedYesterday) {
            streak = 0;
          }

          // Update streak in database if it changed
          if (streak !== habit.streak) {
            supabase
              .from('habits')
              .update({ streak })
              .eq('id', habit.id)
              .then(({ error }) => {
                if (error) console.error('Error updating streak:', error);
              });
          }

          return {
            id: habit.id,
            name: habit.name,
            timesPerDay: habit.times_per_day,
            color: habit.color,
            period: habit.period,
            streak,
            completedToday: todayCompletions,
            date: habit.date,
            daysOfWeek: habit.days_of_week || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          };
        });

        setHabits(habitsWithCompletions);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [user]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'streak' | 'completedToday'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          user_id: user.id,
          name: habitData.name,
          times_per_day: habitData.timesPerDay,
          color: habitData.color,
          period: habitData.period,
          date: habitData.date,
          days_of_week: habitData.daysOfWeek
        }])
        .select()
        .single();

      if (error) throw error;

      // Immediately update the local state with the new habit
      setHabits(currentHabits => [...currentHabits, {
        ...data,
        id: data.id,
        timesPerDay: data.times_per_day,
        completedToday: 0,
        streak: 0,
        daysOfWeek: data.days_of_week
      }]);
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  const toggleHabit = async (habitId: string) => {
    if (!user) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    try {
      if (habit.completedToday < habit.timesPerDay) {
        // Add completion
        const { error } = await supabase
          .from('habit_completions')
          .insert([{ habit_id: habitId }]);

        if (error) throw error;

        setHabits(habits.map(h => {
          if (h.id === habitId) {
            const newCompletedToday = h.completedToday + 1;
            const isNowCompleted = newCompletedToday >= h.timesPerDay;
            return {
              ...h,
              completedToday: newCompletedToday,
              streak: isNowCompleted ? h.streak + 1 : h.streak
            };
          }
          return h;
        }));
      } else {
        // Remove today's completions
        const today = new Date().toISOString().split('T')[0];
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .gte('completed_at', today);

        if (error) throw error;

        setHabits(habits.map(h => {
          if (h.id === habitId) {
            return { ...h, completedToday: 0, streak: Math.max(0, h.streak - 1) };
          }
          return h;
        }));
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  };

  const removeHabit = async (habitId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;

      setHabits(habits.filter(h => h.id !== habitId));
    } catch (error) {
      console.error('Error removing habit:', error);
      throw error;
    }
  };

  const clearAllHabits = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits([]);
    } catch (error) {
      console.error('Error clearing habits:', error);
      throw error;
    }
  };

  return (
    <HabitsContext.Provider value={{ habits, loading, addHabit, toggleHabit, removeHabit, clearAllHabits }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}