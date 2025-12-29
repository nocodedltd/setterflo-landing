'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Instagram, Calendar, Briefcase, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface FirstTimeSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type SetupStep = 'welcome' | 'instagram' | 'calendar' | 'complete';

export function FirstTimeSetup({ isOpen, onClose, onComplete }: FirstTimeSetupProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>('welcome');
  const [skippedSteps, setSkippedSteps] = useState<Set<SetupStep>>(new Set());

  const steps: SetupStep[] = ['welcome', 'instagram', 'calendar', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleSkip = () => {
    setSkippedSteps(prev => new Set(prev).add(currentStep));
    handleNext();
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm">
      {/* Background Aurora Effect */}
      <div className="absolute inset-0 aurora opacity-50" />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl"
      >
        <Card className="glass border-border relative overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-white/10 transition-colors text-text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Progress Bar */}
          <div className="h-1 bg-black/20 relative">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 'welcome' && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mx-auto"
                  >
                    <Sparkles className="w-10 h-10 text-primary" />
                  </motion.div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-text-primary">
                      Welcome to SetterFlo! 🎉
                    </h2>
                    <p className="text-text-secondary text-lg max-w-md mx-auto">
                      Let's get you set up in just 2 minutes. We'll connect your Instagram account and calendar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                    <div className="p-4 glass-strong rounded-xl border border-border">
                      <Instagram className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-primary">Connect Instagram</p>
                      <p className="text-xs text-text-muted mt-1">1 minute</p>
                    </div>
                    <div className="p-4 glass-strong rounded-xl border border-border">
                      <Calendar className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-primary">Connect Calendar</p>
                      <p className="text-xs text-text-muted mt-1">1 minute</p>
                    </div>
                    <div className="p-4 glass-strong rounded-xl border border-border">
                      <CheckCircle className="h-6 w-6 text-success-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-primary">Start Automating</p>
                      <p className="text-xs text-text-muted mt-1">Instant</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20 group"
                    >
                      Let's Get Started
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'instagram' && (
                <motion.div
                  key="instagram"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5 shadow-lg mx-auto">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <Instagram className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      Connect Your Instagram
                    </h2>
                    <p className="text-text-secondary max-w-md mx-auto">
                      We'll need access to your Instagram Business or Creator account to send and receive DMs automatically.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 glass-strong rounded-xl border border-border">
                      <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        What We'll Do
                      </h4>
                      <ul className="space-y-2 text-sm text-text-secondary">
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          Respond to DMs automatically with your AI agent
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          Qualify leads and book calls instantly
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          Sync conversations to your CRM
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs text-primary-400 flex items-start gap-2">
                        <Sparkles className="h-4 w-4 flex-shrink-0" />
                        <span>You'll be redirected to Instagram to authorize access. We only request permissions needed for DM automation.</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="border-white/10 hover:bg-white/5"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500 hover:opacity-90 text-white shadow-lg"
                    >
                      Connect Instagram
                      <Instagram className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      className="text-text-muted hover:text-white"
                    >
                      Skip
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mx-auto">
                      <Calendar className="h-8 w-8 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      Connect Your Calendar
                    </h2>
                    <p className="text-text-secondary max-w-md mx-auto">
                      Allow qualified leads to book calls automatically when they're ready.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'Calendly', color: 'blue' },
                      { name: 'Cal.com', color: 'green' },
                      { name: 'Google Calendar', color: 'red' },
                      { name: 'Other', color: 'gray' },
                    ].map((calendar) => (
                      <button
                        key={calendar.name}
                        className="p-4 glass-strong hover:glass rounded-xl border border-border hover:border-primary/30 transition-all text-left"
                      >
                        <p className="font-medium text-text-primary">{calendar.name}</p>
                        <p className="text-xs text-text-muted mt-1">Click to connect</p>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-xs text-primary-400 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>You can connect multiple calendars and set booking rules later in settings.</span>
                    </p>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="border-white/10 hover:bg-white/5"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      className="text-text-muted hover:text-white"
                    >
                      Skip
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-500/20 mx-auto"
                  >
                    <CheckCircle className="w-10 h-10 text-success-500" />
                  </motion.div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-text-primary">
                      You're All Set! 🚀
                    </h2>
                    <p className="text-text-secondary text-lg max-w-md mx-auto">
                      Your AI-powered Instagram DM automation is ready to start qualifying leads and booking calls.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                    <div className="p-4 glass-strong rounded-xl border border-success-500/20">
                      <CheckCircle className="h-6 w-6 text-success-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-primary">Instagram Connected</p>
                    </div>
                    <div className={cn(
                      "p-4 glass-strong rounded-xl border",
                      skippedSteps.has('calendar') 
                        ? "border-warning-500/20 opacity-50" 
                        : "border-success-500/20"
                    )}>
                      <Calendar className={cn(
                        "h-6 w-6 mx-auto mb-2",
                        skippedSteps.has('calendar') ? "text-warning-500" : "text-success-500"
                      )} />
                      <p className="text-sm font-medium text-text-primary">
                        {skippedSteps.has('calendar') ? 'Calendar (Skipped)' : 'Calendar Connected'}
                      </p>
                    </div>
                    <div className="p-4 glass-strong rounded-xl border border-success-500/20">
                      <Briefcase className="h-6 w-6 text-success-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-primary">Profile Complete</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={handleComplete}
                      className="w-full bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20 py-6 text-lg group"
                    >
                      Go to Dashboard
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
