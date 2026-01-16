/**
 * AI Agent System Types
 * 
 * Types for the multi-agent AI system that processes Instagram DMs
 * and manages lead qualification, CRM updates, and calendar booking.
 */

export type QualificationState = 'new' | 'qualifying' | 'qualified' | 'booking' | 'not_interested' | 'booked' | 'closed';

export type ActionType = 'send_dm' | 'book_calendar' | 'create_deal' | 'update_deal' | 'create_contact' | 'none';

export interface ConversationContext {
  conversationId: string;
  userId: string;
  instagramUserId: string;
  instagramAccountId: string;
  qualificationState: QualificationState;
  messageHistory: Message[];
  userConnections: UserConnections;
}

export interface Message {
  id: string;
  text: string;
  sender: 'lead' | 'user' | 'ai';
  sent_at: string;
  message_type?: string;
}

export interface UserConnections {
  crm?: CRMConnection;
  calendar?: CalendarConnection;
  instagram?: InstagramConnection;
}

export interface CRMConnection {
  platform: 'hubspot' | 'gohighlevel' | 'pipedrive' | 'activecampaign' | 'salesforce' | 'monday';
  connectionId: string;
  accessToken: string;
  metadata: Record<string, any>;
}

export interface CalendarConnection {
  platform: 'calendly' | 'calcom';
  connectionId: string;
  accessToken: string;
  metadata: Record<string, any>;
}

export interface InstagramConnection {
  connectionId: string;
  accessToken: string;
  metadata: Record<string, any>;
}

export interface AIResponse {
  action: ActionType;
  reply: string | null;
  nextQualificationState?: QualificationState;
  shouldBook: boolean;
  shouldCreateDeal: boolean;
  dealData?: DealData;
  calendarData?: CalendarData;
  toolsUsed?: string[];
  confidence?: number;
}

export interface DealData {
  name: string;
  stage?: string;
  source?: string;
  qualification_state?: QualificationState;
  amount?: number;
  currency?: string;
  customFields?: Record<string, any>;
}

export interface CalendarData {
  event_type?: string;
  duration?: number;
  email?: string;
  name?: string;
  notes?: string;
}

export interface AgentResult {
  success: boolean;
  data?: any;
  error?: string;
  toolsUsed?: string[];
}
