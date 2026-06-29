export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    
    const email = formData.get("email");
    const description = formData.get("description");

    // TELEGRAM CONFIGURATION
    // Replace the placeholders inside the quotes with your actual keys from Phase 1 & 2
    const BOT_TOKEN = "8885205059:AAGGKTPh5rvkkQah5YwVG5f_KyNdf9Tdvm0";
    const CHAT_ID = "8366864019";

    // Format the alert text beautifully for your Telegram screen
    const telegramMessage = `🚨 NEW SERVICE REQUEST 🚨\n\n📧 Client Email: ${email}\n\n📝 Problem Description:\n${description}`;

    // Send the text message data directly to Telegram's API
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
      }),
    });

    // What the client sees on your website after clicking submit
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
      headers: { "Content-Type": "text/html" },
    });

  } catch (err) {
    return new Response("Error processing form submission: " + err.message, { status: 500 });
  }
}
