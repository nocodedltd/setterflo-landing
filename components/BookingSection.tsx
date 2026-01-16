'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Zap, ArrowRight, CheckCircle, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BookingSectionProps {
  className?: string;
}

const BookingSection = ({ className }: BookingSectionProps) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'trial'>('demo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load Cal.com script
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      (function (C, A, L) { 
        let p = function (a, ar) { a.q.push(ar); }; 
        let d = C.document; 
        C.Cal = C.Cal || function () { 
          let cal = C.Cal; 
          let ar = arguments; 
          if (!cal.loaded) { 
            cal.ns = {}; 
            cal.q = cal.q || []; 
            d.head.appendChild(d.createElement("script")).src = A; 
            cal.loaded = true; 
          } 
          if (ar[0] === L) { 
            const api = function () { p(api, arguments); }; 
            const namespace = ar[1]; 
            api.q = api.q || []; 
            if(typeof namespace === "string"){
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar); 
            return;
          } 
          p(cal, ar); 
        }; 
      })(window, "https://app.cal.com/embed/embed.js", "init");
      
      Cal("init", "setterflo-demo", {origin:"https://app.cal.com"});
      
      Cal.ns["setterflo-demo"]("inline", {
        elementOrSelector:"#my-cal-inline-setterflo-demo",
        config: {"layout":"month_view"},
        calLink: "nocoded/setterflo-demo",
      });
      
      Cal.ns["setterflo-demo"]("ui", {
        "cssVarsPerTheme":{
          "light":{"cal-brand":"#00B9AD"},
          "dark":{"cal-brand":"#0E1B36"}
        },
        "hideEventTypeDetails":false,
        "layout":"month_view"
      });
    `;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleTrialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  if (submitted) {
    return (
      <section id="booking" className={`py-20 bg-background ${className}`}>
        {/* Backup anchor for book-call links */}
        <div id="book-call" className="absolute -mt-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="glass rounded-3xl p-8 shadow-soft border border-primary/20"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="mb-4 text-2xl font-bold text-text-primary font-heading">
                Welcome to SetterFlo! 🎉
              </h3>
              
              <p className="text-text-secondary mb-6">
                Check your email for your free trial setup instructions. You&apos;ll be booking more calls within 24 hours!
              </p>
              
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="mx-auto"
              >
                Back to Options
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className={`py-20 bg-background ${className}`}>
      {/* Backup anchor for book-call links */}
      <div id="book-call" className="absolute -mt-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
          >
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Ready to Get Started?
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary font-heading mb-6"
          >
            Choose Your Path to{' '}
            <span className="text-primary">More Booked Calls</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-text-secondary max-w-3xl mx-auto"
          >
            See SetterFlo in action with a personalised demo, or jump straight in with our free trial.
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="glass rounded-lg p-1 shadow-soft border border-border">
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'demo'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Calendar className="w-5 h-5 inline-block mr-2" />
                Book a Demo
              </button>
              <button
                onClick={() => setActiveTab('trial')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'trial'
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Zap className="w-5 h-5 inline-block mr-2" />
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Benefits */}
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              {activeTab === 'demo' ? (
                <>
                  <div className="glass rounded-2xl p-6 border border-border">
                    <Calendar className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-bold text-text-primary font-heading mb-3">
                      15-Minute Demo Call
                    </h3>
                    <p className="text-text-secondary mb-4">
                      See SetterFlo in action with a live demonstration tailored to your coaching business.
                    </p>
                    <ul className="space-y-2 text-text-secondary">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Live SetterFlo demo on your Instagram
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Custom ROI calculation for your business
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Personalised setup recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Q&A about your specific needs
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-text-muted glass rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Usually available within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>1-on-1 personal demo</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="glass rounded-2xl p-6 border border-border">
                    <Zap className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-bold text-text-primary font-heading mb-3">
                      7-Day Free Trial
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Get full access to SetterFlo with no commitment. See results in your first week.
                    </p>
                    <ul className="space-y-2 text-text-secondary">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Full platform access for 7 days
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Unlimited DM responses
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Real-time call booking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Setup support & training
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm text-text-muted glass rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Setup in under 10 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>No credit card required</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Right Side - Forms */}
            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl shadow-soft border border-border overflow-hidden"
            >
              {activeTab === 'demo' ? (
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-text-primary font-heading mb-4">
                    Schedule Your Demo
                  </h4>
                  <div 
                    style={{width:'100%', height:'500px', overflow:'scroll'}} 
                    id="my-cal-inline-setterflo-demo"
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-text-primary font-heading mb-4">
                    Start Your Free Trial
                  </h4>
                  
                  <form onSubmit={handleTrialSubmit} className="space-y-4">
                    <Input
                      name="name"
                      type="text"
                      label="Full Name"
                      placeholder="Enter your full name"
                      required
                    />
                    
                    <Input
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      required
                    />
                    
                    <Input
                      name="instagram"
                      type="text"
                      label="Instagram Handle"
                      placeholder="@yourusername (without the @)"
                      required
                    />
                    
                    <Input
                      name="business"
                      type="text"
                      label="Business/Coaching Niche"
                      placeholder="e.g., Business Coach, Mindset Coach"
                      required
                    />

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Start My Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="text-xs text-text-muted text-center mt-4">
                      No credit card required. Cancel anytime during your trial.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <p className="text-text-muted mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              const element = document.querySelector('#contact');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get in Touch
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;