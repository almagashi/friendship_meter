"use client";
import { useState } from "react";
import Image from 'next/image';

const Home = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isChinese, setIsChinese] = useState(false);

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

  const toggleLanguage = () => {
    setIsChinese(!isChinese);
  };

  return (
    <main className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12 relative">
      <div className="absolute top-4 left-4">
        <button onClick={toggleLanguage} className="bg-gray-800 p-2 rounded-full">
          <Image
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMi44NyAxNS4wN2wtMi41NC0yLjUxLjAzLS4wM2MxLjc0LTEuOTQgMi45OC00LjE3IDMuNzEtNi41M0gxN1Y0aC03VjJIOHYySDFWNmgxMS4xN0MxMS41IDcuOTIgMTAuNDQgOS43NSA5IDExLjM1IDguMDcgMTAuMzIgNy4zIDkuMTkgNi42OSA4aC0yYy43MyAxLjYzIDEuNzMgMy4xNyAyLjk4IDQuNTZsLTUuMDkgNS4wMkw0IDE5bDUtNSAzLjExIDMuMTEuNzYtMi4wNHpNMTguNSAxMGgtMkwxMiAyMmgybDEuMTItM2g0Ljc1TDIxIDIyaDJsLTQuNS0xMnptLTIuNjIgN2wxLjYyLTQuMzNMTTkuMTIgMTdsMS42MiA0LjMzaC0zLjI0eiIvPjwvc3ZnPg=="
            alt="Toggle Language"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-100 mb-4">
          {isChinese ? "新一代人工智能驅動聊天" : "Next-Gen AI-Powered Chat"}
        </h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">
          {isChinese ? "革新通訊" : "Revolutionizing Communication"}
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          {isChinese
            ? "體驗我們尖端人工智能聊天的未來。準備見證我們互動和分享信息方式的轉變。"
            : "Experience the future of conversation with our cutting-edge AI chat. Prepare to witness a transformation in how we interact and share information."}
        </p>
      </div>
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
                placeholder={isChinese ? "輸入您的訊息" : "Enter your message"}
                className="px-3 py-2 bg-gray-700 text-white rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {isChinese ? "發送" : "Send"}
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