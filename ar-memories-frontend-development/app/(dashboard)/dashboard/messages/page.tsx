'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button-glass';
import { FormField } from '@/components/ui/form-field';
import { Send, Search, Plus } from 'lucide-react';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '👩‍💼',
      lastMessage: 'I love the photos from yesterday!',
      timestamp: '2 min ago',
      unread: true,
    },
    {
      id: '2',
      name: 'Photography Studio',
      avatar: '📸',
      lastMessage: 'Your booking is confirmed',
      timestamp: '1 hour ago',
      unread: false,
    },
    {
      id: '3',
      name: 'John Photographer',
      avatar: '👨‍📷',
      lastMessage: 'Can we schedule a shoot?',
      timestamp: '3 hours ago',
      unread: false,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: selectedConversation.name,
      content: 'Hi! How are you doing?',
      timestamp: '10:30 AM',
      isOwn: false,
    },
    {
      id: '2',
      sender: 'You',
      content: 'Great! Just finished editing the photos',
      timestamp: '10:35 AM',
      isOwn: true,
    },
    {
      id: '3',
      sender: selectedConversation.name,
      content: 'I love the photos from yesterday!',
      timestamp: 'Just now',
      isOwn: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: (messages.length + 1).toString(),
          sender: 'You',
          content: newMessage,
          timestamp: 'now',
          isOwn: true,
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Messages</h1>
          <p className="text-muted-foreground">Connect and collaborate with photographers and studios</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-5 h-5" />
          New Chat
        </Button>
      </div>

      {/* Chat Interface */}
      <div className="glass-effect rounded-xl overflow-hidden flex h-96 md:h-screen border border-border">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-border flex flex-col bg-background">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <FormField placeholder="Search conversations..." />
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 border-b border-border transition-all hover:bg-muted/50 ${
                  selectedConversation.id === conv.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{conv.avatar}</div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-semibold truncate ${conv.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {conv.name}
                      </p>
                      {conv.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{conv.timestamp}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-background/50">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{selectedConversation.avatar}</div>
              <div>
                <h3 className="font-bold">{selectedConversation.name}</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <FormField
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!newMessage.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
