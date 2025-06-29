export type ChatMessage = {
  role: "user" | "agent";
  content: string;
  timestamp: string;
};

export const getCurrentTimestamp = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};