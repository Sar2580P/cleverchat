"use client";
import React, { useEffect, useRef } from "react";
import ChatItem from "@/components/Chat/ChatItem";
import classes from "@/components/Chat/CustomBotChat.module.css";
import LoadingComponent from "@/components/Loading/Loading";

type Chat = {
  data: {
    role: string;
    parts: {
      text: string;
    }[];
  }[];
  loading: boolean;
};

const CustomBotChat: React.FC<Chat> = ({ data, loading }) => {
  const chatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatsRef.current) {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <div className={classes["container"]}>
      <div className={classes["chats"]} ref={chatsRef}>
        {data.map((chat, index) => (
          <ChatItem key={index} message={chat.parts[0].text} user={chat.role} />
        ))}
        {loading && (
          <LoadingComponent
            height="auto"
            size="11px"
            width="auto"
            alignItems="flex-start"
          />
        )}
      </div>
    </div>
  );
};

export default CustomBotChat;
