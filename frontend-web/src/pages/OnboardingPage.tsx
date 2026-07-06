import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Profile state mapping ProfileSchema fields
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('MALE');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [targetWeight, setTargetWeight] = useState(68);
  const [activityLevel, setActivityLevel] = useState('MODERATELY_ACTIVE');
  const [lifestyle, setLifestyle] = useState('ANY');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [workoutPreference, setWorkoutPreference] = useState('GYM');
  const [fitnessGoal, setFitnessGoal] = useState('LOSE_WEIGHT');

  const [allergyInput, setAllergyInput] = useState('');
  const [medConditionInput, setMedConditionInput] = useState('');

  const navigate = useNavigate();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        age,
        gender,
        height,
        weight,
        targetWeight,
        activityLevel,
        lifestyle,
        allergies,
        medicalConditions,
        workoutPreference,
        fitnessGoal,
        waterGoalMl: 3000, // standard default
        sleepHoursGoal: 8,
      };

      await api.post('/users/profile', payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to save profile onboarding details');
      setStep(1); // Return to first step for correction
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 relative">
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-xl glass p-8 sm:p-10 rounded-3xl shadow-xl dark:shadow-slate-950/20 border border-slate-200/50 dark:border-slate-800/50">
        
        {/* Step Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center space-x-1 mb-2">
            <Sparkles size={12} />
            <span>Onboarding — Step {step} of 4</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {step === 1 && 'Demographics & Identity'}
            {step === 2 && 'Body Measurements'}
            {step === 3 && 'Dietary Preferences & Health'}
            {step === 4 && 'Fitness Goals & Preferences'}
          </h2>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Demographics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Age</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Gender Identity</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Measurements */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Current Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Weight (kg)</label>
                  <input
                    type="number"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Dietary Preferences & Health */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Dietary Lifestyle</label>
                <select
                  value={lifestyle}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                >
                  <option value="ANY">No Specific Diet (Any)</option>
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="VEGAN">Vegan</option>
                  <option value="KETO">Keto</option>
                  <option value="PALEO">Paleo</option>
                  <option value="MEDITERRANEAN">Mediterranean</option>
                  <option value="HIGH_PROTEIN">High Protein</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Allergies (Optional)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Peanuts, Gluten"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (allergyInput.trim()) {
                        setAllergies([...allergies, allergyInput.trim()]);
                        setAllergyInput('');
                      }
                    }}
                    className="px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allergies.map((allergy, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Medical Conditions (Optional)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Diabetes, Hypertension"
                    value={medConditionInput}
                    onChange={(e) => setMedConditionInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (medConditionInput.trim()) {
                        setMedicalConditions([...medicalConditions, medConditionInput.trim()]);
                        setMedConditionInput('');
                      }
                    }}
                    className="px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {medicalConditions.map((condition, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Goals & Activity */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Main Fitness Goal</label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                >
                  <option value="LOSE_WEIGHT">Lose Weight</option>
                  <option value="MAINTAIN_WEIGHT">Maintain Weight</option>
                  <option value="GAIN_MUSCLE">Gain Muscle</option>
                  <option value="IMPROVE_ENDURANCE">Improve Endurance</option>
                  <option value="HEALTHY_LIFESTYLE">Healthy Lifestyle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                >
                  <option value="SEDENTARY">Sedentary (Little or no exercise)</option>
                  <option value="LIGHTLY_ACTIVE">Lightly Active (1-3 days/week)</option>
                  <option value="MODERATELY_ACTIVE">Moderately Active (3-5 days/week)</option>
                  <option value="VERY_ACTIVE">Very Active (6-7 days/week)</option>
                  <option value="EXTRA_ACTIVE">Extra Active (Hard physical work)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Workout Environment Preference</label>
                <select
                  value={workoutPreference}
                  onChange={(e) => setWorkoutPreference(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white"
                >
                  <option value="GYM">Gym Strength Training</option>
                  <option value="HOME">Home Calisthenics</option>
                  <option value="OUTDOOR">Outdoor Running / Cycling</option>
                  <option value="YOGA">Yoga & Stretching</option>
                  <option value="NONE">No preference</option>
                </select>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-semibold transition-all"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-md shadow-primary/20"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-md shadow-primary/20 disabled:opacity-50"
              >
                <span>{loading ? 'Saving...' : 'Finish Setup'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
