import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Loader } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { askAI, sendEmergencyAlert } from '../../utils/aiService';
import { format } from 'date-fns';

// Utility to clean AI response from markdown
const cleanAIResponse = (text: string): string => {
  // Removes **bold**
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
};

export function ChatView() {
  const { state, dispatch } = useApp();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !state.user) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      const userContext = {
        currentTracks: state.tracks.filter(t => t.isActive && t.patientId === state.user?.id).map(t => t.condition),
        recentCheckIns: state.dailyCheckIns.filter(c => c.userId === state.user?.id).slice(-3),
        age: state.user.age,
      };

      const aiResponse = await askAI(userMessage, userContext);

      const chatMessage = {
        id: Date.now().toString(),
        userId: state.user.id,
        message: userMessage,
        response: aiResponse.message,
        timestamp: new Date(),
        isRedFlag: aiResponse.isRedFlag,
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: chatMessage });

      if (aiResponse.isRedFlag && state.user.emergencyContact) {
        await sendEmergencyAlert(state.user.emergencyContact, state.user.emergencyContactName || 'Emergency Contact', state.user.name, aiResponse.redFlags);
      }
    } catch (error) {
      console.error('Chat error:', error);
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-[calc(100vh-200px)] flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700"><div className="flex items-center space-x-3"><div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg"><Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div><div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Health Assistant</h1><p className="text-gray-600 dark:text-gray-300">Ask me anything about your health and medications</p></div></div></div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {userChats.length === 0 ? (
          <div className="text-center py-12"><Bot className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to AI Health Assistant</h3><p className="text-gray-600 dark:text-gray-300 mb-4">I'm here to help you with health-related questions and medication guidance.</p><div className="space-y-2 text-sm text-gray-500 dark:text-gray-400"><p>• Ask about your medications and side effects</p><p>• Get general health advice</p><p>• Understand your symptoms</p></div></div>
        ) : (
          userChats.map(chat => (
            <div key={chat.id} className="space-y-4">
              <div className="flex justify-end"><div className="flex items-start space-x-2 max-w-xs lg:max-w-md"><div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-sm"><p className="text-sm">{chat.message}</p></div><div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-white" /></div></div></div>
              <div className="flex justify-start"><div className="flex items-start space-x-2 max-w-xs lg:max-w-md"><div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" /></div><div className={`p-3 rounded-2xl rounded-tl-sm ${chat.isRedFlag ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-gray-100 dark:bg-gray-700'}`}>{chat.isRedFlag && (<div className="flex items-center space-x-1 mb-2"><AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" /><span className="text-xs text-red-600 dark:text-red-400 font-medium">Health Alert</span></div>)}<p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{cleanAIResponse(chat.response)}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{format(new Date(chat.timestamp), 'HH:mm')}</p></div></div></div>
            </div>
          ))
        )}
        {isLoading && (<div className="flex justify-start"><div className="flex items-start space-x-2"><div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" /></div><div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-tl-sm"><div className="flex items-center space-x-2"><Loader className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span></div></div></div></div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask me about your health, medications, symptoms..." className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows={1} disabled={isLoading} />
          <button onClick={handleSendMessage} disabled={!message.trim() || isLoading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Send className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">⚠️ This AI assistant provides general information only. Always consult healthcare professionals for medical advice.</p>
      </div>
    </div>
  );
}
