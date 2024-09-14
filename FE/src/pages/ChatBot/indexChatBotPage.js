import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./chatbotPage.scss";
import classNames from "classnames";
import axios from "axios";
import leftArrow from "../../assets/image/Icon/left-arrow.png";
const cx = classNames.bind(styles);

const ChatBotPage = () => {
  const navigate = useNavigate();
  // Initialize messages state with a welcome message
  const [messages, setMessages] = useState([
    {
      text: "Xin chào bạn đến với Bánh mì Ô Long. Tôi có thể giúp gì cho bạn?",
      from: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newUserMessage = { text: input, from: "user" };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInput("");
      setIsLoading(true); // Start loading

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/chat`,
          {
            message: input,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        console.log(data.chatBot);

        if (data && data.chatBot) {
          const botResponse = { text: data.chatBot, from: "bot" };
          setMessages((prevMessages) => {
            // Remove the loading indicator before adding the actual response
            const updatedMessages = prevMessages.filter(
              (msg) => msg.text !== "Vui lòng chờ ... "
            );
            return [...updatedMessages, botResponse];
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = {
          text: "Có lỗi xảy ra khi gửi tin nhắn.",
          from: "bot",
        };
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter(
            (msg) => msg.text !== "Vui lòng chờ ... "
          );
          return [...updatedMessages, errorMessage];
        });
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className={cx("chatbot-page")}>
      <div className={cx("header")}>
        <button onClick={() => navigate(-1)} className={cx("back-button")}>
          <img src={leftArrow} alt="back" />
        </button>
        <h1 className={cx("title")}>Chat bot</h1>
      </div>
      <div className={cx("chat-container")} ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={cx("message", { "from-user": message.from === "user" })}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className={cx("message", "from-bot")}>
            <span>Vui lòng chờ ... </span> {/* Loading indicator */}
          </div>
        )}
      </div>
      <div className={cx("input-container")}>
        <input
          type="text"
          placeholder="Hãy nhắn gì đó..."
          className={cx("chat-input")}
          value={input}
          onChange={handleInputChange}
        />
        <button className={cx("send-button")} onClick={handleSendMessage}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBotPage;
