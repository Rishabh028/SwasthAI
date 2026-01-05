import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Send,
  Plus,
  MessageCircle,
  Sparkles,
  Apple,
  Dumbbell,
  Brain,
  Moon,
  Pill,
  Loader2,
  ChevronLeft,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ReactMarkdown from 'react-markdown';
import PageTransition from '@/components/ui/PageTransition';

const topics = [
  { id: 'nutrition', label: 'Nutrition', icon: Apple, color: 'bg-green-100 text-green-600' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-blue-100 text-blue-600' },
  { id: 'mental_health', label: 'Mental Health', icon: Brain, color: 'bg-purple-100 text-purple-600' },
  { id: 'sleep', label: 'Sleep', icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'medication', label: 'Medication', icon: Pill, color: 'bg-rose-100 text-rose-600' },
  { id: 'general', label: 'General', icon: Heart, color: 'bg-teal-100 text-teal-600' },
];

const suggestedQuestions = [
  "What's a healthy breakfast for weight loss?",
  "How can I improve my sleep quality?",
  "What exercises can I do at home?",
  "How to manage stress and anxiety?",
  "What foods boost immunity?",
  "How much water should I drink daily?"
];

export default function HealthCoach() {
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { data: chats = [], isLoading: chatsLoading } = useQuery({
    queryKey: ['healthCoachChats'],
    queryFn: () => base44.entities.HealthCoachChat.list('-created_date', 50),
  });

  const createChat = useMutation({
    mutationFn: (data) => base44.entities.HealthCoachChat.create(data),
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['healthCoachChats'] });
      setSelectedChat(newChat);
    }
  });

  const updateChat = useMutation({
    mutationFn: ({ id, data }) => base44.entities.HealthCoachChat.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthCoachChats'] });
    }
  });

  const deleteChat = useMutation({
    mutationFn: (id) => base44.entities.HealthCoachChat.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthCoachChats'] });
      setSelectedChat(null);
    }
  });

  const sendMessage = useMutation({
    mutationFn: async ({ chatId, userMessage, messages }) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are SwasthAI Health Coach, a friendly and knowledgeable AI health assistant focused on Indian users. You provide personalized health advice on nutrition, fitness, mental wellness, and lifestyle.

Guidelines:
- Be warm, supportive, and encouraging
- Provide practical, actionable advice
- Consider Indian dietary habits and preferences when discussing nutrition
- Always remind users to consult healthcare professionals for medical issues
- Use simple language, avoid medical jargon
- Include specific examples and tips

Previous conversation context:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

User's new message: ${userMessage}

Provide a helpful, conversational response.`,
      });
      return response;
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setIsTyping(true);

    if (!selectedChat) {
      // Create new chat
      const newChat = await createChat.mutateAsync({
        title: userMessage.slice(0, 50),
        topic: 'general',
        messages: [{ role: 'user', content: userMessage, timestamp: new Date().toISOString() }],
        status: 'active'
      });

      const response = await sendMessage.mutateAsync({
        chatId: newChat.id,
        userMessage,
        messages: []
      });

      await updateChat.mutateAsync({
        id: newChat.id,
        data: {
          messages: [
            { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
            { role: 'assistant', content: response, timestamp: new Date().toISOString() }
          ]
        }
      });

      setSelectedChat({
        ...newChat,
        messages: [
          { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
          { role: 'assistant', content: response, timestamp: new Date().toISOString() }
        ]
      });
    } else {
      // Update existing chat
      const updatedMessages = [
        ...(selectedChat.messages || []),
        { role: 'user', content: userMessage, timestamp: new Date().toISOString() }
      ];

      setSelectedChat(prev => ({ ...prev, messages: updatedMessages }));

      const response = await sendMessage.mutateAsync({
        chatId: selectedChat.id,
        userMessage,
        messages: selectedChat.messages || []
      });

      const finalMessages = [
        ...updatedMessages,
        { role: 'assistant', content: response, timestamp: new Date().toISOString() }
      ];

      await updateChat.mutateAsync({
        id: selectedChat.id,
        data: { messages: finalMessages }
      });

      setSelectedChat(prev => ({ ...prev, messages: finalMessages }));
    }

    setIsTyping(false);
  };

  const handleQuestionClick = (question) => {
    setMessage(question);
    inputRef.current?.focus();
  };

  return (
    <PageTransition className="h-screen bg-gray-50 flex">
      {/* Sidebar - Chat History */}
      <div className={`w-80 bg-white border-r border-gray-200 flex flex-col ${
        selectedChat ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Health Coach</h1>
              <p className="text-xs text-gray-500">Your AI wellness companion</p>
            </div>
          </div>
          <Button
            onClick={() => setSelectedChat(null)}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No conversations yet
            </div>
          ) : (
            chats.map((chat) => (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedChat(chat)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  selectedChat?.id === chat.id
                    ? 'bg-rose-50 border border-rose-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className={`w-5 h-5 flex-shrink-0 ${
                    selectedChat?.id === chat.id ? 'text-rose-500' : 'text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {chat.title || 'New Conversation'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {chat.messages?.length || 0} messages
                    </p>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 truncate">
                  {selectedChat.title || 'New Conversation'}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedChat.messages?.length || 0} messages
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => deleteChat.mutate(selectedChat.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {selectedChat.messages?.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl rounded-br-md'
                        : 'bg-white border border-gray-200 rounded-2xl rounded-bl-md'
                    } p-4 shadow-sm`}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown className="prose prose-sm max-w-none text-gray-700">
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask your health coach..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessage.isPending}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/25"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Health Coach
            </h2>
            <p className="text-gray-500 max-w-md mb-8">
              Your personal AI wellness companion. Ask me anything about nutrition, 
              fitness, mental health, sleep, and more!
            </p>

            {/* Topics */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {topics.map((topic) => (
                <Badge
                  key={topic.id}
                  className={`${topic.color} px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => handleQuestionClick(`Tell me about ${topic.label.toLowerCase()}`)}
                >
                  <topic.icon className="w-3 h-3 mr-1" />
                  {topic.label}
                </Badge>
              ))}
            </div>

            {/* Suggested Questions */}
            <div className="w-full max-w-lg">
              <p className="text-sm text-gray-500 mb-3">Try asking:</p>
              <div className="grid gap-2">
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleQuestionClick(question)}
                    className="text-left p-3 bg-white rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors text-sm text-gray-700"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="w-full max-w-lg mt-8">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask your health coach..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessage.isPending}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}