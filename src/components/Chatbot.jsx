import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [question, setquestion] = useState([]);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  function handleClick(msg, e) {
    setMessage(msg);
  }

  const handleSendMessage = async (e) => {
    console.log(JSON.stringify({ text: message }));
    setIsTyping(true);
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setIsTyping(false);
      setquestion((prev) => [message, ...prev]);
      setOutput((prev) => [data.reply, ...prev]);
      setMessage("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbotWrapper">
        <h1>Chatbot</h1>
        <form onSubmit={handleSendMessage} className="chatbotForm">
          <input
            type="text"
            value={message}
            placeholder="enter your message"
            className="search"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="sbt-btn">
            ↑
          </button>
        </form>
        <div className={isTyping ? "" : "hide"}>
          <p>
            <i>{isTyping ? "Typing" : ""}</i>
          </p>
        </div>
        <section className="center">
          {output && output.length ? (
            output.map((chat, index) => (
              <p key={index} className={chat ? "output" : ""}>
                <span>
                  <b>Question:</b>
                </span>
                <span>{question[index]}</span>
                <span>
                  <br></br>
                  <b>Reply:</b>
                </span>
                <span>{chat}</span>
              </p>
            ))
          ) : (
            <>
              <div className="suggestions">
                <div
                  className="output"
                  onClick={() => handleClick("Write an email")}
                >
                  <span>Write an email</span>
                </div>
                <div
                  className="output"
                  onClick={() => handleClick("Create a workout plan")}
                >
                  <span>Create a workout plan</span>
                </div>
                <div
                  className="output"
                  onClick={() => handleClick("Suggest fun activites")}
                >
                  <span>Suggest fun activites</span>
                </div>
                <div
                  className="output"
                  onClick={() => handleClick("Make a content strategy")}
                >
                  <span>Make a content strategy</span>
                </div>
              </div>
            </>
          )}
        </section>

        {error && <div className="error">Error: {error}</div>}
      </div>
    </div>
  );
}

export default Chatbot;
