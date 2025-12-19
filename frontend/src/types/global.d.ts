
export interface FileTransfer {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'transferring' | 'complete' | 'error';
  errorMessage?: string;
}


export interface ReceivedFile {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: "pending" | "receiving" | "complete" | "error";
  blob: Blob | null;
  errorMessage?: string;
}


export interface EmailData {
  senderName:string,
  link:string | null,
  email:string,

  [key: string] : string
}