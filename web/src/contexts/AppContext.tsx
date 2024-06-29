"use client";
import React, { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";

type Chat = {
  role: string;
  parts: {
    text: string;
  }[];
}[];

interface Option {
  id: string;
  option: string;
}
interface Question {
  question: string;
  type: "text" | "single" | "multi";
  options?: Option[];
  id: string;
}
interface Answer {
  questionId: string;
  type: "text" | "single" | "multi";
  answer: string | string[];
}

type AppContextType = {
  links: string[];
  link: string;
  onLinks: (link: string) => void;
  onLink: (link: string) => void;
  onDelete: (link: string) => void;

  converseAiMarkdown: string;
  onConverseAiMarkdown: (markdown: string) => void;
  converseAiChats: Chat;
  onConverseAiChats: (chat: Chat) => void;
  currentQuestion: string;
  setCurrentQuestion: (question: string) => void;

  evaluateAiQuestions: Question[];
  onEvaluateAiQuestions: (questions: Question[]) => void;
  evaluateAiAnswers: Answer[];
  onEvaluateAiAnswers: (
    questionId: string,
    optionValue: string,
    type: "text" | "single" | "multi"
  ) => void;
};

const AppContext = React.createContext<AppContextType>({
  links: [],
  link: "",
  onLinks: () => {},
  onLink: () => {},
  onDelete: () => {},
  converseAiMarkdown: "",
  onConverseAiMarkdown: () => {},
  converseAiChats: [],
  onConverseAiChats: () => {},
  currentQuestion: "",
  setCurrentQuestion: () => {},
  evaluateAiQuestions: [],
  onEvaluateAiQuestions: () => {},
  evaluateAiAnswers: [],
  onEvaluateAiAnswers: () => {},
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

  // CODE INTELLIGENT AI CHATBOT PAGE
  const [converseAiMarkdown, setConverseAiMarkdown] = useState("");
  const onConverseAiMarkdown = (markdown: string) => {
    setConverseAiMarkdown(markdown);
    localStorage.setItem("clever_chat_markdown", markdown);
  };
  const [converseAiChats, setConverseAiChats] = useState<Chat>([]);
  const onConverseAiChats = (chat: Chat) => {
    setConverseAiChats((prev) => [...prev, ...chat]);
  };
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  // CODE PERSONALIZED AI ASSESSMENTS PAGE
  const [evaluateAiQuestions, setEvaluateAiQuestions] = useState<Question[]>(
    []
  );
  const onEvaluateAiQuestions = (questions: Question[]) => {
    setEvaluateAiQuestions(questions);
    const initialAnswers = questions.map((q) => ({
      questionId: q.id,
      type: q.type,
      answer: q.type === "multi" ? [] : "",
    }));
    setEvaluateAiAnswers(initialAnswers);
  };
  const [evaluateAiAnswers, setEvaluateAiAnswers] = useState<Answer[]>([]);
  const onEvaluateAiAnswers = (
    questionId: string,
    optionValue: string,
    type: "text" | "single" | "multi"
  ) => {
    setEvaluateAiAnswers((prevAnswers) =>
      prevAnswers.map((ans) =>
        ans.questionId === questionId
          ? {
              ...ans,
              answer:
                type === "multi"
                  ? Array.isArray(ans.answer)
                    ? ans.answer.includes(optionValue)
                      ? ans.answer.filter((a) => a !== optionValue)
                      : [...ans.answer, optionValue]
                    : [optionValue]
                  : optionValue,
            }
          : ans
      )
    );
  };

  useEffect(() => {
    const loadLinks = () => {
      if (typeof window !== "undefined") {
        const savedLinks = localStorage.getItem("clever_chat_links");
        if (savedLinks) {
          setLinks(JSON.parse(savedLinks));
        }

        const savedMarkdown = localStorage.getItem("clever_chat_markdown");
        if (savedMarkdown) {
          setConverseAiMarkdown(savedMarkdown);
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
        converseAiMarkdown,
        onConverseAiMarkdown,
        converseAiChats,
        onConverseAiChats,
        currentQuestion,
        setCurrentQuestion,
        evaluateAiQuestions,
        onEvaluateAiQuestions,
        evaluateAiAnswers,
        onEvaluateAiAnswers,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
