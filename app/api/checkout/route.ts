import {NextResponse} from 'next/server';

interface CheckoutData {
  variantId: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  product: {
    id: string;
    attributes: {
      name: string;
      price: number;
    };
  };
}

export async function POST(req: Request) {
  try {
    const data: CheckoutData = await req.json();
    const { variantId, user, product } = data;

    console.log("Checkout Data:", data)

    console.log('Creating checkout with variant:', variantId);

    // Lemon Squeezy API endpoint
    const url = 'https://api.lemonsqueezy.com/v1/checkouts';

    // Create checkout session with Lemon Squeezy
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            product_options: {
              name: product.attributes.name,
              description: `Purchase of ${product.attributes.name}`,
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true`,
              receipt_button_text: 'Return to Dashboard'
            },
            checkout_options: {
              button_color: "#7047EB",
              logo: true,
              media: true,
              discount: true,
            },
            checkout_data: {
              custom: {
                user_id: user.id,
                email: user.email,
                name: user.name
              }
            }
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LEMON_SQUEEZY_STORE_ID
              }
            },
            variant: {
              data: {
                type: "variants",
                id: variantId
              }
            }
          }
        }
      })
    });

    const checkoutData = await response.json();
    console.log('Checkout Response:', checkoutData?.errors || checkoutData);

    if (checkoutData.errors) {
      return NextResponse.json(checkoutData, { status: 400 });
    }

    return NextResponse.json(checkoutData);
  } catch (error) {
    console.error('Checkout error:', error.message);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
