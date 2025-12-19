export const HTML = (senderName: string, p2pUrl: string): string => {
  return `
    <div style="background-color: #0f172a; padding: 60px 10px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            
            <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 4px;"></div>
            
            <div style="padding: 40px 40px 20px 40px; text-align: center;">
                <div style="display: inline-block; background: #eff6ff; padding: 12px; border-radius: 12px; margin-bottom: 16px;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <h1 style="color: #1e293b; font-size: 22px; font-weight: 800; letter-spacing: -0.025em; margin: 0;">Secure Transfer Ready</h1>
            </div>

            <div style="padding: 0 40px 40px 40px;">
                <p style="color: #475569; font-size: 15px; line-height: 24px; text-align: center;">
                    <span style="color: #1e293b; font-weight: 600;">${senderName}</span> has initiated a private, encrypted P2P tunnel to share a file with you.
                </p>

                <div style="text-align: center; margin: 24px 0;">
                    <span style="background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                        ● System Online
                    </span>
                </div>

                <div style="border: 1px dashed #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 30px; background-color: #f8fafc;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b; font-size: 12px; font-weight: 600;">ENCRYPTION: </span>
                        <span style="color: #1e293b; font-size: 12px; font-weight: 700; font-family: monospace;">AES-256-GCM</span>
                    </div>
                    <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 18px;">
                        <strong>Warning:</strong> Direct connection required. Do not refresh your browser during the transfer.
                    </p>
                </div>

                <div style="text-align: center;">
                    <a href="${p2pUrl}" style="background-color: #2563eb; color: #ffffff; padding: 18px 36px; border-radius: 10px; text-decoration: none; font-weight: 700; display: block; font-size: 16px; transition: all 0.2s; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);">
                        Accept & Start Download
                    </a>
                </div>
            </div>

            <div style="padding: 24px; background-color: #f1f5f9; text-align: center;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                    End-to-End Encrypted • No Cloud Storage • Peer-to-Peer
                </p>
            </div>
        </div>
        
        <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 20px;">
            This is an automated security notification. If you were not expecting this, please ignore.
        </p>
    </div>
    `;
};
