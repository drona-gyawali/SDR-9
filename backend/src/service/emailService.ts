import { transporter } from '../config/conf';
import { conf } from '../config/conf';
import nodemailer from 'nodemailer';
import { SUBJECT, TEXT } from '../utils/constant';
import { HTML } from '../template/email';

export const sendEmail = async (
  SenderName: string,
  link: string,
  receiverMail: string
) => {
  try {
    const info = await transporter.sendMail({
      from: `"No-Reply" ${conf.node_env == 'dev' ? process.env.DEV_MAIL : process.env.PROD_MAIL}`,
      to: receiverMail,
      subject: SUBJECT(SenderName),
      text: TEXT(SenderName, link),
      html: HTML(SenderName, link),
    });
    conf.node_env == 'dev'
      ? console.log(`Test url ethreal: ${nodemailer.getTestMessageUrl(info)}`)
      : console.log(`Email sent: ${info.response}`);
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
