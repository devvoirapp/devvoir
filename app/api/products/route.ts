import {NextResponse} from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'LemonSqueezy API key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.lemonsqueezy.com/v1/products', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();

    console.log({products: products.data})

    return NextResponse.json(products.data);

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products from LemonSqueezy' },
      { status: 500 }
    );
  }
}
