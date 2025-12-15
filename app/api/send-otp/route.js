import Twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE; // your Twilio phone number

const client = new Twilio(accountSid, authToken);

export async function POST(req) {
    const { phone, otp } = await req.json();

    try {
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: fromNumber,
            to: phone,
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
