export const SUBJECT = (name: string): string => {
  return `Incoming: [${name}] is sending you a file (Stay Online!)`;
};

export const TEXT = (name: string, link: string): string => {
  return `
SecureTransfer: File Ready for Receipt

${name} has initiated a direct peer-to-peer file transfer with you.

IMPORTANT: Because this is a real-time P2P transfer, both parties must remain online for the duration of the process. If the sender closes their browser before you join, the session will expire.

You can join the secure session and begin the download by clicking the link below:

${link}

Note: For security, files are never stored in the cloud. This link is only active while the sender's session is open.

— The SecureTransfer Team
    `.trim();
};
