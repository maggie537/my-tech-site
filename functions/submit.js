export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    
    // This grabs the data fields from your future form
    const email = formData.get("email");
    const description = formData.get("description");
    const photo = formData.get("photo"); // Handles the attached file

    // For now, this lets you test if it successfully submits.
    // Cloudflare will capture it and display this on screen.
    return new Response(`Thank you! Request received from ${email}. We will contact you shortly.`, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (err) {
    return new Response("Error processing form submission: " + err.message, { status: 500 });
  }
}
