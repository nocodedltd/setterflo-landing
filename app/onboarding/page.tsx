'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

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

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">🎉 Welcome to SetterFlo!</CardTitle>
            <CardDescription className="text-center">
              Your account is all set up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-gray-600">
                You&apos;re ready to start automating your Instagram DMs!
              </p>
              <p className="text-sm text-gray-500">
                Next, connect your Instagram account to get started.
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              fullWidth
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep === 'business' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'business' ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Business Info</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 'ai-settings' ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'ai-settings' ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">AI Settings</span>
            </div>
          </div>
        </div>

        <Card>
          {currentStep === 'business' && (
            <>
              <CardHeader>
                <CardTitle>Tell us about your business</CardTitle>
                <CardDescription>
                  This helps us personalize your AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBusinessInfo} className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Acme Coaching"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                  <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience
                    </label>
                    <textarea
                      id="targetAudience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Describe who you typically work with..."
                      rows={3}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <Button type="submit" fullWidth>
                    Continue
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {currentStep === 'ai-settings' && (
            <>
              <CardHeader>
                <CardTitle>Configure your AI assistant</CardTitle>
                <CardDescription>
                  Define how your AI interacts with leads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAISettings} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="aiPersonality" className="block text-sm font-medium text-gray-700 mb-1">
                      AI Personality
                    </label>
                    <select
                      id="aiPersonality"
                      value={aiPersonality}
                      onChange={(e) => setAiPersonality(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                      <option value="enthusiastic">Enthusiastic</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="responseStyle" className="block text-sm font-medium text-gray-700 mb-1">
                      Response Style
                    </label>
                    <select
                      id="responseStyle"
                      value={responseStyle}
                      onChange={(e) => setResponseStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="concise">Concise</option>
                      <option value="friendly">Friendly</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="qualificationCriteria" className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification Criteria
                    </label>
                    <textarea
                      id="qualificationCriteria"
                      value={qualificationCriteria}
                      onChange={(e) => setQualificationCriteria(e.target.value)}
                      placeholder="What makes someone a good fit for your services?"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep('business')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      loadingText="Setting up..."
                      className="flex-1"
                    >
                      Complete Setup
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
