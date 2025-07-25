"use client";
import React, { useState, useCallback } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  type: "text" | "image";
}

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! How can I assist you today?",
      type: "text",
    },
    {
      id: 2,
      role: "user",
      content: "Create an image for a garden-themed birthday party invitation",
      type: "text",
    },
    {
      id: 3,
      role: "assistant",
      content:
        'Here\'s the image you requested based on: "Create an image for a garden-themed birthday party invitation".',
      type: "text",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<"text" | "image">("text");

  const suggestedPrompts = [
    "Explain quantum computing",
    "Write a creative story",
    "Help me plan a trip",
    "Create an image of a sunset",
  ];

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      type: mode,
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInputValue("");

    // Simulate AI response after a short delay based on mode
    setTimeout(() => {
      let aiResponse = "";
      
      if (mode === "image") {
        aiResponse = `Imagen generada basada en: "${inputValue}". Aquí tienes tu imagen creada con IA.`;
      } else {
        aiResponse = `Mensaje recibido: "${inputValue}". Te ayudo con tu consulta.`;
      }
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
        type: "text",
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  }, [inputValue, mode]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  }, []);

  const handlePromptClick = useCallback((prompt: string) => {
    setInputValue(prompt);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(prev => prev === "text" ? "image" : "text");
  }, []);

  const MessageComponent = ({ message }: { message: Message }) => {
    if (message.role === "user") {
      return (
        <div className="flex justify-end mb-6">
          <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-xs lg:max-w-md">
            <p className="text-sm">{message.content}</p>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <span className="text-white text-xs font-medium">U</span>
          </div>
        </div>
      );
    }
    return (
      <div className="flex mb-6">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-white text-xs font-bold">GP</span>
        </div>
        <div className="bg-white rounded-2xl px-4 py-3 max-w-xs lg:max-w-md shadow-sm">
          <p className="text-sm text-gray-900">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">GP</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">ChatGPT</h1>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto py-8 px-4">
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto p-4">
          <div className="space-y-4">
            {/* Suggested Prompts */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-300 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Gemini-style Input Bar */}
            <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Main Input Area */}
                <div className="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                    }}
                    placeholder={mode === "text" ? "Pregunta a ChatGPT..." : "Describe la imagen que quieres crear..."}
                    rows={3}
                    className="w-full bg-transparent text-gray-900 placeholder-gray-500 resize-none focus:outline-none text-sm pr-12 border-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-2 top-2 p-2 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>

                {/* Options Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Plus Icon - Disabled */}
                    <button
                      type="button"
                      disabled
                      className="p-2 text-gray-300 cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </button>

                    {/* Video - Disabled */}
                    <button
                      type="button"
                      disabled
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 cursor-not-allowed rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                      </svg>
                      <span className="text-xs">Video</span>
                    </button>

                    {/* Deep Research - Disabled */}
                    <button
                      type="button"
                      disabled
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 cursor-not-allowed rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                      <span className="text-xs">Deep Research</span>
                    </button>

                    {/* Canvas - Disabled */}
                    <button
                      type="button"
                      disabled
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 cursor-not-allowed rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                      <span className="text-xs">Canvas</span>
                    </button>

                    {/* Imagen - Functional */}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className={`flex items-center space-x-2 px-3 py-2 transition-colors rounded-lg ${
                        mode === "image" 
                          ? "bg-blue-100 text-blue-700" 
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                      <span className="text-xs">Imagen</span>
                    </button>
                  </div>

                  {/* Microphone Icon - Disabled */}
                  <button
                    type="button"
                    disabled
                    className="p-2 text-gray-300 cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
