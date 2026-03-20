import { resend } from '../config/conf';
import { SUBJECT, TEXT } from '../utils/constant';
import { HTML } from '../template/email';

export const sendEmail = async (
  SenderName: string,
  link: string,
  receiverMail: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `"SecureTransfer" <no-reply@mail.dorna.com.np>`,
      to: receiverMail,
      subject: SUBJECT(SenderName),
      text: TEXT(SenderName, link),
      html: HTML(SenderName, link),
    });

    if (error) {
      console.log(`Resend Error: ${error}`);
      return false;
    }

    console.log(`Email sent successfully! ID: ${data?.id}`);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Error Occured while sending mail ${error.message}`);
      return false;
    } else {
      console.log(`Error Occured while sending mail ${String(error)}`);
      return false;
    }
  }
};
