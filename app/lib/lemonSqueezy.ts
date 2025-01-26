import { Customer, type NewCustomer, createCustomer, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

interface LemonSqueezyCustomer {
  id: string;
  type: string;
  attributes: {
    name: string;
    email: string;
    status: string;
    city?: string;
    region?: string;
    country?: string;
  }
}

interface LemonSqueezyResponse {
  data: LemonSqueezyCustomer[];
}

// interface CheckoutOptions {
//   customerId: string;
//   email: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   status: string;
//   slug: string;
//   buyNow: string;
//   variantId?: string;
// }

lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY,
  onError: (error) => {
    console.error('Lemon Squeezy error:', error);
  }
});

export async function createLemonSqueezyCustomer(email: string, name: string): Promise<LemonSqueezyCustomer | Customer> {
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

  if (!storeId) {
    throw new Error('Missing required store ID');
  }

  try {
    // First, try to find if customer already exists
    const response = await fetch(`https://api.lemonsqueezy.com/v1/customers?filter[email]=${encodeURIComponent(email)}`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }

    const existingCustomers: LemonSqueezyResponse = await response.json();
    
    // If customer exists, return the first one
    if (existingCustomers.data && existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // If customer doesn't exist, create new one
    const customerToCreate: NewCustomer = {
      name,
      email,
    };

    const createdCustomer = await createCustomer(storeId, customerToCreate);

    if (!createdCustomer || !createdCustomer.data) {
      throw new Error('Failed to create Lemon Squeezy customer');
    }

    return createdCustomer.data;
  } catch (error) {
    console.error('Error in Lemon Squeezy customer operation:', error);
    throw error; 
  }
}

// export async function createFreeSubscription(customer: Customer): Promise<string> {
//   const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
//   const variantId = process.env.LEMON_SQUEEZY_FREE_PLAN_VARIANT_ID;
  
//   if (!storeId || !variantId) {
//     throw new Error('Missing required environment variables for subscription');
//   }

//   try {
//     const checkout = await createCheckout({
//       storeId,
//       variantId: parseInt(variantId),
//       checkoutOptions: {
//         buttonColor: "#480048",
//         subscriptionPreview: true,
//         media: true
//       },
//       checkoutData: {
//         email: customer.email,
//         name: customer.name,
//         custom: {
//           user_id: customer.id
//         }
//       },
//       productOptions: {
//         enabledVariants: [parseInt(variantId)]
//       },
//       customPrice: 0
//     });

//     console.log('Checkout success response:', JSON.stringify(checkout, null, 2));
//     return checkout.data.attributes.url;
//   } catch (error) {
//     console.error('Error creating checkout:', error);
//     throw error;
//   }
// }

// export async function createCheckout(customer: Customer, product: Product): Promise<string> {
//   const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;

//   const liteProduct = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LITE_PLAN_VARIANT_ID;
//   const proProduct = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_PLAN_VARIANT_ID;

//   if (!storeId || !liteProduct || !proProduct) {
//     console.log({liteProduct, proProduct, storeId})
//     throw new Error('Missing required store ID or variant ID');
//   }

//   const payload = {
//     data: {
//       type: "checkouts",
//       attributes: {
//         checkout_data: {
//           email: customer.email,
//           name: customer.name,
//           custom: {
//             user_id: customer.id
//           }
//         },
//         checkout_options: {
//           button_color: "#480048",
//           media: true
//         },
//         product_options: {
//           enabled_variants: [parseInt(product.name === 'Lite' ? liteProduct : proProduct)]
//         }
//       },
//       relationships: {
//         store: {
//           data: {
//             type: "stores",
//             id: storeId
//           }
//         },
//         variant: {
//           data: {
//             type: "variants",
//             id: product.name === 'Lite' ? liteProduct : proProduct
//           }
//         }
//       }
//     }
//   };

//   console.log('Creating checkout:', JSON.stringify(payload, null, 2));

//   try {
//     const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/vnd.api+json',
//         'Content-Type': 'application/vnd.api+json',
//         'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY}`
//       },
//       body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//       const responseText = await response.text();
//       console.error('Checkout error response:', responseText);
//       throw new Error(`Failed to create checkout: ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log('Checkout created:', data);
//     return data.data.attributes.url;
//   } catch (error) {
//     console.error('Error creating checkout:', error);
//     throw error;
//   }
// }

// export async function getCustomerByEmail(email: string): Promise<Customer | null> {
//   try {
//     const response = await fetch(`https://api.lemonsqueezy.com/v1/customers?filter[email]=${encodeURIComponent(email)}`, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/vnd.api+json',
//         'Content-Type': 'application/vnd.api+json',
//         'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
//       }
//     });

//     if (!response.ok) {
//       const responseText = await response.text();
//       throw new Error(`Failed to get customer: ${response.statusText}\nResponse: ${responseText}`);
//     }

//     const data = await response.json();
//     if (data.data && data.data.length > 0) {
//       const customer = data.data[0];
//       return {
//         id: customer.id,
//         email: customer.attributes.email,
//         name: customer.attributes.name
//       };
//     }
//     return null;
//   } catch (error) {
//     console.error('Error getting customer:', error);
//     throw error;
//   }
// }

// export async function getProducts() {
//   console.log('Fetching products...')

//   const apiKey = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY;
//   console.log('API Key:', apiKey ? 'Present' : 'Missing');

//   if (!apiKey) {
//     console.error('Missing Lemon Squeezy API key. Ensure NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY is set.');
//     throw new Error('Missing Lemon Squeezy API key');
//   }

//   try {
//     // Fetch products with variants included
//     const response = await fetch('https://api.lemonsqueezy.com/v1/products?include=variants', {
//       headers: {
//         'Accept': 'application/vnd.api+json',
//         'Content-Type': 'application/vnd.api+json',
//         'Authorization': `Bearer ${apiKey}`
//       }
//     });

//     console.log('Response status:', response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Failed to fetch products:', response.status, errorText);
//       throw new Error(`Failed to fetch products: ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log('Raw product data:', JSON.stringify(data, null, 2));

//     return data.data.map((product) => {
//       // Find the variant for this product
//       const variant = data.included?.find(
//         (item) => 
//           item.type === 'variants' && 
//           item.relationships?.product?.data?.id === product.id
//       );

//       return {
//         id: product.id,
//         name: product.attributes.name,
//         description: product.attributes.description,
//         price: product.attributes.price_formatted,
//         status: product.attributes.status,
//         slug: product.attributes.slug,
//         buyNow: product.attributes.buy_now_url,
//         variantId: variant?.id
//       };
//     });
//   } catch (error) {
//     console.error('Error in getProducts:', error);
//     throw error;
//   }
// }

// export async function updateUserGenerations(additionalGenerations: number): Promise<number> {
//   try {
//     const response = await fetch('/api/user/settings', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ additionalGenerations })
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to update generations: ${errorText}`);
//     }

//     const data = await response.json();
//     console.log(`Successfully added ${additionalGenerations} generations`);
//     return data.availableGenerations;
//   } catch (error) {
//     console.error('Error updating user generations:', error);
//     throw error;
//   }
// }

// export async function handlePaymentSuccess(productSlug: string): Promise<void> {
//   let additionalGenerations = 0;

//   // Determine additional generations based on product
//   switch (productSlug) {
//     case '10-credits':
//       additionalGenerations = 10;
//       break;
//     case '30-credits':
//       additionalGenerations = 30;
//       break;
//     default:
//       console.warn(`Unrecognized product slug: ${productSlug}`);
//       return;
//   }

//   try {
//     await updateUserGenerations(additionalGenerations);
//   } catch (error) {
//     console.error('Payment success handling failed:', error);
//     // Optionally, you might want to log this to a monitoring service
//   }
// }
