import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Pipedream Instagram DM Webhook Handler
 * Receives Instagram DM data from Pipedream and processes with AI
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('Received Instagram DM webhook:', body);
    
    const {
      platform,
      webhook_data,
      headers: webhookHeaders,
      timestamp
    } = body;

    // Extract Instagram message data
    const message = webhook_data?.entry?.[0]?.messaging?.[0];
    
    if (!message) {
      return NextResponse.json(
        { error: 'Invalid webhook data structure' },
        { status: 400 }
      );
    }

    const {
      sender,
      recipient,
      timestamp: messageTimestamp,
      message: messageContent
    } = message;

    const instagramUserId = sender?.id;
    const messageText = messageContent?.text;
    const messageId = messageContent?.mid;

    // TODO: Look up which of YOUR users owns this Instagram account
    // For now, we'll use a placeholder - you'll need to implement this
    // based on how you store user's connected Instagram accounts
    const supabase = await createClient();
    
    // Example: Find the user who owns this Instagram account
    const { data: userAccount } = await supabase
      .from('users')
      .select('id, instagram_account_id')
      .eq('instagram_account_id', recipient?.id)
      .single();

    if (!userAccount) {
      console.error('No user found for Instagram account:', recipient?.id);
      return NextResponse.json(
        { 
          error: 'Instagram account not linked to any user',
          action: 'none',
          reply: null
        },
        { status: 200 }
      );
    }

    // Check if this is a new lead or existing conversation
    const { data: existingLead } = await supabase
      .from('ig_users')
      .select('id, conversation_state, last_message')
      .eq('instagram_user_id', instagramUserId)
      .eq('user_id', userAccount.id)
      .single();

    // TODO: IMPLEMENT YOUR AI LOGIC HERE
    // This is where you'd call OpenAI, Anthropic, etc.
    // For now, returning a simple response structure
    
    const aiResponse = await generateAIResponse({
      leadId: existingLead?.id,
      userId: userAccount.id,
      message: messageText,
      conversationState: existingLead?.conversation_state || 'new',
      instagramUserId
    });

    // Log conversation to database
    if (existingLead) {
      await supabase
        .from('ig_users')
        .update({
          last_message: messageText,
          last_message_at: new Date().toISOString(),
          conversation_state: aiResponse.nextState
        })
        .eq('id', existingLead.id);
    } else {
      // Create new lead
      await supabase
        .from('ig_users')
        .insert({
          user_id: userAccount.id,
          instagram_user_id: instagramUserId,
          instagram_username: sender?.username || 'unknown',
          last_message: messageText,
          last_message_at: new Date().toISOString(),
          conversation_state: aiResponse.nextState,
          status: 'active'
        });
    }

    // Return instructions for Pipedream to execute
    return NextResponse.json({
      success: true,
      action: aiResponse.action, // 'send_dm', 'book_calendar', 'create_deal', or 'none'
      reply: aiResponse.reply,
      metadata: {
        recipient_id: instagramUserId,
        lead_id: existingLead?.id,
        should_book: aiResponse.shouldBook,
        should_create_deal: aiResponse.shouldCreateDeal,
        deal_data: aiResponse.dealData,
        calendar_data: aiResponse.calendarData
      }
    });

  } catch (error) {
    console.error('Error processing Instagram DM:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        action: 'none',
        reply: null
      },
      { status: 500 }
    );
  }
}

/**
 * Generate AI response based on conversation context
 * TODO: Implement your actual AI logic here
 */
async function generateAIResponse({
  leadId,
  userId,
  message,
  conversationState,
  instagramUserId
}: {
  leadId?: string;
  userId: string;
  message: string;
  conversationState: string;
  instagramUserId: string;
}) {
  // PLACEHOLDER - Replace with your actual AI implementation
  // Use Vercel AI SDK, OpenAI, Anthropic, etc.
  
  const messageLower = message.toLowerCase();
  
  // Simple qualification logic
  if (conversationState === 'new') {
    return {
      action: 'send_dm',
      reply: "Hi! Thanks for reaching out. I'd love to help you book a discovery call. What are you currently struggling with in your business?",
      nextState: 'qualifying',
      shouldBook: false,
      shouldCreateDeal: true,
      dealData: {
        name: `Instagram Lead - ${instagramUserId}`,
        stage: 'New Lead',
        source: 'Instagram DM'
      }
    };
  }
  
  if (conversationState === 'qualifying') {
    if (messageLower.includes('book') || messageLower.includes('call') || messageLower.includes('schedule')) {
      return {
        action: 'book_calendar',
        reply: "Great! I'd love to schedule a call with you. What's your email address?",
        nextState: 'booking',
        shouldBook: true,
        shouldCreateDeal: false,
        calendarData: {
          event_type: 'discovery-call',
          duration: 30
        }
      };
    }
    
    return {
      action: 'send_dm',
      reply: "I understand. Based on what you've shared, I think a 30-minute strategy call could really help. Would you like to schedule that?",
      nextState: 'qualifying',
      shouldBook: false,
      shouldCreateDeal: false
    };
  }
  
  // Default response
  return {
    action: 'send_dm',
    reply: "Thanks for your message! How can I help you today?",
    nextState: conversationState,
    shouldBook: false,
    shouldCreateDeal: false
  };
}

/**
 * Webhook verification for Instagram (required by Meta)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  // Verify token should match what you set in Meta App Dashboard
  const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || 'setterflo_verify_token_2024';
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Instagram webhook verified successfully');
    return new Response(challenge, { status: 200 });
  }
  
  return new Response('Forbidden', { status: 403 });
}
