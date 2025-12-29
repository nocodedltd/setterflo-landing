'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Sparkles, Check, ArrowRight, ArrowLeft, Building2, Bot } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type OnboardingStep = 'business' | 'ai-settings' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('business');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Business Info
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  // AI Settings
  const [aiPersonality, setAiPersonality] = useState('professional');
  const [responseStyle, setResponseStyle] = useState('friendly');
  const [qualificationCriteria, setQualificationCriteria] = useState('');

  const handleBusinessInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('ai-settings');
  };

  const handleAISettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      // Update user profile
      const { error: userError } = await supabase
        .from('users')
        .update({
          business_name: businessName,
          business_type: businessType,
          target_audience: targetAudience,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Create AI settings
      const { error: aiError } = await supabase
        .from('ai_settings')
        .insert({
          user_id: user.id,
          personality: aiPersonality,
          response_style: responseStyle,
          qualification_criteria: qualificationCriteria,
          auto_respond: true,
          auto_qualify: true,
        });

      if (aiError) throw aiError;

      setCurrentStep('complete');
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  // Completion Screen
  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 aurora" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-12 border border-border max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-text-primary mb-4"
            >
              Welcome to SetterFlo! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary mb-6"
            >
              Your account is all set up and ready to go
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 mb-8"
            >
              <div className="text-text-muted text-sm text-left space-y-2">
                <div className="flex items-center gap-3 p-3 glass-strong rounded-lg">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Business profile configured</span>
                </div>
                <div className="flex items-center gap-3 p-3 glass-strong rounded-lg">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>AI assistant personalized</span>
                </div>
                <div className="flex items-center gap-3 p-3 glass-strong rounded-lg">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Ready to automate Instagram DMs</span>
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard')}
              className="w-full bg-primary hover:bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Go to Dashboard
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Onboarding Steps
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 aurora" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary/8 rounded-full blur-lg animate-pulse" />

      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-text-primary font-heading cursor-pointer"
          >
            SetterFlo
          </motion.div>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep === 'business' ? 'text-primary' : 'text-text-muted'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep === 'business' 
                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'border-border bg-background-secondary'
                }`}>
                  <Briefcase size={18} />
                </div>
                <span className="ml-3 text-sm font-medium hidden sm:inline">Business Info</span>
              </div>
              <div className={`w-16 h-0.5 transition-all duration-300 ${
                currentStep === 'ai-settings' ? 'bg-primary' : 'bg-border'
              }`}></div>
              <div className={`flex items-center ${currentStep === 'ai-settings' ? 'text-primary' : 'text-text-muted'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep === 'ai-settings' 
                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'border-border bg-background-secondary'
                }`}>
                  <Bot size={18} />
                </div>
                <span className="ml-3 text-sm font-medium hidden sm:inline">AI Settings</span>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <AnimatePresence mode="wait">
            {currentStep === 'business' && (
              <motion.div
                key="business"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="glass rounded-2xl p-8 border border-border"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
                  >
                    <Building2 size={16} className="text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Step 1 of 2
                    </span>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-text-primary mb-2">
                    Tell us about your business
                  </h2>
                  <p className="text-text-secondary">
                    This helps us personalize your AI assistant
                  </p>
                </div>

                <form onSubmit={handleBusinessInfo} className="space-y-5">
                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-text-secondary mb-2">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Acme Coaching"
                      required
                      className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary placeholder:text-text-muted transition-all duration-200"
                    />
                  </div>

                  {/* Business Type */}
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-text-secondary mb-2">
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary transition-all duration-200"
                    >
                      <option value="">Select type...</option>
                      <option value="business-coach">Business Coach</option>
                      <option value="mindset-coach">Mindset Coach</option>
                      <option value="life-coach">Life Coach</option>
                      <option value="fitness-coach">Fitness Coach</option>
                      <option value="consultant">Consultant</option>
                      <option value="agency">Agency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-text-secondary mb-2">
                      Target Audience
                    </label>
                    <textarea
                      id="targetAudience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Describe who you typically work with..."
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary placeholder:text-text-muted transition-all duration-200 resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Continue
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {currentStep === 'ai-settings' && (
              <motion.div
                key="ai-settings"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="glass rounded-2xl p-8 border border-border"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
                  >
                    <Sparkles size={16} className="text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Step 2 of 2
                    </span>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-text-primary mb-2">
                    Configure your AI assistant
                  </h2>
                  <p className="text-text-secondary">
                    Define how your AI interacts with leads
                  </p>
                </div>

                <form onSubmit={handleAISettings} className="space-y-5">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* AI Personality */}
                  <div>
                    <label htmlFor="aiPersonality" className="block text-sm font-medium text-text-secondary mb-2">
                      AI Personality
                    </label>
                    <select
                      id="aiPersonality"
                      value={aiPersonality}
                      onChange={(e) => setAiPersonality(e.target.value)}
                      className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary transition-all duration-200"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                      <option value="enthusiastic">Enthusiastic</option>
                    </select>
                  </div>

                  {/* Response Style */}
                  <div>
                    <label htmlFor="responseStyle" className="block text-sm font-medium text-text-secondary mb-2">
                      Response Style
                    </label>
                    <select
                      id="responseStyle"
                      value={responseStyle}
                      onChange={(e) => setResponseStyle(e.target.value)}
                      className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary transition-all duration-200"
                    >
                      <option value="concise">Concise</option>
                      <option value="friendly">Friendly</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>

                  {/* Qualification Criteria */}
                  <div>
                    <label htmlFor="qualificationCriteria" className="block text-sm font-medium text-text-secondary mb-2">
                      Qualification Criteria
                      <span className="text-text-muted ml-1 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="qualificationCriteria"
                      value={qualificationCriteria}
                      onChange={(e) => setQualificationCriteria(e.target.value)}
                      placeholder="What makes someone a good fit for your services?"
                      rows={4}
                      className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary placeholder:text-text-muted transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={() => setCurrentStep('business')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 glass hover:glass-strong text-text-primary px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} />
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="flex-[2] bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Setting up...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center gap-2">
                            Complete Setup
                            <Check size={18} />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
