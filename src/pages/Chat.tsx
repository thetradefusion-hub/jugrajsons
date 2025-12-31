import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Phone, Video, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface ChatMessage {
  _id: string;
  message: string;
  sender: 'user' | 'expert';
  createdAt: string;
  user?: { name: string; email: string };
  expert?: { name: string; image: string };
}

interface Expert {
  _id: string;
  name: string;
  image: string;
  specialization: string;
  available: boolean;
}

const Chat = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatUserId, setChatUserId] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if this is admin/expert view (has userId in query params)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    
    if (userId && user && (user.role === 'admin' || user._id === expertId)) {
      setChatUserId(userId);
      setIsAdminView(true);
    } else {
      setChatUserId(null);
      setIsAdminView(false);
    }

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to chat with experts',
        variant: 'destructive',
      });
      navigate('/login?redirect=/chat/' + expertId);
      return;
    }

    if (expertId) {
      fetchExpert();
    }
  }, [expertId, user]);

  useEffect(() => {
    if (expertId && user) {
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [expertId, user, isAdminView, chatUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchExpert = async () => {
    try {
      const response = await api.get(`/experts/${expertId}`);
      setExpert(response.data);
    } catch (error) {
      console.error('Error fetching expert:', error);
      navigate('/expert');
    }
  };

  const fetchMessages = async () => {
    if (!expertId || !user) return;
    
    try {
      let response;
      if (isAdminView && chatUserId) {
        // Admin/Expert view - fetch messages for specific user
        response = await api.get(`/chat/expert/${expertId}/user/${chatUserId}`);
      } else {
        // User view - fetch their own messages
        response = await api.get(`/chat/${expertId}`);
      }
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      let response;
      if (isAdminView && chatUserId) {
        // Admin/Expert sending reply
        response = await api.post('/chat/expert/reply', {
          userId: chatUserId,
          expertId,
          message: messageText,
        });
      } else {
        // User sending message
        response = await api.post('/chat/send', {
          expertId,
          message: messageText,
        });
      }

      setMessages([...messages, response.data]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send message',
        variant: 'destructive',
      });
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="Chat with Expert" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading chat...</div>
        </div>
      </>
    );
  }

  if (!expert) {
    return (
      <>
        <SEO title="Expert Not Found" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Expert Not Found</h1>
            <Button asChild>
              <Link to="/expert">Back to Experts</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={`Chat with ${expert.name}`} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white px-4 py-4 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/expert')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img
              src={expert.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"}
              alt={expert.name}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
              }}
            />
            <div className="flex-1">
              <h2 className="font-bold">{expert.name}</h2>
              <p className="text-xs opacity-90">{expert.specialization}</p>
            </div>
            <div className="flex items-center gap-2">
              {expert.available && (
                <Badge variant="secondary" className="bg-green-500 text-white">
                  Online
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isUser = message.sender === 'user';
              const showAvatar = index === 0 || messages[index - 1].sender !== message.sender;
              
              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  {showAvatar && !isUser && (
                    <img
                      src={expert.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"}
                      alt={expert.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
                      }}
                    />
                  )}
                  {showAvatar && isUser && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                      {isAdminView && message.user?.name 
                        ? message.user.name.charAt(0).toUpperCase()
                        : user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {!showAvatar && <div className="w-8" />}
                  <div className={`flex-1 max-w-[70%] ${isUser ? 'text-right' : ''}`}>
                    <Card className={`inline-block ${isUser ? 'bg-emerald-600 text-white' : 'bg-white'}`}>
                      <CardContent className="p-3">
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        <p className={`text-xs mt-1 ${isUser ? 'text-emerald-100' : 'text-muted-foreground'}`}>
                          {format(new Date(message.createdAt), 'HH:mm')}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t bg-white px-4 py-4 sticky bottom-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sending}
            />
            <Button
              type="submit"
              size="default"
              disabled={!newMessage.trim() || sending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;

