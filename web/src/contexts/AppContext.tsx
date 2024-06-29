"use client";
import React, { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";

type AppContextType = {
  links: string[];
  link: string;
  onLinks: (link: string) => void;
  onLink: (link: string) => void;
  onDelete: (link: string) => void;
};

const AppContext = React.createContext<AppContextType>({
  links: [],
  link: "",
  onLinks: () => {},
  onLink: () => {},
  onDelete: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AppContextProvider: React.FC<Props> = (props) => {
  const { NotificationHandler } = useNotification();

  // CODE CENTRAL AI HUB OR HOME PAGE
  const [links, setLinks] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const linkHandler = (link: string) => {
    const urlRegex = new RegExp("^(http|https)://[^\\s/$.?#].[^\\s]*$", "i");
    if (urlRegex.test(link)) {
      setLinks((prev) => [...prev, link]);
      localStorage.setItem(
        "clever_chat_links",
        JSON.stringify([...links, link])
      );
      setLink("");
    } else {
      NotificationHandler("Clever chat", "Please enter a valid link", "Error");
    }
  };
  const onDeleteHandler = (link: string) => {
    setLinks((prev) => prev.filter((note) => note !== link));
    localStorage.setItem(
      "clever_chat_links",
      JSON.stringify(links.filter((note) => note !== link))
    );
  };

  useEffect(() => {
    const loadLinks = () => {
      if (typeof window !== "undefined") {
        const savedLinks = localStorage.getItem("clever_chat_links");
        if (savedLinks) {
          setLinks(JSON.parse(savedLinks));
        }
      }
    };
    loadLinks();
  }, []);

  return (
    <AppContext.Provider
      value={{
        links,
        link,
        onLinks: linkHandler,
        onLink: setLink,
        onDelete: onDeleteHandler,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
