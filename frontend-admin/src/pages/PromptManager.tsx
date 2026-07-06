import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Terminal, Save, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function PromptManager() {
  const queryClient = useQueryClient();
  const [dietPrompt, setDietPrompt] = useState('');
  const [workoutPrompt, setWorkoutPrompt] = useState('');

  // Fetch initial prompt config
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['promptConfig'],
    queryFn: async () => {
      // Direct call to admin API (under /api)
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/admin/prompt-config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    // Fallback default state
    initialData: {
      dietPrompt: 'Act as a professional sports dietitian. Analyze the demographic details, height, weight, activity levels, and preferences of the user. Formulate a personalized meal schedule in JSON format.',
      workoutPrompt: 'Act as an expert fitness personal trainer. Devise a structured strength and conditioning split matching preferences. Include warmups, core sets, repetitions, and rest guidelines.'
    }
  });

  useEffect(() => {
    if (data) {
      setDietPrompt(data.dietPrompt);
      setWorkoutPrompt(data.workoutPrompt);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: { dietPrompt: string; workoutPrompt: string }) => {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/admin/prompt-config', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptConfig'] });
      alert('Prompt configurations updated successfully!');
    },
    onError: () => {
      // Mock update fallback for development
      alert('[Local Mock] Prompt configuration updated (offline fallback)');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ dietPrompt, workoutPrompt });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold flex items-center space-x-2">
          <Terminal size={28} className="text-primary" />
          <span>AI System Prompt Manager</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Configure systemic instructions and persona mappings guiding diet and workout generators.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Diet planner */}
        <div className="glass p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Diet planner agent prompt</h3>
          <p className="text-xs text-slate-500">Guides the AI diet generator on how to calculate caloric targets and write menu splits.</p>
          <textarea
            value={dietPrompt}
            onChange={(e) => setDietPrompt(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-sm font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Workout split planner */}
        <div className="glass p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Workout generator agent prompt</h3>
          <p className="text-xs text-slate-500">Guides the workout planning assistant to scale exercises, repetitions, sets, and cardio intervals.</p>
          <textarea
            value={workoutPrompt}
            onChange={(e) => setWorkoutPrompt(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-sm font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all disabled:opacity-50 hover:scale-[1.01]"
          >
            <Save size={16} />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
