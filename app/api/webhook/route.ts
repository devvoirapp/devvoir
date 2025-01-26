import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/app/lib/prisma';

interface WebhookBody {
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      identifier: string;
      order_number: number;
      user_name: string;
      user_email: string;
      currency: string;
      currency_rate: string;
      subtotal: number;
      discount_total: number;
      tax: number;
      total: number;
      subtotal_usd: number;
      discount_total_usd: number;
      tax_usd: number;
      total_usd: number;
      status: 'pending' | 'paid' | 'failed';
      status_formatted: string;
      refunded: boolean;
      refunded_at: string | null;
      subtotal_formatted: string;
      discount_total_formatted: string;
      tax_formatted: string;
      total_formatted: string;
      first_order_item: {
        id: number;
        order_id: number;
        product_id: number;
        variant_id: number;
        product_name: string;
        variant_name: string;
        price: number;
        created_at: string;
        updated_at: string;
      };
      created_at: string;
      updated_at: string;
    };
    relationships: {
      store: {
        data: {
          type: string;
          id: string;
        };
      };
      customer: {
        data: {
          type: string;
          id: string;
        };
      };
      order_items: {
        data: Array<{
          type: string;
          id: string;
        }>;
      };
    };
  };
  meta: {
    test_mode: boolean;
    event_name: string;
    custom_data: {
      user_id: string;
      email: string;
      name: string;
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    // Clone the request for multiple reads
    const clonedReq = req.clone();
    
    // Get the event type and raw body
    const eventType = req.headers.get('X-Event-Name');
    const rawBody = await clonedReq.text();
    const body: WebhookBody = JSON.parse(rawBody);

    console.log('Webhook received:', {
      eventType,
      customData: body.meta.custom_data
    });

    // Verify webhook signature
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE;
    if (!secret) {
      throw new Error('Webhook signature secret is not configured');
    }

    const signature = req.headers.get('X-Signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 401 }
      );
    }

    // Create HMAC
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    // Verify signature
    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    console.log({eventType});

    // Handle different webhook events
    switch (eventType) {
      case 'order_created': {
        // Get user identification from custom data
        const { user_id, email } = body.meta.custom_data;
        
        if (!user_id && !email) {
          console.error('No user identification found in webhook data');
          return NextResponse.json(
            { error: 'No user identification found' },
            { status: 400 }
          );
        }

        // Find user by email (which is the user_id we sent)
        const user = await prisma.user.findUnique({
          where: { email: user_id }
        });

        if (!user) {
          console.error('User not found for email:', user_id);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        const isSuccessful = body.data.attributes.status === 'paid';
        
        if (isSuccessful) {
          // Get the variant ID to determine the package
          const variantId = body.data.attributes.first_order_item.variant_id.toString();
          let additionalReports = 0;

          // Match variant ID with environment variables
          if (variantId === process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LITE_PLAN_VARIANT_ID) {
            additionalReports = 10;
          } else if (variantId === process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_PLAN_VARIANT_ID) {
            additionalReports = 25;
          }

          console.log('Processing purchase:', {
            userId: user.id,
            email: user.email,
            variantId,
            additionalReports
          });

          // Update user settings with new reports
          const result = await prisma.userSettings.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              reportCount: 0,
              monthlyReportCount: 0,
              monthlyReportLimit: 20,
              additionalReportsPurchased: additionalReports,
              totalAvailableReports: 20 + additionalReports
            },
            update: {
              additionalReportsPurchased: {
                increment: additionalReports
              },
              totalAvailableReports: {
                increment: additionalReports
              }
            }
          });

          console.log('Updated user settings:', result);
        }
        break;
      }

      case 'subscription_created':
        // Handle subscription creation
        console.log('New subscription created:', body.data.attributes);
        break;

      case 'subscription_updated':
        // Handle subscription updates
        console.log('Subscription updated:', body.data.attributes);
        break;

      // Add more cases as needed
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}