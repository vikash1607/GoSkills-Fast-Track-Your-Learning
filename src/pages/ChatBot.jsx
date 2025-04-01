import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatResponse = (text) => {
    const lines = text.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h3 key={index} className="font-bold text-[#FCB045]">{line.replace(/\*\*/g, "")}</h3>;
      }
      if (line.startsWith("* **")) {
        return <li key={index} className="list-disc ml-4 font-semibold text-richblack-5">{line.replace(/\* \*\*/g, "").replace(/\*\*:/, ":")}</li>;
      }
      if (line.startsWith("* ")) {
        return <li key={index} className="list-disc ml-4 text-richblack-300">{line.replace("* ", "")}</li>;
      }
      return <p key={index} className="text-richblack-5">{line}</p>;
    });
    return <div className="space-y-2">{lines}</div>;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: input }]);
    setIsLoading(true);
    setInput("");

    try {
      const { data } = await axios.post("http://localhost:4000/api/v1/chatbot", { query: input });
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-richblack-700 shadow-xl border border-richblack-600">
      {/* <div className="bg-gradient-to-r from-[#cab6ed]  p-5 text-center text-2xl font-bold text-white border-b border-richblack-600">
        goSkills Chatbot
      </div> */}

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-richblack-700">
      {messages.map((msg, index) => (
  <div
    key={index}
    className={`p-4 max-w-2xl rounded-xl shadow-md text-sm md:text-base border border-gray-300 ${
      msg.sender === "user"
        ? "bg-gray-100 text-richblack-400 ml-auto text-right"
        : "bg-gray-100 text-richblack-400 mr-auto text-left"
    }`}
  >
    {formatResponse(msg.text)}
  </div>
))}


        {isLoading && (
          <div className="flex items-center space-x-2 text-richblack-300 animate-pulse">
            <Loader2 className="animate-spin" size={24} />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-5  border-t border-richblack-600 bg-richblack-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-3 border border-richblack-500 rounded-lg outline-none focus:ring-2 focus:ring-[#FCB045] bg-richblack-700 text-richblack-5"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white p-3  rounded-lg hover:opacity-90 transition-all flex items-center justify-center shadow-lg disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
