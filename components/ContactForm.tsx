"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { contact } from "@/lib/content/landing-data";
import { ContactFormSchema, type ContactFormInput } from "@/lib/schemas/contact";
import type { ContactFormResponse } from "@/lib/types/contact";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: ContactFormInput) => {
    try {
      setSubmitError(null);
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ContactFormResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.success === false ? result.error : "Something went wrong");
      }

      // Success!
      setIsSubmitted(true);
      reset();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <section id="contact" className={cn("py-section-y bg-secondary-50", className)}>
        <div className="mx-auto max-w-content px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className="animate-fade-up rounded-2xl bg-white p-8 shadow-soft"
              role="status"
              aria-live="polite"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                <svg 
                  className="h-8 w-8 text-success-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-secondary-900">
                Message Sent!
              </h3>
              <p className="text-secondary-600">
                {contact.successMessage}
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setIsSubmitted(false)}
              >
                Send Another Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main contact form
  return (
    <section id="contact" className={cn("py-section-y bg-secondary-50", className)}>
      <div className="mx-auto max-w-content px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
            {contact.sectionTitle}
          </h2>
          {contact.sectionSubtitle && (
            <p className="mt-4 text-lg leading-8 text-secondary-600">
              {contact.sectionSubtitle}
            </p>
          )}
        </div>

        {/* Contact form */}
        <div className="mx-auto mt-16 max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-up">
            <div className="rounded-2xl bg-white p-8 shadow-soft">
              <h3 className="mb-6 text-xl font-semibold text-secondary-900">
                {contact.formTitle}
              </h3>
              
              <div className="space-y-6">
                {/* Full Name field */}
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  error={errors.name?.message}
                  {...register("name")}
                />

                {/* Email field */}
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  error={errors.email?.message}
                  {...register("email")}
                />

                {/* Instagram Username field */}
                <Input
                  label="Instagram Username"
                  placeholder="@yourusername (without the @)"
                  required
                  error={errors.instagramUsername?.message}
                  {...register("instagramUsername")}
                />

                {/* Company Name field (optional) */}
                <Input
                  label="Company/Business Name"
                  placeholder="Enter your company or business name"
                  error={errors.companyName?.message}
                  {...register("companyName")}
                />

                {/* Monthly Revenue Range */}
                <Select
                  label="Monthly Revenue Range"
                  required
                  options={[
                    { value: "under-5k", label: "Under £5,000" },
                    { value: "5k-15k", label: "£5,000 - £15,000" },
                    { value: "15k-30k", label: "£15,000 - £30,000" },
                    { value: "30k-50k", label: "£30,000 - £50,000" },
                    { value: "50k-plus", label: "£50,000+" },
                  ]}
                  placeholder="Select your monthly revenue range..."
                  error={errors.monthlyRevenue?.message}
                  {...register("monthlyRevenue")}
                />

                {/* Current Number of Setters */}
                <Select
                  label="Current Setter Situation"
                  required
                  options={[
                    { value: "0", label: "No setters (I handle DMs myself)" },
                    { value: "1", label: "1 setter" },
                    { value: "2-3", label: "2-3 setters" },
                    { value: "4-plus", label: "4+ setters" },
                    { value: "freelancers", label: "I hire freelancers occasionally" },
                  ]}
                  placeholder="Select your current situation..."
                  error={errors.currentSetters?.message}
                  {...register("currentSetters")}
                />

                {/* Biggest Challenge */}
                <Select
                  label="What's Your Biggest Challenge?"
                  required
                  options={[
                    { value: "inconsistent-leads", label: "Inconsistent lead flow" },
                    { value: "low-dm-response", label: "Low DM response rates" },
                    { value: "unreliable-setters", label: "Setters are unreliable/expensive" },
                    { value: "too-much-time-on-dms", label: "Spending too much time on DMs" },
                    { value: "cant-scale-capacity", label: "Can't scale beyond current capacity" },
                    { value: "other", label: "Other" },
                  ]}
                  placeholder="Select your biggest challenge..."
                  error={errors.biggestChallenge?.message}
                  {...register("biggestChallenge")}
                />

                {/* Timeline */}
                <Select
                  label="When Are You Looking to Solve This?"
                  required
                  options={[
                    { value: "immediately", label: "Immediately (this week)" },
                    { value: "within-month", label: "Within the next month" },
                    { value: "2-3-months", label: "Next 2-3 months" },
                    { value: "just-exploring", label: "Just exploring options" },
                  ]}
                  placeholder="Select your timeline..."
                  error={errors.timeline?.message}
                  {...register("timeline")}
                />

                {/* Phone Number field (optional) */}
                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="For priority callbacks on urgent requests"
                  error={errors.phoneNumber?.message}
                  {...register("phoneNumber")}
                />

                {/* Submit error */}
                {submitError && (
                  <div className="rounded-lg bg-error-50 p-4" role="alert" aria-live="assertive">
                    <div className="flex items-start">
                      <svg 
                        className="h-5 w-5 text-error-600 mt-0.5 mr-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <p className="text-sm text-error-800">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {contact.submitButtonText}
                </Button>
              </div>

              {/* Form footer */}
              <p className="mt-6 text-xs text-secondary-500 text-center">
                We&apos;ll get back to you within 24 hours. Your information is secure and will never be shared.
              </p>
            </div>
          </form>
        </div>

        {/* Additional contact info */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="text-center">
            <p className="text-sm font-semibold text-secondary-900">
              Prefer to reach us directly?
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a 
                href="mailto:hello@setterflo.com" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                hello@setterflo.com
              </a>
              <span className="text-secondary-400">|</span>
              <a 
                href="tel:+1-555-123-4567" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
