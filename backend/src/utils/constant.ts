export const SUBJECT = (name: string): string => {
  return `Incoming: [${name}] is sending you a file (Stay Online!)`;
};

export const TEXT = (name: string, link: string): string => {
  const text: string = `
    Hi there,
    
    [${name}] wants to send you a file via P2P.
    
    Because this is a direct peer-to-peer transfer, you both need to be online at the same time to start the transfer. 
    
    Click the link below to join the room and receive your file
    
    [${link}]
    
    See you online!
    `;

  return text;
};
