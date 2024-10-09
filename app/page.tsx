"use client";
import { useState, useEffect, useRef } from "react";
import Confetti from 'react-confetti';

const Home = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [friendshipMeter, setFriendshipMeter] = useState(0);
  const [encouragingNote, setEncouragingNote] = useState("");
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isBestie, setIsBestie] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevFriendshipMeterRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newFriendshipMeter = messages.filter(msg => msg.role === "user").length;
    setFriendshipMeter(newFriendshipMeter);
    scrollToBottom();

    // Check for milestone achievements
    const prevPercentage = Math.min(prevFriendshipMeterRef.current * 5, 100);
    const currentPercentage = Math.min(newFriendshipMeter * 5, 100);
    if (
      (prevPercentage < 25 && currentPercentage >= 25) ||
      (prevPercentage < 50 && currentPercentage >= 50) ||
      (prevPercentage < 75 && currentPercentage >= 75)
    ) {
      showEncouragingNote();
    }

    // Check if friendship meter reached 100%
    if (currentPercentage === 100 && prevPercentage < 100) {
      setShowConfetti(true);
      setIsBestie(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    prevFriendshipMeterRef.current = newFriendshipMeter;
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const showEncouragingNote = () => {
    const notes = [
      "Great progress! Keep chatting!",
      "You're doing awesome! Continue the conversation!",
      "Fantastic job! Let's keep the chat going!",
      "You're on a roll! What else would you like to discuss?",
      "Wonderful! Your friendship is growing stronger!"
    ];
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setEncouragingNote(randomNote);
    setIsNoteVisible(true);
    setTimeout(() => {
      setIsNoteVisible(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { role: "user", content: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newMessages,
      }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.content }]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-between p-6 sm:p-12 font-sans">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold text-center text-gray-100 mb-16" style={{ fontFamily: 'Lobster, cursive' }}>
        Friendship Meter
      </h1>
      <div className="w-full max-w-2xl mx-auto mb-12 relative">
        <div 
          className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-medium transition-opacity duration-500 ease-in-out ${
            isNoteVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {encouragingNote}
        </div>
        <div className="w-full bg-gray-700 rounded-lg h-6 shadow-lg">
          <div 
            ref={progressBarRef}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-6 rounded-lg transition-all duration-500 ease-in-out relative"
            style={{ width: `${Math.min(friendshipMeter * 5, 100)}%` }}
          >
          </div>
        </div>
        {isBestie && (
          <p className="text-2xl font-bold text-center text-purple-300 mt-4 animate-pulse" style={{ fontFamily: 'Lobster, cursive' }}>
            Congratulations! You're now besties!
          </p>
        )}
      </div>
      <section className="w-full max-w-2xl mx-auto flex-grow flex flex-col">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 shadow-lg rounded-lg p-4 mb-4 flex-grow flex flex-col" style={{ maxHeight: "40vh" }}>
          <div 
            ref={chatContainerRef}
            className="mb-3 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700"
            style={{ maxHeight: "calc(40vh - 60px)", scrollBehavior: 'smooth' }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mt-2 p-2 rounded-lg ${
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white ml-auto" 
                    : "bg-gradient-to-r from-gray-600 to-gray-700 text-white mr-auto"
                } transition-all duration-300 ease-in-out hover:shadow-lg max-w-[80%]`}
              >
                <p className="text-xs md:text-sm font-bold" style={{ fontFamily: 'Lobster, sans-serif' }}>{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Enter your message"
              className="flex-grow px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out text-xs md:text-sm font-bold"
              style={{ fontFamily: 'Lobster, sans-serif' }}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-xs md:text-sm"
              style={{ fontFamily: 'Lobster, sans-serif' }}
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;import { useState } from "react";

const Home = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
      }),
    });
    const data = await res.json();
    setResponse(data.content);
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
        Chat Page
      </h1>
      <section className="max-w-3xl mx-auto w-full">
        <div className="bg-gray-800 shadow-lg rounded px-8 pt-6 pb-8 mb-4">
          {!response && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-4"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                className="px-3 py-2 bg-gray-700 text-white rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Send
              </button>
            </form>
          )}
          {response && (
            <div className="mt-4 p-3 bg-gray-700 text-white rounded">
              <p>{response}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
