import React, { useState } from 'react';
import { DEMO_ASSISTANT_REPLIES, MockChatMessage } from '../data/campusData';

interface AssistantViewProps {
  onNavigateToLocation: (locationId: string) => void;
  onViewEvent: (eventId: string) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  onNavigateToLocation,
  onViewEvent,
}) => {
  const [messages, setMessages] = useState<MockChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello Aryan! I'm CampusPilot AI, your intelligent campus companion. Ask me where any department, computing lab, or faculty cabin is, or explore today's events at OSEN Noida.",
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const suggestedQuestions = [
    'Where is Turing Lab 4?',
    'What events are happening today?',
    'Where is the Central Library?',
    'How do I reach Dr. S. Rao cabin?',
    'Where can I get lunch?',
    'Where is the Exam Cell?',
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: MockChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate smart local assistant reply without external API calls
    setTimeout(() => {
      const lower = promptText.toLowerCase();
      let matchedKey = Object.keys(DEMO_ASSISTANT_REPLIES).find((k) => lower.includes(k));

      let replyData = matchedKey ? DEMO_ASSISTANT_REPLIES[matchedKey] : null;

      if (!replyData) {
        if (lower.includes('where') || lower.includes('location') || lower.includes('find')) {
          replyData = {
            text: `I found matching locations on the campus pedestrian grid. You can explore the full interactive directory under Departments or select Turing Lab 4 and Kalam Tech Block on the map.`,
            action: { type: 'navigate', targetId: 'turing-center', label: 'Explore on Campus Map' },
          };
        } else {
          replyData = {
            text: `I've noted your campus query: "${promptText}". For today's Dev Days showcase, check Audi-3 at Kalam Tech Block for ongoing developer keynotes and hands-on tracks!`,
            action: { type: 'view_event', targetId: 'event-copilot', label: 'View Copilot Dev Days' },
          };
        }
      }

      const assistantMsg: MockChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyData.text,
        timestamp: 'Just now',
        actionSuggestion: replyData.action,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: { type: 'navigate' | 'view_event' | 'view_location'; targetId: string }) => {
    if (action.type === 'navigate' || action.type === 'view_location') {
      onNavigateToLocation(action.targetId);
    } else if (action.type === 'view_event') {
      onViewEvent(action.targetId);
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-180px)] min-h-[500px] select-none pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#171f33]/80 backdrop-blur-xl p-3.5 border border-white/[0.06] shadow-md mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4d8eff] to-[#571bc1] p-[1px] flex items-center justify-center shadow-[0_0_12px_rgba(77,142,255,0.3)]">
            <div className="w-full h-full bg-[#060e20] rounded-[11px] flex items-center justify-center text-[#adc6ff]">
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#dae2fd]">CampusPilot AI Assistant</span>
            <span className="text-[10px] font-mono text-[#4cd7f6]">
              Interactive Local Assistant Preview • OSEN Noida Edition
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#060e20] text-[#adc6ff] border border-white/[0.04]">
          Local Mode
        </span>
      </div>

      {/* Suggested Question Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(q)}
            className="px-3 py-1 rounded-full bg-[#131b2e] hover:bg-[#222a3d] border border-white/[0.06] text-[#c2c6d6] hover:text-[#dae2fd] text-[11px] font-mono whitespace-nowrap active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-3 rounded-3xl bg-[#060e20]/60 border border-white/[0.04] shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                isUser ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-[#4d8eff] to-[#3b82f6] text-[#ffffff] rounded-br-sm shadow-md'
                    : 'bg-[#171f33]/90 text-[#dae2fd] rounded-bl-sm border border-white/[0.06] shadow-md backdrop-blur-md'
                }`}
              >
                {msg.text}

                {/* Optional Action Suggestion Pill */}
                {msg.actionSuggestion && (
                  <div className="mt-2.5 pt-2 border-t border-white/[0.08]">
                    <button
                      onClick={() => handleActionClick(msg.actionSuggestion!)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] text-[#00285d] font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {msg.actionSuggestion.type === 'navigate' ? 'navigation' : 'visibility'}
                      </span>
                      <span>{msg.actionSuggestion.label}</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono text-[#8c909f] mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="self-start flex items-center gap-1.5 p-3 rounded-2xl bg-[#171f33] border border-white/[0.06] text-[#4cd7f6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-mono text-[#c2c6d6] ml-1">Analyzing campus map...</span>
          </div>
        )}
      </div>

      {/* Message Composer Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(inputValue);
        }}
        className="mt-3 flex items-center gap-2 p-1.5 rounded-2xl bg-[#171f33] border border-white/[0.08] shadow-xl"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask where a lab, hall, faculty cabin, or fest is..."
          className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#dae2fd] placeholder:text-[#8c909f] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4d8eff] to-[#4cd7f6] disabled:opacity-40 text-[#00285d] flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>

      <div className="text-center mt-2">
        <span className="text-[10px] font-mono text-[#8c909f]">
          CampusPilot Local Assistant • Ready for Gemini API hook during live workshop session.
        </span>
      </div>
    </div>
  );
};
