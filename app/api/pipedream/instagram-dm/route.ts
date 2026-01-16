import { NextResponse } from 'next/server';
import { 
  findUserByInstagramAccount,
  getOrCreateConversation,
  createMessage,
} from '@/lib/instagram/conversations';
import { AIOrchestrator } from '@/lib/ai/agents/orchestrator';
import { buildConversationContext } from '@/lib/ai/agents/context-builder';

/**
 * Pipedream Instagram DM Webhook Handler
 * 
 * Receives Instagram DM webhooks from Pipedream and:
 * 1. Identifies which SetterFlo user owns the Instagram account
 * 2. Stores the message in the database
 * 3. Returns instructions for AI processing (to be implemented)
 * 
 * Architecture:
 * - Pipedream receives webhook from Meta
 * - Pipedream forwards to this endpoint with formatted data
 * - This endpoint handles user identification and storage
 * - Future: AI agent processes message and returns action
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('📨 Received Instagram DM webhook:', JSON.stringify(body, null, 2));
    
    // Extract webhook data (structure depends on how Pipedream formats it)
    // Expected format from Pipedream:
    // {
    //   webhook_data: {
    //     entry: [{
    //       messaging: [{
    //         sender: { id: "instagram_user_id" },
    //         recipient: { id: "instagram_business_account_id" },
    //         message: { text: "Hello", mid: "message_id" },
    //         timestamp: 1234567890
    //       }]
    //     }]
    //   }
    // }
    
    const webhookData = body.webhook_data || body;
    const entry = webhookData?.entry?.[0];
    const messaging = entry?.messaging?.[0];
    
    if (!messaging) {
      console.error('❌ Invalid webhook structure:', body);
      return NextResponse.json(
        { 
          error: 'Invalid webhook data structure',
          action: 'none',
          reply: null
        },
        { status: 400 }
      );
    }

    const {
      sender,
      recipient,
      message: messageContent,
      timestamp
    } = messaging;

    // Extract Instagram IDs
    const instagramUserId = sender?.id; // The lead messaging us
    const instagramAccountId = recipient?.id; // Our Instagram Business Account (receiving the message)
    const messageText = messageContent?.text || '';
    const instagramMessageId = messageContent?.mid;
    const messageTimestamp = timestamp ? new Date(timestamp * 1000).toISOString() : new Date().toISOString();

    if (!instagramUserId || !instagramAccountId) {
      console.error('❌ Missing required Instagram IDs:', { instagramUserId, instagramAccountId });
      return NextResponse.json(
        { 
          error: 'Missing Instagram user or account ID',
          action: 'none',
          reply: null
        },
        { status: 400 }
      );
    }

    console.log('🔍 Looking up user for Instagram account:', instagramAccountId);

    // Step 1: Find which SetterFlo user owns this Instagram account
    const userInfo = await findUserByInstagramAccount(instagramAccountId);
    
    if (!userInfo) {
      console.error('❌ No SetterFlo user found for Instagram account:', instagramAccountId);
      return NextResponse.json(
        { 
          error: 'Instagram account not linked to any SetterFlo user',
          action: 'none',
          reply: null
        },
        { status: 200 } // Return 200 so Pipedream doesn't retry
      );
    }

    console.log('✅ Found SetterFlo user:', userInfo.userId);

    // Step 2: Get or create conversation
    const conversation = await getOrCreateConversation(
      userInfo.userId,
      instagramAccountId,
      instagramUserId,
      undefined, // username (can be fetched from Instagram API if needed)
      undefined, // name (can be fetched from Instagram API if needed)
      undefined, // threadId (if available in webhook)
      userInfo.connectionId
    );

    console.log('✅ Conversation ready:', conversation.id);

    // Step 3: Store the message
    const storedMessage = await createMessage(
      conversation.id,
      messageText || '[No text content]',
      'lead', // Message from the lead
      {
        instagramMessageId,
        instagramTimestamp: messageTimestamp,
        messageType: messageContent?.attachments ? 'image' : 'text', // Basic detection
        mediaUrl: messageContent?.attachments?.[0]?.payload?.url,
        mediaType: messageContent?.attachments?.[0]?.type,
      }
    );

    console.log('✅ Message stored:', storedMessage.id);

    // Step 4: Process with AI agent system
    const orchestrator = new AIOrchestrator();
    
    // Build conversation context
    const context = await buildConversationContext(
      userInfo.userId,
      conversation.id,
      instagramUserId,
      instagramAccountId,
      conversation.qualification_state || 'new'
    );
    
    // Process message with AI agents
    const aiResponse = await orchestrator.processMessage(context, messageText);
    
    console.log('🤖 AI Response:', {
      action: aiResponse.action,
      nextState: aiResponse.nextQualificationState,
      toolsUsed: aiResponse.toolsUsed,
    });

    // Step 6: Return instructions for Pipedream
    return NextResponse.json({
      success: true,
      action: aiResponse.action, // 'send_dm', 'book_calendar', 'create_deal', 'none'
      reply: aiResponse.reply,
      metadata: {
        conversation_id: conversation.id,
        message_id: storedMessage.id,
        recipient_id: instagramUserId,
        qualification_state: aiResponse.nextQualificationState || conversation.qualification_state,
        should_book: aiResponse.shouldBook,
        should_create_deal: aiResponse.shouldCreateDeal,
        deal_data: aiResponse.dealData,
        calendar_data: aiResponse.calendarData,
      }
    });

  } catch (error) {
    console.error('❌ Error processing Instagram DM:', error);
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

// Legacy placeholder function removed - now using AIOrchestrator

/**
 * Webhook verification for Instagram (required by Meta)
 * 
 * Meta sends a GET request to verify the webhook endpoint.
 * Pipedream should handle this, but we include it here for direct webhook testing.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  // Verify token should match what you set in Meta App Dashboard
  const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || 'setterflo_verify_token_2024';
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Instagram webhook verified successfully');
    return new Response(challenge, { status: 200 });
  }
  
  console.log('❌ Webhook verification failed:', { mode, token, expected: VERIFY_TOKEN });
  return new Response('Forbidden', { status: 403 });
}
