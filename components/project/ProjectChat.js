import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProjectChat({ projectId }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/projects/${projectId}/messages`);

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.messages);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [projectId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load more messages
  const loadMoreMessages = async () => {
    if (!projectId || isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const oldestMessageId = messages[0]?._id;
      const response = await fetch(`/api/projects/${projectId}/messages?before=${oldestMessageId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch more messages');
      }

      const data = await response.json();
      setMessages(prevMessages => [...data.messages, ...prevMessages]);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/projects/${projectId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, data.data]);
      setNewMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium">Project Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {hasMore && (
          <div className="flex justify-center mb-4">
            <button
              onClick={loadMoreMessages}
              disabled={isLoadingMore}
              className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
            >
              {isLoadingMore ? 'Loading...' : 'Load more messages'}
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender._id === session?.user?.id;

              return (
                <div key={msg._id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-xs md:max-w-md ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-shrink-0">
                      {msg.sender.image ? (
                        <Image
                          src={msg.sender.image}
                          alt={msg.sender.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-800 font-medium">
                            {msg.sender.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={`ml-3 ${isCurrentUser ? 'mr-3 ml-0 text-right' : ''}`}>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{msg.sender.name}</span>
                        <span className="ml-2 text-xs text-gray-500">{formatMessageDate(msg.createdAt)}</span>
                      </div>
                      <div className={`mt-1 p-3 rounded-lg ${isCurrentUser
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-gray-100 text-gray-900'
                        }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t p-4 bg-gray-50">
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newMessage.trim()}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
} 