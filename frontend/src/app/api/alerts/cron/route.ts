import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

// This endpoint should be triggered by a Cron Job (e.g. Vercel Cron or a scheduler)
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase env vars" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active alerts
    const { data: alerts, error } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('is_active', true)
      .limit(50); // Batch processing

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const results = [];

    for (const alert of alerts) {
      try {
        // Fetch product by name since alerts table stores product_name
        const { data: productData } = await supabase
          .from('products')
          .select('product_id')
          .eq('name', alert.product_name)
          .limit(1)
          .single();

        let currentPrice = null;
        let productUrl = "#";
        let storeName = "Unknown Store";

        if (productData) {
          // Fetch the latest price for this product
          const { data: latestPriceData } = await supabase
            .from('prices')
            .select('price, product_url, store_name')
            .eq('product_id', productData.product_id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

          if (latestPriceData) {
            currentPrice = latestPriceData.price;
            productUrl = latestPriceData.product_url || "#";
            storeName = latestPriceData.store_name || "Unknown Store";
          }
        }

        // Check threshold
        if (currentPrice !== null && currentPrice <= alert.target_price) {
          console.log(`[ALERT_TRIGGERED] Alert triggered for ${alert.product_name}. Current: ${currentPrice}, Target: ${alert.target_price}`);
          
          try {
            const resendResponse = await resend.emails.send({
              from: 'PredictKaro Alerts <onboarding@resend.dev>',
              to: alert.user_email,
              subject: `Price Drop Alert: ${alert.product_name} is now ₹${currentPrice}!`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #10b981;">Target Price Reached!</h2>
                  <p>Great news! The product you are tracking has dropped to or below your target price.</p>
                  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0;"><strong>Product:</strong> ${alert.product_name}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Current Price:</strong> ₹${currentPrice}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Your Target:</strong> ₹${alert.target_price}</p>
                    <p style="margin: 0;"><strong>Store:</strong> ${storeName}</p>
                  </div>
                  <a href="${productUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Buy Now</a>
                </div>
              `
            });
            
            if (resendResponse.error) {
               throw new Error(resendResponse.error.message);
            }
            
            console.log(`[EMAIL_SENT] Successfully sent alert email to ${alert.user_email}`);
            
            await supabase
              .from('price_alerts')
              .update({ is_active: false })
              .eq('alert_id', alert.alert_id);
              
            results.push({ alert_id: alert.alert_id, status: 'SENT', current_price: currentPrice });
          } catch (emailErr) {
            console.error(`[EMAIL_FAILED] Failed to send email to ${alert.user_email}:`, emailErr);
            results.push({ alert_id: alert.alert_id, status: 'ERROR', error: String(emailErr) });
          }
        } else {
          results.push({ alert_id: alert.alert_id, status: 'NO_TRIGGER', current_price: currentPrice });
        }
      } catch (err) {
        console.error("Error processing alert:", err);
        results.push({ alert_id: alert.alert_id, status: 'ERROR', error: String(err) });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
