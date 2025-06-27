import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!); // Make sure the key is set

export const sendEmail = async (
  email: string,
  subject: string,
  reactTemplate: React.ReactElement
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Code Craft <noreply@one-editor.amitprajapati.co.in>',
      to: [email],
      subject,
      react: reactTemplate,
    });

    if (error) {
      console.error("Email sending error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected email error:", err);
    return { success: false, error: err };
  }
};
