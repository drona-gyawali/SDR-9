import React, { useState, useEffect } from 'react';
import { sendEmail } from '../config/api';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const SendEmail: React.FC<{ link: string }> = ({ link }) => {
  const [senderName, setSenderName] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    try {
      await sendEmail({ senderName, email: receiverEmail, link });
      setStatus('success');
      setSenderName('');
      setReceiverEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900/50 rounded-4xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm transition-colors duration-300">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 border border-transparent dark:border-zinc-700/30">
          <Mail size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-tight">Email Invitation</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium tracking-tight">Notify recipient securely</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {/* Sender Name Input */}
          <input
            required
            type="text"
            className="w-full text-sm px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 transition-all text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium outline-none"
            placeholder="Your name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />

          {/* Receiver Email Input */}
          <input
            required
            type="email"
            className="w-full text-sm px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 transition-all text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium outline-none"
            placeholder="Recipient email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
          />
        </div>

        {/* Dynamic Action Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full group cursor-pointer flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg ${
            status === 'success' 
              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
              : 'bg-zinc-900 dark:bg-indigo-600 text-white shadow-zinc-900/20 dark:shadow-indigo-500/20 hover:bg-zinc-800 dark:hover:bg-indigo-500'
          }`}
        >
          {status === 'loading' ? (
            <Loader2 className="animate-spin" size={18} />
          ) : status === 'success' ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>Invite Sent</span>
            </div>
          ) : (
            <>
              Send Invite
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
        
        {/* Error Feedback */}
        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">
              Delivery failed. Try again?
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default SendEmail;