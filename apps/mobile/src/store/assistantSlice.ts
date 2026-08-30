import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ChatMessage } from '@hospate/types';
import { api } from '../api/client';
import { v4 as uuidv4 } from 'uuid';

interface AssistantState {
  messages: ChatMessage[];
  isThinking: boolean;
  suggestedPrompts: string[];
}

const initialWelcomeMessage: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: `Hi Alex 👋\nI'm your **AI Health Buddy**.\n\nI've reviewed your recent health records including your **CBC, Lipid Panel**, and **Vitamin Panel**.\n\nHow can I help you understand your health today?`,
  timestamp: new Date().toISOString(),
  suggestedQuestions: [
    'Explain my latest report',
    'Why is my Vitamin D low?',
    'What should I discuss with my doctor?',
    'Show my active medications'
  ]
};

const initialState: AssistantState = {
  messages: [initialWelcomeMessage],
  isThinking: false,
  suggestedPrompts: [
    'Explain my latest report',
    'Why is my Vitamin D low?',
    'What should I discuss with my doctor?',
    'Show my active medications'
  ]
};

export const sendMessageAsync = createAsyncThunk(
  'assistant/sendMessage',
  async (text: string, { dispatch }) => {
    // Add user message immediately
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    dispatch(assistantSlice.actions.addMessage(userMsg));

    // Call API assistant engine
    const reply = await api.sendChatMessage(text);
    const assistantMsg: ChatMessage = {
      id: `ast-${Date.now()}`,
      sender: 'assistant',
      text: reply.text,
      sources: reply.sources,
      suggestedQuestions: reply.suggestedQuestions,
      timestamp: new Date().toISOString()
    };
    return assistantMsg;
  }
);

export const assistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [initialWelcomeMessage];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageAsync.pending, (state) => {
        state.isThinking = true;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.isThinking = false;
        state.messages.push(action.payload);
        if (action.payload.suggestedQuestions && action.payload.suggestedQuestions.length > 0) {
          state.suggestedPrompts = action.payload.suggestedQuestions;
        }
      })
      .addCase(sendMessageAsync.rejected, (state) => {
        state.isThinking = false;
        state.messages.push({
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `I'm having trouble connecting right now, but your health data is safely stored on your device. Please try again.`,
          timestamp: new Date().toISOString()
        });
      });
  }
});

export const { addMessage, clearChat } = assistantSlice.actions;
export default assistantSlice.reducer;
