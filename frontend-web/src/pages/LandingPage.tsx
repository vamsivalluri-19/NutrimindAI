import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Shield, Sparkles, Flame, Apple, Trophy, CheckCircle, ChevronDown } from 'lucide-react';
import Footer from '../components/Footer';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Gradient Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            <span>Next-Gen AI Fitness & Diet</span>
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-6">
            Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AI Nutrition</span> & Workout Coach
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            NutriMind AI creates highly personalized diet plans, logs meals from photos instantly, schedules workouts, and adapts dynamically to your daily health trackers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-xl shadow-primary/25 hover:scale-[1.03]"
            >
              Start Free Trial
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold transition-all"
            >
              <span>Explore Features</span>
              <ChevronDown size={16} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Unleash the Power of AI on Your Fitness Journey
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Our platform provides state-of-the-art tools designed to simplify meal tracking and structure workout schedules.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="glass p-8 rounded-3xl shadow-sm dark:shadow-slate-950/20 hover:scale-[1.02] transition-transform">
            <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary mb-6">
              <Apple size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Meal Scanning</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Snap a picture of your dinner. Our multimodal vision model identifies ingredients, portions, and calculates exact macro and micronutrient logs.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="glass p-8 rounded-3xl shadow-sm dark:shadow-slate-950/20 hover:scale-[1.02] transition-transform">
            <div className="p-3 bg-accent/10 rounded-2xl w-fit text-accent mb-6">
              <Flame size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Dynamic Workout Generator</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Get workouts designed for gym, home, or outdoors. The AI checks your target weight, stamina levels, and injuries to scale sets and reps.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="glass p-8 rounded-3xl shadow-sm dark:shadow-slate-950/20 hover:scale-[1.02] transition-transform">
            <div className="p-3 bg-blue-500/10 rounded-2xl w-fit text-blue-500 mb-6">
              <Sparkles size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Chat Assistant</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Have health questions? Ask your AI coach directly. Get shopping lists, recipe adaptations, and lifestyle advice in real-time.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Choose Your Fit Plan
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Flexible packages crafted for individuals, professionals, and families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="glass p-8 rounded-3xl flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <h3 className="text-xl font-bold mb-2">Free Plan</h3>
              <p className="text-sm text-slate-500 mb-6">Explore the basics of AI coaching</p>
              <div className="text-4xl font-extrabold mb-6">$0<span className="text-sm text-slate-500 font-normal"> / month</span></div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>Daily calorie logs</span></li>
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>Standard exercise catalog</span></li>
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>3 AI inquiries / day</span></li>
              </ul>
            </div>
            <Link to="/login" className="mt-8 block w-full py-3 rounded-2xl text-center font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white">Get Started</Link>
          </div>

          {/* Pro Plan */}
          <div className="glass p-8 rounded-3xl flex flex-col justify-between border-2 border-primary shadow-lg relative overflow-hidden scale-105">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase">Best Value</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
              <p className="text-sm text-slate-500 mb-6">Unleash the full potential of AI logs</p>
              <div className="text-4xl font-extrabold mb-6">$9.99<span className="text-sm text-slate-500 font-normal"> / month</span></div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>Unlimited AI meal vision scanning</span></li>
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>Custom weekly diet & workout plans</span></li>
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>24/7 AI chat coach memory</span></li>
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>Advanced Recharts history & analytics</span></li>
              </ul>
            </div>
            <Link to="/login" className="mt-8 block w-full py-3 rounded-2xl text-center font-bold bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20">Subscribe Pro</Link>
          </div>

          {/* Premium Plan */}
          <div className="glass p-8 rounded-3xl flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <h3 className="text-xl font-bold mb-2">Premium Coach</h3>
              <p className="text-sm text-slate-500 mb-6">Expert advice plus intelligence logs</p>
              <div className="text-4xl font-extrabold mb-6">$29.99<span className="text-sm text-slate-500 font-normal"> / month</span></div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>Everything in Pro plan</span></li>
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>1-on-1 chat with registered nutritionists</span></li>
                <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-primary" /><span>Certified trainer reviews and workouts</span></li>
              </ul>
            </div>
            <Link to="/login" className="mt-8 block w-full py-3 rounded-2xl text-center font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white">Upgrade Premium</Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">How accurate is the AI meal recognition camera?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Our vision scanner identifies standard recipes and foods with high accuracy. For custom mixed plates, you can refine inputs via voice commands or text typing.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Can I sync my logs with smartwatches?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Yes, the mobile app includes health sync profiles that read active steps, calories burned, and sleeping graphs directly from Apple Health and Google Fit.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
