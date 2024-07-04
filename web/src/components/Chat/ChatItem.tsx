import React from "react";
import classes from "@/components/Chat/ChatItem.module.css";
import Markdown from "react-markdown";

type ChatItemProps = {
  message: string[];
  user: string;
};

const shadesOfWhite = [
  "#FFFAFA",
  "#FFFFF0",
  "#FAF0E6",
  "#FFF5EE",
  "#FDF5E6",
  "#FFFAF0",
  "#F8F8FF",
  "#FAEBD7",
  "#F5F5F5",
  "#F0FFFF",
];

const ChatItem: React.FC<ChatItemProps> = ({ message, user }) => {
  return (
    <div className={classes["container"]}>
      <div className={`${classes["message-box"]} ${classes[user]}`}>
        <div className={classes["user-logo"]}>{user.substring(0, 2)}</div>
        <div className={classes["message"]}>
          {message?.map((markdownString, index) => (
            <div
              className={classes["each-markdown"]}
              style={{
                backgroundColor: shadesOfWhite[index % shadesOfWhite.length],
                padding: user === "bot" ? "1rem" : "",
              }}
              key={index}
            >
              <Markdown key={index}>{markdownString}</Markdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
