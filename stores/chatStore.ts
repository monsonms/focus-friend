import { createStore } from 'zustand/vanilla';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAtMs: number;
};

export type ChatState = {
  isOpen: boolean;
  quietMode: boolean;
  isSending: boolean;
  messages: ChatMessage[];

  toggleOpen: () => void;
  clear: () => void;

  addUserMessage: (content: string, nowMs: number) => void;
  addAssistantMessage: (content: string, nowMs: number) => void;

  // Placeholder MVP hook point; implementation will call OpenAI later.
  sendMessage: (content: string, nowMs: number) => Promise<void>;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createChatStore() {
  return createStore<ChatState>()((set, get) => ({
    isOpen: false,
    quietMode: true,
    isSending: false,
    messages: [],

    toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),

    clear: () => set({ messages: [], isSending: false }),

    addUserMessage: (content, nowMs) => {
      const msg: ChatMessage = {
        id: createId(),
        role: 'user',
        content,
        createdAtMs: nowMs,
      };

      set((s) => ({ messages: [...s.messages, msg] }));
    },

    addAssistantMessage: (content, nowMs) => {
      const msg: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content,
        createdAtMs: nowMs,
      };

      set((s) => ({ messages: [...s.messages, msg] }));
    },

    sendMessage: async (content, nowMs) => {
      if (!content.trim()) return;

      const { addUserMessage, addAssistantMessage } = get();

      set({ isSending: true });
      addUserMessage(content, nowMs);

      // MVP placeholder: no network yet.
      addAssistantMessage("I'm here with you. What's the tiniest next step?", nowMs);
      set({ isSending: false });
    },
  }));
}

export const chatStore = createChatStore();
