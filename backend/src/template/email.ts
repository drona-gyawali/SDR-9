export const HTML = (senderName: string, p2pUrl: string): string => {
  return `
    <div style="background-color: #f4f7fa; padding: 50px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e1e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

            <div style="padding: 32px 40px 20px 40px;">
                <div style="color: #2563eb; font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">SecureTransfer</div>
                <h1 style="color: #1a202c; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">File transfer request</h1>
            </div>

            <div style="padding: 0 40px 40px 40px;">
                <p style="color: #4a5568; font-size: 16px; line-height: 26px; margin-bottom: 24px;">
                    <strong>${senderName}</strong> is ready to share a file with you via a secure, peer-to-peer connection.
                </p>

                <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #edf2f7; margin-bottom: 30px;">
                    <table role="presentation" width="100%">
                        <tr>
                            <td style="width: 12px;"><div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%;"></div></td>
                            <td style="color: #065f46; font-size: 13px; font-weight: 700; text-transform: uppercase;">Connection: Active Now</td>
                        </tr>
                    </table>
                    <p style="color: #718096; font-size: 13px; margin: 10px 0 0 0; line-height: 18px;">
                        This transfer is <strong>direct</strong>. Please join the connection immediately while the sender is still online to begin the download.
                    </p>
                </div>

                <div style="text-align: left;">
                    <a href="${p2pUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px;">
                        Receive File
                    </a>
                </div>
            </div>

            <div style="padding: 24px 40px; background-color: #fcfcfd; border-top: 1px solid #f1f5f9;">
                <p style="color: #a0aec0; font-size: 12px; margin: 0; line-height: 18px;">
                    SecureTransfer uses end-to-end encryption. Files are never stored on our servers. This link will expire once the sender closes their session.
                </p>
            </div>
        </div>

        <div style="text-align: center; margin-top: 24px;">
            <p style="color: #a0aec0; font-size: 12px;">
                Sent via dorna.com.np
            </p>
        </div>
    </div>
  `;
};
