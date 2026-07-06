import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Trash2, Camera, Plus, Check, Play, Scale } from 'lucide-react';
import api, { queryKeys } from '../services/api';

export default function Trackers() {
  const queryClient = useQueryClient();
  const todayStr = new Date().toISOString().split('T')[0];

  // Forms state
  const [mealType, setMealType] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'>('BREAKFAST');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  const [aiInput, setAiInput] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Workout state
  const [workoutType, setWorkoutType] = useState('GYM_WORKOUT');
  const [workoutDuration, setWorkoutDuration] = useState(45);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Weight state
  const [currentWeight, setCurrentWeight] = useState(70);

  // Queries
  const { data: meals } = useQuery({
    queryKey: queryKeys.meals(todayStr),
    queryFn: async () => {
      const { data } = await api.get(`/meals?date=${todayStr}`);
      return data;
    }
  });

  const { data: workouts } = useQuery({
    queryKey: queryKeys.workouts(todayStr),
    queryFn: async () => {
      const { data } = await api.get(`/workouts?date=${todayStr}`);
      return data;
    }
  });

  // Mutations
  const addMealMutation = useMutation({
    mutationFn: async (payload: any) => {
      await api.post('/meals', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meals(todayStr) });
      setFoodName('');
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
    }
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meals(todayStr) });
    }
  });

  const addWorkoutMutation = useMutation({
    mutationFn: async (payload: any) => {
      await api.post('/workouts', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts(todayStr) });
      setWorkoutNotes('');
    }
  });

  const logWeightMutation = useMutation({
    mutationFn: async (weight: number) => {
      await api.post('/progress', { date: todayStr, weight });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progressDate(todayStr) });
      alert('Weight logged successfully!');
    }
  });

  // AI Calorie Estimation
  const triggerAiEstimation = async () => {
    if (!aiInput.trim()) return;
    setLoadingAi(true);
    try {
      const { data } = await api.post('/meals/ai-estimate', { description: aiInput });
      setFoodName(data.foodName);
      setCalories(data.calories);
      setProtein(data.protein);
      setCarbs(data.carbs);
      setFat(data.fat);
      setAiInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Real HTML5 Webcam capture handler
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const startCamera = async () => {
    setIsCameraActive(true);
    setCapturedPhoto(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setVideoStream(mediaStream);
      const videoElement = document.getElementById('webcam-feed') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access failed:', err.message);
      alert('Could not access camera. Please check browser permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    const videoElement = document.getElementById('webcam-feed') as HTMLVideoElement;
    const canvasElement = document.createElement('canvas');
    if (videoElement) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const context = canvasElement.getContext('2d');
      if (context) {
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const dataUrl = canvasElement.toDataURL('image/jpeg');
        setCapturedPhoto(dataUrl);
        triggerPhotoScan(dataUrl);
      }
    }
    stopCamera();
  };

  const triggerPhotoScan = async (base64Photo: string) => {
    setLoadingAi(true);
    try {
      const { data } = await api.post('/meals/ai-scan', { photoUrl: base64Photo });
      setFoodName(data.nutrition.foodName);
      setCalories(data.nutrition.calories);
      setProtein(data.nutrition.protein);
      setCarbs(data.nutrition.carbs);
      setFat(data.nutrition.fat);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* MEAL LOGGER FORM */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-6 rounded-3xl shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Track Your Diet</h2>
            <p className="text-sm text-slate-500">Log your meals manually or estimate using our AI engine.</p>
          </div>

          {/* AI helper input */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center space-x-1">
              <Sparkles size={12} />
              <span>AI Instant Calculator</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. 1 slice of cheese pizza and an apple"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={triggerAiEstimation}
                disabled={loadingAi}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow-md shadow-primary/10 transition-colors"
              >
                Estimate
              </button>
            </div>
            <div className="relative my-2 text-center text-[10px] text-slate-400 uppercase tracking-widest">
              <div className="absolute inset-y-1/2 left-0 right-0 border-t border-slate-200 dark:border-slate-800 -z-10" />
              <span className="bg-slate-50 dark:bg-slate-900 px-3">or</span>
            </div>
            {isCameraActive ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-750 bg-black aspect-video max-w-sm mx-auto">
                  <video id="webcam-feed" autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
                <div className="flex space-x-2 justify-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
                  >
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {capturedPhoto && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 max-w-xs mx-auto aspect-video">
                    <img src={capturedPhoto} alt="Captured meal" className="w-full h-full object-cover" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={loadingAi}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-primary text-primary hover:bg-primary/10 font-bold text-xs transition-colors"
                >
                  <Camera size={14} />
                  <span>{loadingAi ? 'Scanning snapshot...' : 'Open Built-in Webcam to Scan'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Manual input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMealMutation.mutate({ mealType, foodName, calories, protein, carbs, fat, date: todayStr });
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Meal Time</label>
                <select
                  value={mealType}
                  onChange={(e: any) => setMealType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white"
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                  <option value="SNACK">Snack</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Food Name</label>
                <input
                  type="text"
                  placeholder="e.g. Scrambled Eggs"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  required
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  required
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  required
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Fats (g)</label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  required
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/10 transition-colors"
            >
              Add Meal Log
            </button>
          </form>
        </div>

        {/* LOGGED MEALS LIST */}
        <div className="glass p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold mb-4">Today's Food Journal</h3>
          {meals && meals.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {meals.map((meal: any) => (
                <div key={meal._id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                  <div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase mr-2">{meal.mealType}</span>
                    <span className="font-semibold text-sm">{meal.foodName}</span>
                    <div className="flex space-x-3 text-xs text-slate-400 mt-1">
                      <span>{meal.calories} kcal</span>
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>F: {meal.fat}g</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMealMutation.mutate(meal._id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">No meals logged for today yet.</p>
          )}
        </div>
      </div>

      {/* WORKOUTS & WEIGHT TRACKER PANEL */}
      <div className="space-y-6">
        {/* Workout Tracker */}
        <div className="glass p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-1 flex items-center space-x-2">
              <Play className="text-primary fill-primary" size={18} />
              <span>Log Workout</span>
            </h3>
            <p className="text-xs text-slate-500">Record your physical exercise routines.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Workout Type</label>
              <select
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white"
              >
                <option value="GYM_WORKOUT">Gym Workout</option>
                <option value="HOME_WORKOUT">Home Workout</option>
                <option value="YOGA">Yoga & Flexibility</option>
                <option value="HIIT">HIIT (Intervals)</option>
                <option value="STRENGTH_TRAINING">Strength Training</option>
                <option value="RUNNING">Running / Cardio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Notes / Routine details</label>
              <textarea
                placeholder="e.g. Bench press: 4 sets, Squats: 4 sets"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
              />
            </div>

            <button
              onClick={() => addWorkoutMutation.mutate({ workoutType, durationMinutes: workoutDuration, notes: workoutNotes, date: todayStr })}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Add Workout Log
            </button>
          </div>

          {workouts && workouts.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged today</span>
              {workouts.map((w: any) => (
                <div key={w._id} className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                  <span className="font-bold">{w.workoutType.replace('_', ' ')}</span>
                  <span className="text-slate-400 float-right">{w.durationMinutes} mins</span>
                  {w.notes && <p className="text-slate-500 mt-1">{w.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weight Tracker */}
        <div className="glass p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Scale className="text-amber-500" size={18} />
            <span>Track Weight</span>
          </div>

          <div className="flex space-x-2">
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              className="flex-grow px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
            />
            <button
              onClick={() => logWeightMutation.mutate(currentWeight)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs"
            >
              Log Weight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
