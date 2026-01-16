/**
 * Conversation Agent
 * 
 * Analyzes Instagram DM messages and determines:
 * - Qualification state transitions
 * - Appropriate response text
 * - Whether to book calendar or create deal
 */

import { ConversationContext, AIResponse, QualificationState } from './types';

export class ConversationAgent {
  /**
   * Analyze message and determine next action
   */
  async analyze(
    context: ConversationContext,
    newMessage: string
  ): Promise<AIResponse> {
    const messageLower = newMessage.toLowerCase().trim();
    const currentState = context.qualificationState;

    console.log('💬 Conversation Agent: Analyzing message', {
      state: currentState,
      messagePreview: newMessage.substring(0, 50),
    });

    // Simple state machine for now
    // TODO: Replace with actual LLM (OpenAI, Anthropic, etc.)
    
    switch (currentState) {
      case 'new':
        return this.handleNewLead(context, messageLower, newMessage);
      
      case 'qualifying':
        return this.handleQualifying(context, messageLower, newMessage);
      
      case 'qualified':
        return this.handleQualified(context, messageLower, newMessage);
      
      case 'booking':
        return this.handleBooking(context, messageLower, newMessage);
      
      case 'not_interested':
        return this.handleNotInterested(context, messageLower, newMessage);
      
      case 'booked':
      case 'closed':
        return this.handleClosed(context, messageLower, newMessage);
      
      default:
        return this.getDefaultResponse(context);
    }
  }

  private handleNewLead(
    context: ConversationContext,
    messageLower: string,
    originalMessage: string
  ): AIResponse {
    // First contact - greet and start qualification
    return {
      action: 'send_dm',
      reply: "Hi! Thanks for reaching out. I'd love to help you book a discovery call. What are you currently struggling with in your business?",
      nextQualificationState: 'qualifying',
      shouldBook: false,
      shouldCreateDeal: true,
      dealData: {
        name: `Instagram Lead - ${context.instagramUserId.substring(0, 8)}`,
        stage: 'New Lead',
        source: 'Instagram DM',
        qualification_state: 'qualifying',
      },
      toolsUsed: ['analyze_message', 'determine_qualification'],
      confidence: 0.9,
    };
  }

  private handleQualifying(
    context: ConversationContext,
    messageLower: string,
    originalMessage: string
  ): AIResponse {
    // Check for booking intent
    const bookingKeywords = ['book', 'call', 'schedule', 'meeting', 'appointment', 'calendar', 'time'];
    const hasBookingIntent = bookingKeywords.some(keyword => messageLower.includes(keyword));

    if (hasBookingIntent) {
      return {
        action: 'book_calendar',
        reply: "Great! I'd love to schedule a call with you. What's your email address?",
        nextQualificationState: 'booking',
        shouldBook: true,
        shouldCreateDeal: false,
        calendarData: {
          event_type: 'discovery-call',
          duration: 30,
        },
        toolsUsed: ['detect_booking_intent', 'prepare_calendar_booking'],
        confidence: 0.85,
      };
    }

    // Check for not interested
    const notInterestedKeywords = ['not interested', 'no thanks', "don't need", 'not right now'];
    const isNotInterested = notInterestedKeywords.some(phrase => messageLower.includes(phrase));

    if (isNotInterested) {
      return {
        action: 'send_dm',
        reply: "No problem at all! If you change your mind or have questions in the future, feel free to reach out. Have a great day!",
        nextQualificationState: 'not_interested',
        shouldBook: false,
        shouldCreateDeal: false,
        toolsUsed: ['detect_rejection'],
        confidence: 0.8,
      };
    }

    // Continue qualification
    return {
      action: 'send_dm',
      reply: "I understand. Based on what you've shared, I think a 30-minute strategy call could really help. Would you like to schedule that?",
      nextQualificationState: 'qualifying',
      shouldBook: false,
      shouldCreateDeal: false,
      toolsUsed: ['continue_qualification'],
      confidence: 0.7,
    };
  }

  private handleQualified(
    context: ConversationContext,
    messageLower: string,
    originalMessage: string
  ): AIResponse {
    // Lead is qualified - push for booking
    const bookingKeywords = ['book', 'call', 'schedule', 'meeting'];
    const hasBookingIntent = bookingKeywords.some(keyword => messageLower.includes(keyword));

    if (hasBookingIntent) {
      return {
        action: 'book_calendar',
        reply: "Perfect! Let's get you scheduled. What's your email address?",
        nextQualificationState: 'booking',
        shouldBook: true,
        shouldCreateDeal: false,
        calendarData: {
          event_type: 'discovery-call',
          duration: 30,
        },
        toolsUsed: ['book_calendar'],
        confidence: 0.9,
      };
    }

    return {
      action: 'send_dm',
      reply: "Great! I'd love to schedule a call to discuss how we can help. What's your email address?",
      nextQualificationState: 'qualified',
      shouldBook: false,
      shouldCreateDeal: false,
      toolsUsed: ['maintain_engagement'],
      confidence: 0.75,
    };
  }

  private handleBooking(
    context: ConversationContext,
    messageLower: string,
    originalMessage: string
  ): AIResponse {
    // Extract email if present
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = originalMessage.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : null;

    if (email) {
      return {
        action: 'book_calendar',
        reply: `Perfect! I'll send you a calendar link shortly. Check your email at ${email} for the booking link.`,
        nextQualificationState: 'booked',
        shouldBook: true,
        shouldCreateDeal: false,
        calendarData: {
          event_type: 'discovery-call',
          duration: 30,
          email: email,
        },
        toolsUsed: ['extract_email', 'book_calendar'],
        confidence: 0.95,
      };
    }

    // No email found - ask for it
    return {
      action: 'send_dm',
      reply: "I'd love to send you a calendar link! What's your email address?",
      nextQualificationState: 'booking',
      shouldBook: false,
      shouldCreateDeal: false,
      toolsUsed: ['request_email'],
      confidence: 0.8,
    };
  }

  private handleNotInterested(
    context: ConversationContext,
    messageLower: string,
    originalMessage: string
  ): AIResponse {
    // Lead said not interested - be respectful and close
    return {
      action: 'none',
      reply: null,
      nextQualificationState: 'not_interested',
      shouldBook: false,
      shouldCreateDeal: false,
      toolsUsed: ['respect_decision'],
      confidence: 1.0,
    };
  }

  private handleClosed(
    context: ConversationContext,
    messageLower: string,
    originalMessage: string
  ): AIResponse {
    // Conversation is closed/booked - minimal response
    return {
      action: 'send_dm',
      reply: "Thanks for reaching out! If you have any questions, feel free to ask.",
      nextQualificationState: context.qualificationState,
      shouldBook: false,
      shouldCreateDeal: false,
      toolsUsed: ['maintain_relationship'],
      confidence: 0.6,
    };
  }

  private getDefaultResponse(context: ConversationContext): AIResponse {
    return {
      action: 'send_dm',
      reply: "Thanks for your message! How can I help you today?",
      nextQualificationState: context.qualificationState,
      shouldBook: false,
      shouldCreateDeal: false,
      toolsUsed: ['default_response'],
      confidence: 0.5,
    };
  }
}
