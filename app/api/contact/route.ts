import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ضع الـ base64 الخاص بالصورة هنا
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgo..."; // ← استبدل بالـ base64 بتاعك

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from:    "Walid Makram Gallery <onboarding@resend.dev>",
      to:      process.env.CONTACT_TO!,
      replyTo: email,
      subject: subject || `رسالة جديدة من ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;
                    padding:32px;border:1px solid #e5e5e5;border-radius:8px">
          <img src="https://wnlfimqifwcjmyrajnaq.supabase.co/storage/v1/object/public/gallery-images/mail.png"
               alt="Walid Makram Gallery"
               style="width:160px;height:auto;display:block;margin-bottom:20px" />
          <h2 style="color:#b8955a;letter-spacing:4px;font-weight:300;
                     text-transform:uppercase">Walid Makram Gallery</h2>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0"/>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>الإيميل:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>الموضوع:</strong> ${subject || "—"}</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0"/>
          <p style="white-space:pre-wrap;line-height:1.8">${message}</p>
        </div>
      `,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}