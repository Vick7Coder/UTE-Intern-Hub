import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { StyledButton } from '.'

const ChatForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Hi, how can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    const element = messagesEndRef.current;
    if (element) {
      element.scrollIntoView({ block: "end", behavior: "auto" });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const toggleChat = (event) => {
    if (event && event.target === event.currentTarget) {
      setIsOpen(false);
    } else if (!event) {
      setIsOpen(!isOpen);
    }
  };

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
        {
          contents: [{ role: "user", parts: [{ text: inputMessage }] }]
        },
        {
          params: { key: 'AIzaSyDfAWYMsP9Ik9euvw_vee7IQ0D4WzuhmnU' },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const aiMessage = {
        role: 'model',
        content: response.data.candidates[0].content.parts[0].text
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage]);

  return (
    <>
      <button
        onClick={() => toggleChat()}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out m-0 cursor-pointer border-none p-0 normal-case leading-5"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-white block align-middle">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[55]"
            onClick={toggleChat}
          ></div>
          <div
            style={{ boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
            className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white rounded-lg border border-[#e5e7eb] w-[440px] h-[634px] z-[60] flex flex-col"
          >
            {/* Heading */}
            <div className="flex flex-col space-y-1.5 p-6">
              <h2 className="font-semibold text-lg tracking-tight">UTE-Intern-Hub Chat Support</h2>
              <p className="text-sm text-[#6b7280] leading-3">Powered by Google AI Studio</p>
            </div>

            {/* Chat Container */}
            <div
              className="flex-1 overflow-y-auto px-6"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#888 #f1f1f1',
                height: 'calc(100% - 140px)'
              }}
            >
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 my-4 text-gray-600 text-sm ${message.role === 'user' ? 'justify-end' : ''}`}>
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-gray-100 border p-1">
                      {message.role === 'user' ? (
                        <svg stroke="none" fill="black" strokeWidth="0" viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                        </svg>
                      ) : (
                        <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                        </svg>
                      )}
                    </div>
                  </span>
                  <p className="leading-relaxed">
                    <span className="block font-bold text-gray-700">{message.role === 'user' ? 'You' : 'AI'} </span>
                    {message.content}
                  </p>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <div className="p-6">
              <form onSubmit={sendMessage} className="flex items-center justify-center w-full space-x-2">
                <input
                  className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                  placeholder="Type your message"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                />
                <StyledButton
                  onClick={sendMessage}
                  title='Send'
                  containerStyles="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
                  disabled={isLoading}
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatForm;