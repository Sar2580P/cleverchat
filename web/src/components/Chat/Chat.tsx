"use client";
import React, { useContext } from "react";
import classes from "@/components/Chat/Chat.module.css";
import CustomBotChat from "@/components/Chat/CustomBotChat";
import { IoSend } from "react-icons/io5";
import AppContext from "@/contexts/AppContext";
import usePostLLMResponse from "@/hooks/usePostLLMResponse";

type Chat = {
  role: string;
  parts: {
    text: string;
  }[];
}[];

const Chat = ({}) => {
  const {
    converseAiChats,
    onConverseAiChats,
    currentQuestion,
    setCurrentQuestion,
  } = useContext(AppContext);
  const { postLLMResponse, loading } = usePostLLMResponse();

  const callBot = async () => {
    if (currentQuestion === "") return;
    onConverseAiChats([
      {
        role: "user",
        parts: [{ text: currentQuestion }],
      },
    ]);
    setCurrentQuestion("");
    const response = await postLLMResponse(
      { message: currentQuestion },
      "chat/"
    );
    if (response) {
      onConverseAiChats([
        {
          role: "bot",
          parts: [{ text: response }],
        },
      ]);
    }
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["box"]}>
        <div className={classes["chat-container"]}>
          <CustomBotChat data={converseAiChats} loading={loading} />
        </div>
        <div className={classes["chat-bottom"]}>
          <input
            autoFocus
            name="question"
            id="question"
            className={classes["input-field"]}
            placeholder="Ask me anything"
            value={currentQuestion}
            onKeyDown={(e) => {
              if (e.key == "Enter") callBot();
            }}
            onChange={(e) => {
              setCurrentQuestion(e.target.value);
            }}
          ></input>
          <button className={classes["send-button"]} onClick={callBot}>
            <IoSend className="transition duration-300" size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
