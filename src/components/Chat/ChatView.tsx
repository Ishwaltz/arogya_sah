import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Loader, BrainCircuit } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { askAI, sendEmergencyAlert } from '../../utils/aiService';
import { format } from 'date-fns';

// Utility to clean AI response from markdown
const cleanAIResponse = (text: string): string => {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
};

export function ChatView() {
  const { state, dispatch } = useApp();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory, isLoading]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !state.user) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    setError(null);

    // Optimistically add user message to state
    const tempUserMessageId = `temp_${Date.now()}`;
    const userChatPayload = {
      id: tempUserMessageId,
      userId: state.user.id,
      message: userMessage,
      response: '', // Placeholder
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userChatPayload });

    try {
      const userContext = {
        currentTracks: state.tracks.filter(t => t.isActive && t.patientId === state.user?.id).map(t => t.condition),
        recentCheckIns: state.dailyCheckIns.filter(c => c.userId === state.user?.id).slice(-3),
        age: state.user.age,
      };

      const aiResponse = await askAI(userMessage, userContext);

      const aiChatPayload = {
        ...userChatPayload,
        response: aiResponse.message,
        isRedFlag: aiResponse.isRedFlag,
      };
      
      // Replace temp message with final one
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiChatPayload });

      if (aiResponse.isRedFlag && state.user.emergencyContact) {
        await sendEmergencyAlert(state.user.emergencyContact, state.user.emergencyContactName || 'Emergency Contact', state.user.name, aiResponse.redFlags);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const userChats = state.chatHistory.filter(chat => chat.userId === state.user?.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-[calc(100vh-180px)] flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700"><div className="flex items-center space-x-3"><div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg"><BrainCircuit className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div><div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Health Assistant</h1><p className="text-gray-600 dark:text-gray-300">Ask me anything about your health and medications</p></div></div></div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {userChats.length === 0 && !isLoading ? (
          <div className="text-center py-12 flex flex-col items-center"><Bot className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to your AI Health Assistant</h3><p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">I'm here to help you with health-related questions and medication guidance.</p><div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"><p>• Ask about your medications and side effects</p><p>• Get general health advice</p><p>• Understand your symptoms</p></div></div>
        ) : (
          userChats.map(chat => (
            <React.Fragment key={chat.id}>
              <div className="flex justify-end items-start gap-3"><div className="bg-brand-dark text-white p-3 rounded-2xl rounded-br-none max-w-lg"><p className="text-sm">{chat.message}</p></div><div className="w-10 h-10 bg-brand-dark rounded-full flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-white" /></div></div>
              {chat.response && (
                <div className="flex justify-start items-start gap-3"><div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" /></div><div className={`p-4 rounded-2xl rounded-bl-none max-w-lg ${chat.isRedFlag ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-gray-100 dark:bg-gray-700'}`}>{chat.isRedFlag && (<div className="flex items-center space-x-2 mb-2 pb-2 border-b border-red-200 dark:border-red-700"><AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" /><span className="text-sm text-red-700 dark:text-red-300 font-semibold">Health Alert</span></div>)}<p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{cleanAIResponse(chat.response)}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{format(new Date(chat.timestamp), 'p')}</p></div></div>
              )}
            </React.Fragment>
          ))
        )}
        {isLoading && (<div className="flex justify-start items-start gap-3"><div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" /></div><div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl rounded-bl-none"><div className="flex items-center space-x-2"><Loader className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-300" /><span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span></div></div></div>)}
        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask a question..." className="w-full pl-4 pr-16 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-medium focus:border-transparent resize-none" rows={1} disabled={isLoading} />
          <button onClick={handleSendMessage} disabled={!message.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-dark text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><Send className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">⚠️ This AI assistant provides general information only. Always consult healthcare professionals for medical advice.</p>
      </div>
    </div>
  );
}
