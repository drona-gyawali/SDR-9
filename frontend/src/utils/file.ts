export const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const generateHumanCode = (roomId: string | null | undefined) => {
    if (!roomId) return null;
    const parts = roomId.split('-');
    return `${parts[0].substring(0, 3).toUpperCase()}-${parts.pop()?.substring(0, 3).toUpperCase()}`;
}
