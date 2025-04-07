'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useNotifications } from '../../../components/navigation/Navbar';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUserId = searchParams.get('user');

  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  // Get notification context
  const { markMessagesRead } = useNotifications();

  const messagesEndRef = useRef(null);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  // Memoize helper functions with useCallback to prevent unnecessary re-renders
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const generateMockMessages = useCallback((contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact || !session?.user?.id) return [];

    const mockMessages = [];

    // Generate different conversation patterns based on contact id
    if (contactId === '1') {
      // Ananya - Design discussion
      mockMessages.push(
        { id: '1-1', senderId: '1', text: 'Hey, can we discuss the project design?', timestamp: '2023-04-07T15:30:00Z' },
        { id: '1-2', senderId: session.user.id, text: 'Sure, what aspects do you want to focus on?', timestamp: '2023-04-07T15:32:00Z' },
        { id: '1-3', senderId: '1', text: 'I think we should revisit the user dashboard. The current layout is a bit cluttered.', timestamp: '2023-04-07T15:34:00Z' },
        { id: '1-4', senderId: session.user.id, text: 'I agree. Let\'s simplify it and focus on the most important metrics.', timestamp: '2023-04-07T15:36:00Z' },
        { id: '1-5', senderId: '1', text: 'Great! I\'ll sketch some wireframes tonight and share them tomorrow. Any specific elements you want to highlight?', timestamp: '2023-04-07T15:38:00Z' }
      );
    } else if (contactId === '2') {
      // Aditya - Component completion
      mockMessages.push(
        { id: '2-1', senderId: '2', text: 'I finished the component you asked for', timestamp: '2023-04-06T09:15:00Z' },
        { id: '2-2', senderId: session.user.id, text: 'That was quick! How did the tests come out?', timestamp: '2023-04-06T09:18:00Z' },
        { id: '2-3', senderId: '2', text: 'All passing. I added a few extra test cases for edge conditions too.', timestamp: '2023-04-06T09:20:00Z' },
        { id: '2-4', senderId: session.user.id, text: 'Perfect! Can you push it to the repository so I can review it?', timestamp: '2023-04-06T09:22:00Z' },
        { id: '2-5', senderId: '2', text: 'Already done. The PR is waiting for your review.', timestamp: '2023-04-06T09:25:00Z' },
        { id: '2-6', senderId: session.user.id, text: 'You\'re awesome. I\'ll take a look right away.', timestamp: '2023-04-06T09:27:00Z' }
      );
    } else if (contactId === '3') {
      // Shivam - Meeting scheduling
      mockMessages.push(
        { id: '3-1', senderId: '3', text: 'Are you free for a call tomorrow?', timestamp: '2023-04-05T18:45:00Z' },
        { id: '3-2', senderId: session.user.id, text: 'I should be available after 2pm. What\'s up?', timestamp: '2023-04-05T18:50:00Z' },
        { id: '3-3', senderId: '3', text: 'I want to discuss the authentication flow. I have some concerns about security.', timestamp: '2023-04-05T18:52:00Z' },
        { id: '3-4', senderId: session.user.id, text: 'Sounds important. Let\'s schedule for 2:30pm then?', timestamp: '2023-04-05T18:55:00Z' },
        { id: '3-5', senderId: '3', text: 'Perfect. I\'ll send a calendar invite.', timestamp: '2023-04-05T18:57:00Z' }
      );
    } else if (contactId === '4') {
      // Shreya - Backend API
      mockMessages.push(
        { id: '4-1', senderId: '4', text: 'The backend API is ready for integration', timestamp: '2023-04-04T14:20:00Z' },
        { id: '4-2', senderId: session.user.id, text: 'Great! Is the documentation updated as well?', timestamp: '2023-04-04T14:25:00Z' },
        { id: '4-3', senderId: '4', text: 'Yes, all endpoints are documented with examples in the README.', timestamp: '2023-04-04T14:28:00Z' },
        { id: '4-4', senderId: session.user.id, text: 'Perfect. I\'ll start integrating it with the frontend tomorrow.', timestamp: '2023-04-04T14:30:00Z' },
        { id: '4-5', senderId: '4', text: 'Let me know if you run into any issues.', timestamp: '2023-04-04T14:32:00Z' }
      );
    } else if (contactId === '5') {
      // Himanshu - Thanks
      mockMessages.push(
        { id: '5-1', senderId: '5', text: 'Thanks for your help!', timestamp: '2023-04-03T11:10:00Z' },
        { id: '5-2', senderId: session.user.id, text: 'No problem! Did everything work out?', timestamp: '2023-04-03T11:15:00Z' },
        { id: '5-3', senderId: '5', text: 'Yes, the bug is fixed and the feature is working perfectly now.', timestamp: '2023-04-03T11:18:00Z' },
        { id: '5-4', senderId: session.user.id, text: 'Glad to hear it. Don\'t hesitate to reach out if you need anything else.', timestamp: '2023-04-03T11:20:00Z' },
        { id: '5-5', senderId: '5', text: 'Will do. Have a great day!', timestamp: '2023-04-03T11:22:00Z' }
      );
    }

    return mockMessages;
  }, [contacts, session]);

  // Fetch messages function that uses the memoized helper functions
  const fetchMessages = useCallback(async (contactId) => {
    try {
      // In a real app, fetch from API with the contactId
      // For demo, use mock data based on the contact
      const mockMessages = generateMockMessages(contactId);
      setMessages(mockMessages);

      // Scroll to bottom on new messages loaded
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [generateMockMessages, scrollToBottom]);

  // Modified useEffect to include fetchMessages in the dependency array
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        setIsLoading(true);
        try {
          // Fetch contacts (in a real app, this would be from an API)
          const mockContacts = [
            { id: '1', name: 'Ananya Sharma', image: '/images/avatars/ananya.jpg', lastMessage: 'Great! I\'ll sketch some wireframes tonight and share them tomorrow.', lastMessageTime: '2023-04-07T15:38:00Z', unreadCount: 2 },
            { id: '2', name: 'Aditya Kumar', image: '/images/avatars/aditya.jpg', lastMessage: 'Already done. The PR is waiting for your review.', lastMessageTime: '2023-04-06T09:25:00Z', unreadCount: 0 },
            { id: '3', name: 'Shivam Patel', image: '/images/avatars/shivam.jpg', lastMessage: 'Perfect. I\'ll send a calendar invite.', lastMessageTime: '2023-04-05T18:57:00Z', unreadCount: 1 },
            { id: '4', name: 'Shreya Desai', image: '/images/avatars/shreya.jpg', lastMessage: 'Let me know if you run into any issues.', lastMessageTime: '2023-04-04T14:32:00Z', unreadCount: 0 },
            { id: '5', name: 'Himanshu Verma', image: '/images/avatars/himanshu.jpg', lastMessage: 'Will do. Have a great day!', lastMessageTime: '2023-04-03T11:22:00Z', unreadCount: 0 }
          ];

          setContacts(mockContacts);

          // Set selected contact from URL or default to first contact
          if (searchParams.has('user')) {
            const userId = searchParams.get('user');
            const contact = mockContacts.find(c => c.id === userId);
            if (contact) {
              setSelectedContact(contact);
              await fetchMessages(contact.id);
            }
          } else if (mockContacts.length > 0) {
            setSelectedContact(mockContacts[0]);
            await fetchMessages(mockContacts[0].id);
          }

          setIsLoading(false);
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, session, searchParams, fetchMessages, markMessagesRead]);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact.id);

    // Update URL without refreshing the page
    router.push(`/messages?user=${contact.id}`, { scroll: false });

    // If contact has unread messages, mark them as read
    if (contact.unreadCount > 0) {
      // Update contact in the contacts list
      setContacts(prevContacts =>
        prevContacts.map(c =>
          c.id === contact.id
            ? { ...c, unreadCount: 0 }
            : c
        )
      );

      // In a real app, call API to mark messages from this contact as read
      // const response = await fetch(`/api/contacts/${contact.id}/messages/mark-read`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });

      // Check if there are any remaining unread messages
      const remainingUnread = contacts
        .filter(c => c.id !== contact.id)
        .reduce((total, contact) => total + contact.unreadCount, 0);

      // If there are no more unread messages, update the global counter
      if (remainingUnread === 0) {
        markMessagesRead();
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    // Create new message
    const message = {
      id: `new-${Date.now()}`,
      senderId: session.user.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Add to messages
    setMessages(prevMessages => [...prevMessages, message]);

    // Clear input
    setNewMessage('');

    // Update last message in contacts
    setContacts(prevContacts =>
      prevContacts.map(c =>
        c.id === selectedContact.id
          ? {
            ...c,
            lastMessage: newMessage.trim(),
            lastMessageTime: new Date().toISOString()
          }
          : c
      )
    );

    // Scroll to bottom
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    // In a real app, you would send the message to the API
    // and handle real-time updates with WebSockets
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Messages</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Communication with your project members and collaborators</p>
        </div>

        <div className="flex h-[calc(80vh-200px)] min-h-[500px]">
          {/* Contacts Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No contacts found
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {contacts.map((contact) => (
                  <li
                    key={contact.id}
                    className={`
                      px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
                      ${selectedContact?.id === contact.id ? 'bg-gray-100 dark:bg-gray-700' : ''}
                    `}
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        {contact.image ? (
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={contact.image}
                            alt={contact.name}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="font-medium text-indigo-800">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {contact.lastMessage}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(contact.lastMessageTime)}
                        </p>
                        {contact.unreadCount > 0 && (
                          <span className="mt-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Message Area */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                {/* Selected Contact Header */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="relative mr-3">
                    {selectedContact.image ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={selectedContact.image}
                        alt={selectedContact.name}
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="font-medium text-indigo-800 text-sm">
                          {selectedContact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedContact.name}
                    </h3>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">No messages yet</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Send a message to start the conversation
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => {
                        const isOwnMessage = message.senderId === session.user.id;
                        const showDate = index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);

                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                                  {formatDate(message.timestamp)}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}>
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-right text-xs mt-1 ${isOwnMessage
                                  ? 'text-indigo-200'
                                  : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Messages</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  Select a conversation from the sidebar to view and send messages to your project collaborators.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 