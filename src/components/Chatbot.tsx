// src/components/Chatbot.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Bot } from 'lucide-react'; // ✅ Importem la icona Bot
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ✅ CORRECCIÓ: Definim el tipus per als missatges
interface Message {
  type: 'user' | 'bot';
  content: string;
}

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // ✅ CORRECCIÓ: Apliquem el tipus a l'estat dels missatges
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  // ✅ CORRECCIÓ: Tipem correctament la referència al DOM
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ type: 'bot', content: t('chatbot.greeting') }]);
    }
  }, [isOpen, t, messages.length]);
  
  const getBotResponse = (userInput: string): string => {
    // ... (la teva lògica de getBotResponse es queda igual)
    return "Resposta del bot..."; // Placeholder
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { type: 'user', content: inputValue };
    const botResponseContent = getBotResponse(inputValue);
    const botMessage: Message = { type: 'bot', content: botResponseContent };

    setMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
    }, 800);

    setInputValue('');
  };

  // ✅ CORRECCIÓ: Afegim el tipus a 'e'
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  return (
    <>
      <motion.div className="fixed bottom-6 right-6 z-50" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }}>
        <Button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg chatbot-bubble flex items-center justify-center" size="icon">
          <AnimatePresence initial={false} mode="wait">
            <motion.div key={isOpen ? 'x' : 'msg'} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-28 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border z-50 flex flex-col"
          >
            <div className="bg-red-600 text-white p-4 rounded-t-2xl flex items-center space-x-3 shadow-md">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <span className="font-semibold">{t('chatbot.assistantName')}</span>
                <p className="text-xs opacity-90">Garatge Estació</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="h-4 w-4 text-gray-600"/></div>}
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${ message.type === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none' }`}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white rounded-b-2xl">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 text-sm focus:ring-red-500"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-red-600 hover:bg-red-700 flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;