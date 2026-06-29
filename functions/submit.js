export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    
    const email = formData.get("email");
    const description = formData.get("description");
    const photoFile = formData.get("photo"); // Grabs the uploaded photo file

    let photoTextLine = "No photo attached.";

    // If the user actually uploaded an image file, process it safely
    if (photoFile && photoFile.size > 0 && photoFile.name) {
      // Create a clean, un-executable filename based on timestamp and client email
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeFilename = `${timestamp}-${email.replace(/[^a-zA-Z0-9]/g, '_')}-${photoFile.name}`;

      // Securely stream the binary file data straight into your Cloudflare R2 Cloud Bucket
      await context.env.UPLOADS_BUCKET.put(safeFilename, photoFile.stream(), {
        httpMetadata: { contentType: photoFile.type }
      });

      // Update the message text that will display on your Telegram app alert
      photoTextLine = `📸 Photo Saved: See Cloudflare R2 dashboard under filename:\n${safeFilename}`;
    }

    // Pull credentials from your hidden dashboard memory
    const BOT_TOKEN = context.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = context.env.TELEGRAM_CHAT_ID;

    // Send the structured ticket log straight to your phone alert via Telegram
    const telegramMessage = `🚨 NEW SERVICE REQUEST 🚨\n\n📧 Client Email: ${email}\n\n📝 Problem Description:\n${description}\n\n${photoTextLine}`;
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
      }),
    });

    // Clean, encoded confirmation screen with a beautiful green checkmark
    return new Response(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #22c55e;">✔ Request Sent Successfully!</h2>
            <p>Thank you for choosing repair. We have received your problem description and will review it immediately.</p>
            <p style="color: #666; font-size: 14px;">We will contact you shortly at <strong>${email}</strong>.</p>
            <br>
            <a href="/" style="display: inline-block; background: #0076ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Return to Home</a>
          </div>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });

  } catch (err) {
    return new Response("Error processing form submission: " + err.message, { status: 500 });
  }
}
