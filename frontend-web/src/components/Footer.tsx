import React from 'react';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xl font-extrabold text-primary">
              <Activity className="h-6 w-6 text-primary" />
              <span>NutriMind<span className="text-accent">AI</span></span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your Personal AI Nutrition & Fitness Coach. Powered by advanced machine learning models to optimize your lifestyle.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:text-primary">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
              <li><a href="#" className="hover:text-primary">AI Coach</a></li>
              <li><a href="#" className="hover:text-primary">Mobile App</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Subscribe for healthy recipes, fitness routines, and AI insights.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-2 text-sm rounded-l-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
              />
              <button className="px-4 py-2 rounded-r-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm">Join</button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NutriMind AI Inc. All rights reserved. Built with love by Google DeepMind team.</p>
        </div>
      </div>
    </footer>
  );
}
