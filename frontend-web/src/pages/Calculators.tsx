import React, { useState } from 'react';
import { Calculator, Sparkles, Scale, Heart, Apple } from 'lucide-react';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<'BMI' | 'BMR' | 'TDEE'>('BMI');

  // Input states
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [activity, setActivity] = useState('MODERATE');

  // Outputs
  const calcBmi = () => {
    const heightM = height / 100;
    return (weight / (heightM * heightM)).toFixed(1);
  };

  const getBmiCategory = (bmiVal: number) => {
    if (bmiVal < 18.5) return { label: 'Underweight', color: 'text-amber-500' };
    if (bmiVal < 25) return { label: 'Healthy Weight', color: 'text-primary' };
    if (bmiVal < 30) return { label: 'Overweight', color: 'text-amber-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const calcBmr = () => {
    // Mifflin-St Jeor Equation
    let val = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'MALE') {
      val += 5;
    } else {
      val -= 161;
    }
    return Math.round(val);
  };

  const calcTdee = () => {
    const bmrVal = calcBmr();
    const multipliers: Record<string, number> = {
      SEDENTARY: 1.2,
      LIGHT: 1.375,
      MODERATE: 1.55,
      ACTIVE: 1.725,
    };
    return Math.round(bmrVal * (multipliers[activity] || 1.2));
  };

  const bmi = Number(calcBmi());
  const bmiCat = getBmiCategory(bmi);
  const bmr = calcBmr();
  const tdee = calcTdee();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center space-x-2">
          <Calculator className="text-primary" size={28} />
          <span>Interactive Health Calculators</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Calculate your biological indices and energy requirements instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Inputs panel */}
        <div className="glass p-6 rounded-3xl space-y-5 h-fit">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Adjust Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('MALE')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    gender === 'MALE' ? 'bg-primary text-white border-primary' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('FEMALE')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    gender === 'FEMALE' ? 'bg-primary text-white border-primary' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Activity Multiplier</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs"
              >
                <option value="SEDENTARY">Sedentary (No exercise)</option>
                <option value="LIGHT">Light Active (1-3 days/week)</option>
                <option value="MODERATE">Moderate Active (3-5 days/week)</option>
                <option value="ACTIVE">Very Active (6-7 days/week)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output tabs panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab selector */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {['BMI', 'BMR', 'TDEE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'BMI' && 'Body Mass Index (BMI)'}
                {tab === 'BMR' && 'Basal Metabolic Rate (BMR)'}
                {tab === 'TDEE' && 'Energy Expenditure (TDEE)'}
              </button>
            ))}
          </div>

          {/* BMI Result tab */}
          {activeTab === 'BMI' && (
            <div className="glass p-8 rounded-3xl space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculated Index</span>
                  <div className="text-5xl font-black mt-2 text-primary">{bmi}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category Classification</span>
                  <div className={`text-xl font-bold mt-2 ${bmiCat.color}`}>{bmiCat.label}</div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-xs text-slate-400 leading-normal flex items-start space-x-3">
                <Heart className="text-primary mt-0.5 shrink-0" size={16} />
                <span>
                  BMI is a fast screening tool for weight status. A healthy range is between **18.5 and 24.9**. Combine this with body fat calculations for complete muscular health assessments.
                </span>
              </div>
            </div>
          )}

          {/* BMR Result tab */}
          {activeTab === 'BMR' && (
            <div className="glass p-8 rounded-3xl space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Metabolic Rate</span>
                  <div className="text-5xl font-black mt-2 text-amber-500">{bmr} <span className="text-sm font-normal text-slate-400">kcal/day</span></div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-xs text-slate-400 leading-normal flex items-start space-x-3">
                <Scale className="text-amber-500 mt-0.5 shrink-0" size={16} />
                <span>
                  BMR measures the calories your body burns just to stay alive at complete rest. It serves as your baseline metabolic calories before adding active exercise metrics.
                </span>
              </div>
            </div>
          )}

          {/* TDEE Result tab */}
          {activeTab === 'TDEE' && (
            <div className="glass p-8 rounded-3xl space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total daily energy burned</span>
                  <div className="text-5xl font-black mt-2 text-primary">{tdee} <span className="text-sm font-normal text-slate-400">kcal/day</span></div>
                </div>
              </div>

              {/* Macro target recommendation */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-sm flex items-center space-x-1.5">
                  <Sparkles size={14} className="text-accent" />
                  <span>AI Macro split targets (Balanced diet)</span>
                </h4>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-primary block uppercase">Protein (20%)</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">{Math.round((tdee * 0.2) / 4)}g</span>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-amber-500 block uppercase">Carbs (50%)</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">{Math.round((tdee * 0.5) / 4)}g</span>
                  </div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-red-500 block uppercase">Fats (30%)</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">{Math.round((tdee * 0.3) / 9)}g</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
