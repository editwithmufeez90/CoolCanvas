import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(request) {
  try {
    const { orderDetails, email, name } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Simulating email send.");
      console.log("Email content:", orderDetails);
      return Response.json({ success: true, simulated: true });
    }

    const data = await resend.emails.send({
      from: 'Orders <orders@thecoolcanvas.in>', // Update this to a verified domain
      to: ['coolcanvaswear@gmail.com'],
      subject: `New Order Received - ${name}`,
      text: orderDetails,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
