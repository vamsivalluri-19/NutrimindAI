import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, Flame, Apple, Trophy, Plus, RefreshCw, Activity, Waves, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { queryKeys } from '../services/api';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split('T')[0];

  // Queries
  const { data: profile } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data;
    }
  });

  const { data: meals } = useQuery({
    queryKey: queryKeys.meals(todayStr),
    queryFn: async () => {
      const { data } = await api.get(`/meals?date=${todayStr}`);
      return data;
    }
  });

  const { data: progress } = useQuery({
    queryKey: queryKeys.progressDate(todayStr),
    queryFn: async () => {
      const { data } = await api.get(`/progress/${todayStr}`);
      return data;
    }
  });

  const { data: history } = useQuery({
    queryKey: queryKeys.progress,
    queryFn: async () => {
      const { data } = await api.get('/progress/history?limit=7');
      return data;
    }
  });

  // Fetch available consultants
  const { data: coaches } = useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const { data } = await api.get('/users/coaches');
      return data;
    }
  });

  const assignConsultantMutation = useMutation({
    mutationFn: async ({ coachId, type }: { coachId: string; type: 'NUTRITIONIST' | 'TRAINER' }) => {
      const payload = type === 'NUTRITIONIST' ? { nutritionistId: coachId } : { trainerId: coachId };
      await api.put('/users/profile/consultant', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    }
  });

  // Direct Message states
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatName, setActiveChatName] = useState<string>('');
  const [chatMessage, setChatMessage] = useState('');
  const [coachingNotes, setCoachingNotes] = useState('');

  const isDoctor = localStorage.getItem('userRole') === 'NUTRITIONIST' || localStorage.getItem('userRole') === 'TRAINER';

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data } = await api.get('/messages/patients');
      return data;
    },
    enabled: isDoctor
  });

  const { data: messagesHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['chatHistory', activeChatId],
    queryFn: async () => {
      if (!activeChatId) return [];
      const { data } = await api.get(`/messages/history/${activeChatId}`);
      return data;
    },
    enabled: !!activeChatId,
    refetchInterval: 3000
  });

  const { data: patientLogs } = useQuery({
    queryKey: ['patientLogs', activeChatId],
    queryFn: async () => {
      if (!activeChatId || !isDoctor) return null;
      const { data } = await api.get(`/messages/patient/${activeChatId}/logs`);
      return data;
    },
    enabled: !!activeChatId && isDoctor,
  });

  const sendDirectMessageMutation = useMutation({
    mutationFn: async () => {
      if (!activeChatId || !chatMessage.trim()) return;
      await api.post('/messages/send', {
        receiverId: activeChatId,
        content: chatMessage
      });
    },
    onSuccess: () => {
      setChatMessage('');
      refetchHistory();
    }
  });

  const activePatientProfile = patients?.find((pat: any) => pat.userId?._id === activeChatId);

  useEffect(() => {
    if (activePatientProfile) {
      const isNutri = localStorage.getItem('userRole') === 'NUTRITIONIST';
      setCoachingNotes(isNutri ? (activePatientProfile.nutritionistFeedback || '') : (activePatientProfile.trainerFeedback || ''));
    }
  }, [activeChatId, patients]);

  const submitFeedbackMutation = useMutation({
    mutationFn: async () => {
      if (!activePatientProfile) return;
      await api.put('/users/profile/feedback', {
        patientProfileId: activePatientProfile._id,
        feedback: coachingNotes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });

  // AI Plans State
  const [aiDietPlan, setAiDietPlan] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Mutations
  const incrementWaterMutation = useMutation({
    mutationFn: async (amount: number) => {
      await api.post('/progress/water-increment', { date: todayStr, amountMl: amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progressDate(todayStr) });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress });
    }
  });

  const handleIncrementWater = (amount: number) => {
    incrementWaterMutation.mutate(amount);
  };

  const triggerAIDiet = async () => {
    setLoadingAi(true);
    try {
      const { data } = await api.post('/ai/diet-plan', { preferences: profile?.lifestyle });
      setAiDietPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Calculations
  const targetCalories = profile?.fitnessGoal === 'LOSE_WEIGHT' ? 2000 : 2500;
  const loggedCalories = meals?.reduce((acc: number, meal: any) => acc + meal.calories, 0) || 0;
  const remainingCalories = Math.max(0, targetCalories - loggedCalories);
  
  const proteinLogged = meals?.reduce((acc: number, meal: any) => acc + meal.protein, 0) || 0;
  const carbsLogged = meals?.reduce((acc: number, meal: any) => acc + meal.carbs, 0) || 0;
  const fatLogged = meals?.reduce((acc: number, meal: any) => acc + meal.fat, 0) || 0;

  // Pie chart data
  const pieData = [
    { name: 'Logged', value: loggedCalories },
    { name: 'Remaining', value: remainingCalories }
  ];
  const COLORS = ['#16A34A', '#E2E8F0'];

  if (isDoctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between glass p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Welcome, Consultant Coach/Doctor</span>
              <Activity className="h-6 w-6 text-primary animate-pulse" />
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage your active clients, monitor logs, and coordinate direct support care.</p>
          </div>
        </div>

        {/* Assigned Patients Panel */}
        <div className="glass p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <h3 className="text-lg font-bold flex items-center space-x-2 text-slate-900 dark:text-white">
            <Heart className="text-primary animate-pulse" size={20} />
            <span>My Active Patients / Clients</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients && patients.length > 0 ? (
              patients.map((pat: any) => (
                <div key={pat._id} className="p-5 bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-850 dark:text-slate-100">{pat.userId?.firstName} {pat.userId?.lastName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{pat.userId?.email}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold">
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase font-bold">Goal: {pat.fitnessGoal?.replace('_', ' ')}</span>
                      <span className="bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full uppercase font-bold">Weight: {pat.weight}kg</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveChatId(pat.userId?._id);
                      setActiveChatName(`${pat.userId?.firstName} ${pat.userId?.lastName}`);
                    }}
                    className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Open Consultation Chat
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 col-span-full">No users have assigned you as their consultant yet.</p>
            )}
          </div>
        </div>

        {/* Direct chat modal */}
        {activeChatId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row h-[600px] shadow-2xl">
              
              {/* Left Column: Patient Biometrics & Action Notes */}
              {activePatientProfile && (
                <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-5 space-y-5 bg-slate-50/50 dark:bg-slate-950/20 overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold block">Patient Dossier</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activePatientProfile.userId?.firstName} {activePatientProfile.userId?.lastName}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-semibold">Age / Gender</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{activePatientProfile.age}y / {activePatientProfile.gender}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-semibold">Activity</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 capitalize">{activePatientProfile.activityLevel?.toLowerCase().replace('_', ' ')}</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-semibold">Weight / Target</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{activePatientProfile.weight}kg / {activePatientProfile.targetWeight}kg</span>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-semibold">Height</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{activePatientProfile.height} cm</span>
                      </div>
                    </div>

                    {activePatientProfile.allergies?.length > 0 && (
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Allergies</span>
                        <p className="text-xs text-red-500 font-semibold">{activePatientProfile.allergies.join(', ')}</p>
                      </div>
                    )}

                    {activePatientProfile.medicalConditions?.length > 0 && (
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Medical Conditions</span>
                        <p className="text-xs text-amber-500 font-semibold">{activePatientProfile.medicalConditions.join(', ')}</p>
                      </div>
                    )}

                    {/* Patient Logs Section */}
                    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold block">Patient Logs (7 Days)</span>
                      
                      {patientLogs ? (
                        <div className="space-y-3">
                          {/* Meals Summary */}
                          <div>
                            <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase font-bold block">Meals Logged</span>
                            {patientLogs.meals?.length > 0 ? (
                              <div className="max-h-24 overflow-y-auto space-y-1.5 mt-1 pr-1">
                                {patientLogs.meals.slice(0, 5).map((meal: any) => (
                                  <div key={meal._id} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{meal.foodName}</span>
                                    <span className="text-slate-400">{meal.calories} kcal</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 block italic">No meals logged recently</span>
                            )}
                          </div>

                          {/* Workouts Summary */}
                          <div>
                            <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase font-bold block">Workouts Logged</span>
                            {patientLogs.workouts?.length > 0 ? (
                              <div className="max-h-24 overflow-y-auto space-y-1.5 mt-1 pr-1">
                                {patientLogs.workouts.slice(0, 5).map((w: any) => (
                                  <div key={w._id} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{w.exerciseName}</span>
                                    <span className="text-slate-400">{w.durationMinutes}m</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 block italic">No workouts logged recently</span>
                            )}
                          </div>

                          {/* Daily Activity Summary */}
                          <div>
                            <span className="text-[9px] text-slate-450 dark:text-slate-500 uppercase font-bold block">Hydration & Activity</span>
                            {patientLogs.progress?.length > 0 ? (
                              <div className="max-h-24 overflow-y-auto space-y-1.5 mt-1 pr-1">
                                {patientLogs.progress.slice(0, 3).map((p: any) => (
                                  <div key={p._id} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-[10px] space-y-0.5">
                                    <div className="flex justify-between font-semibold">
                                      <span className="text-slate-700 dark:text-slate-300">Date: {p.date}</span>
                                      {p.weight && <span className="text-slate-800 dark:text-slate-200">{p.weight} kg</span>}
                                    </div>
                                    <div className="flex justify-between text-[9px] text-slate-400">
                                      <span>Steps: {p.steps}</span>
                                      <span>Water: {p.waterIntakeMl} ml</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 block italic">No daily activity logged</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 block italic">Loading logs...</span>
                      )}
                    </div>
                  </div>

                  {/* Coaching prescription / notes form */}
                  <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold block">Prescribe Advice Notes</label>
                    <textarea
                      rows={3}
                      value={coachingNotes}
                      onChange={(e) => setCoachingNotes(e.target.value)}
                      placeholder="e.g. Drink 3.5L water, limit carbs target to 100g, do 10k steps daily."
                      className="w-full p-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none resize-none"
                    />
                    <button
                      onClick={() => submitFeedbackMutation.mutate()}
                      disabled={submitFeedbackMutation.isPending}
                      className="w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                      {submitFeedbackMutation.isPending ? 'Saving...' : 'Save Prescription'}
                    </button>
                  </div>
                </div>
              )}

              {/* Right Column: Direct chat stream */}
              <div className="flex-grow flex flex-col h-full">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{activeChatName}</h4>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 tracking-wider uppercase font-bold">Direct Consultation Line</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveChatId(null);
                      setActiveChatName('');
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-xs"
                  >
                    Close
                  </button>
                </div>

              {/* Chat messages stream */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-100/35 dark:bg-slate-950/20">
                {messagesHistory && messagesHistory.map((msg: any) => {
                  const isSentByMe = msg.senderId !== activeChatId;
                  return (
                    <div key={msg._id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                        isSentByMe ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input section */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendDirectMessageMutation.mutate();
                }}
                className="p-3 border-t border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 flex space-x-2"
              >
                <input
                  type="text"
                  placeholder="Type advice or message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-grow px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl"
                >
                  Send
                </button>
              </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between glass p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Welcome back, {profile?.userId?.firstName || 'Champ'}!</span>
            <Activity className="h-6 w-6 text-primary animate-pulse" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">Today is a great day to reach your fitness goals. Let's keep the streak alive!</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={triggerAIDiet}
            disabled={loadingAi}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>{loadingAi ? 'Generating...' : 'Get AI Diet Plan'}</span>
          </button>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Calorie ring */}
        <div className="glass p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Calories Consumed</h3>
          <div className="h-40 w-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#16A34A" />
                  <Cell fill="rgba(148, 163, 184, 0.15)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold">{loggedCalories}</span>
              <span className="text-xs text-slate-400">/ {targetCalories} kcal</span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="glass p-6 rounded-3xl shadow-sm space-y-4 col-span-1 md:col-span-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Today's Macronutrients</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Protein</span>
                <span className="text-slate-400">{proteinLogged}g logged</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all" style={{ width: `${Math.min(100, (proteinLogged / 120) * 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Carbs</span>
                <span className="text-slate-400">{carbsLogged}g logged</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full transition-all" style={{ width: `${Math.min(100, (carbsLogged / 250) * 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Fats</span>
                <span className="text-slate-400">{fatLogged}g logged</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full transition-all" style={{ width: `${Math.min(100, (fatLogged / 70) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Water logger */}
        <div className="glass p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Water Intake</h3>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-4xl font-extrabold text-blue-500">{progress?.waterIntakeMl || 0}</span>
              <span className="text-sm text-slate-400">/ 3000 ml</span>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => handleIncrementWater(250)}
                className="flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-bold text-xs transition-colors"
              >
                <Plus size={14} />
                <span>250ml</span>
              </button>
              <button
                onClick={() => handleIncrementWater(500)}
                className="flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-bold text-xs transition-colors"
              >
                <Plus size={14} />
                <span>500ml</span>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-4">
            <Waves size={14} className="text-blue-500" />
            <span>Stay hydrated to maintain focus.</span>
          </div>
        </div>
      </div>

      {/* Dual Personal Coach & Trainer connections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nutritionist Card */}
        <div className="glass p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <h3 className="text-lg font-bold flex items-center space-x-2 text-slate-900 dark:text-white">
            <Heart className="text-red-500 animate-pulse" size={20} />
            <span>My Personal Nutritionist (Doctor)</span>
          </h3>

          {profile?.nutritionistId ? (
            <div className="space-y-3">
              <div className="p-4 bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{profile.nutritionistId.firstName} {profile.nutritionistId.lastName}</h4>
                  <p className="text-xs text-primary mt-0.5 uppercase tracking-wider font-bold">Nutrition Consultant</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{profile.nutritionistId.email}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveChatId(profile.nutritionistId._id);
                    setActiveChatName(`${profile.nutritionistId.firstName} ${profile.nutritionistId.lastName}`);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-all"
                >
                  Chat
                </button>
              </div>
              {profile.nutritionistFeedback && (
                <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary leading-relaxed">
                  <span className="font-bold block uppercase tracking-wider text-[9px] mb-1">Prescribed Nutrition Advice:</span>
                  "{profile.nutritionistFeedback}"
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose a personal nutritionist to plan your diets:</p>
              <div className="space-y-2">
                {coaches?.filter((c: any) => c.role === 'NUTRITIONIST' || c.role === 'ADMIN').map((coach: any) => (
                  <div key={coach._id} className="p-3 bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{coach.firstName} {coach.lastName}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">{coach.email}</p>
                    </div>
                    <button
                      onClick={() => assignConsultantMutation.mutate({ coachId: coach._id, type: 'NUTRITIONIST' })}
                      className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-dark transition-all"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fitness Trainer Card */}
        <div className="glass p-6 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <h3 className="text-lg font-bold flex items-center space-x-2 text-slate-900 dark:text-white">
            <Activity className="text-blue-500 animate-pulse" size={20} />
            <span>My Personal Fitness Trainer</span>
          </h3>

          {profile?.trainerId ? (
            <div className="space-y-3">
              <div className="p-4 bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{profile.trainerId.firstName} {profile.trainerId.lastName}</h4>
                  <p className="text-xs text-blue-500 mt-0.5 uppercase tracking-wider font-bold">Fitness Trainer</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{profile.trainerId.email}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveChatId(profile.trainerId._id);
                    setActiveChatName(`${profile.trainerId.firstName} ${profile.trainerId.lastName}`);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-all"
                >
                  Chat
                </button>
              </div>
              {profile.trainerFeedback && (
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-500 leading-relaxed">
                  <span className="font-bold block uppercase tracking-wider text-[9px] mb-1">Prescribed Fitness Advice:</span>
                  "{profile.trainerFeedback}"
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose a personal trainer to schedule your workouts:</p>
              <div className="space-y-2">
                {coaches?.filter((c: any) => c.role === 'TRAINER').map((coach: any) => (
                  <div key={coach._id} className="p-3 bg-slate-100/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{coach.firstName} {coach.lastName}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">{coach.email}</p>
                    </div>
                    <button
                      onClick={() => assignConsultantMutation.mutate({ coachId: coach._id, type: 'TRAINER' })}
                      className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-dark transition-all"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Diet Plan Results */}
      {aiDietPlan && (
        <div className="glass p-6 rounded-3xl shadow-sm border border-primary/20 bg-primary/5 animate-in slide-in-from-top duration-300">
          <h2 className="text-xl font-bold flex items-center space-x-2 text-slate-900 dark:text-white mb-2">
            <Sparkles className="text-accent" />
            <span>{aiDietPlan.title}</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{aiDietPlan.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Target Calories</span>
              <span className="text-xl font-extrabold text-primary">{aiDietPlan.targetCalories} kcal</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Protein Target</span>
              <span className="text-xl font-extrabold text-blue-500">{aiDietPlan.macros.proteinGrams}g</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Carbs Target</span>
              <span className="text-xl font-extrabold text-amber-500">{aiDietPlan.macros.carbsGrams}g</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Fats Target</span>
              <span className="text-xl font-extrabold text-red-500">{aiDietPlan.macros.fatGrams}g</span>
            </div>
          </div>

          <h3 className="font-bold mb-3 text-sm">Meal Split recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiDietPlan.meals.slice(0, 4).map((meal: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-primary mr-2 uppercase">{meal.mealType}</span>
                  <span className="text-sm font-semibold">{meal.foodName}</span>
                </div>
                <span className="text-xs text-slate-500">{meal.estimatedCalories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics chart */}
      {history && history.length > 0 && (
        <div className="glass p-6 rounded-3xl shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Weekly Water & Steps Analytics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Bar dataKey="waterIntakeMl" name="Water (ml)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="steps" name="Steps count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* User direct chat modal */}
      {activeChatId && !isDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-[550px] shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{activeChatName}</h4>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 tracking-wider uppercase font-bold">Consultation Line</span>
              </div>
              <button
                onClick={() => {
                  setActiveChatId(null);
                  setActiveChatName('');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-xs"
              >
                Close
              </button>
            </div>

            {/* Chat messages stream */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-100/35 dark:bg-slate-950/20">
              {messagesHistory && messagesHistory.map((msg: any) => {
                const isSentByMe = msg.senderId !== activeChatId;
                return (
                  <div key={msg._id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                      isSentByMe ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input section */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendDirectMessageMutation.mutate();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 flex space-x-2"
            >
              <input
                type="text"
                placeholder="Ask your consultant..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-grow px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
