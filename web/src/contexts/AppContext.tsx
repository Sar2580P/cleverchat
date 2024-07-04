"use client";
import React, { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";

type Chat = {
  role: string;
  parts: {
    text: string[];
  }[];
}[];

interface Question {
  question: string;
  type: "text" | "single" | "multi";
  options?: string[];
  id: string;
  answer: string;
}

type AppContextType = {
  links: string[];
  link: string;
  onLinks: (link: string) => void;
  onLink: (link: string) => void;
  onDelete: (link: string) => void;

  converseAiMarkdown: string[];
  onConverseAiMarkdown: (markdown: string[]) => void;
  converseAiChats: Chat;
  onConverseAiChats: (chat: Chat) => void;
  currentQuestion: string;
  setCurrentQuestion: (question: string) => void;

  evaluateAiQuestions: Question[];
  onEvaluateAiQuestions: (questions: Question[]) => void;
  isevaluateAiAnswereCorrect: { id: string; selectedOption: boolean | null }[];
  onEvaluateAiAnswerCorrect: (id: string, selectedOption: string) => void;
  isQuizCompleted: boolean;
  onQuizCompleted: (toggle: boolean) => void;
  quizResult: Record<string, string>;
  onQuizResult: (result: Record<string, string>) => void;
};

const AppContext = React.createContext<AppContextType>({
  links: [],
  link: "",
  onLinks: () => {},
  onLink: () => {},
  onDelete: () => {},
  converseAiMarkdown: [],
  onConverseAiMarkdown: () => {},
  converseAiChats: [],
  onConverseAiChats: () => {},
  currentQuestion: "",
  setCurrentQuestion: () => {},
  evaluateAiQuestions: [],
  onEvaluateAiQuestions: () => {},
  isevaluateAiAnswereCorrect: [],
  onEvaluateAiAnswerCorrect: () => {},
  isQuizCompleted: false,
  onQuizCompleted: () => {},
  quizResult: {},
  onQuizResult: () => {},
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
  const [converseAiMarkdown, setConverseAiMarkdown] = useState<string[]>([]);
  const onConverseAiMarkdown = (markdown: string[]) => {
    setConverseAiMarkdown(markdown);
    localStorage.setItem("clever_chat_markdown", JSON.stringify(markdown));
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
  const [isevaluateAiAnswereCorrect, setIsevaluateAiAnswereCorrect] = useState<
    { id: string; selectedOption: boolean | null }[]
  >([]);
  const onEvaluateAiQuestions = (questions: Question[]) => {
    setEvaluateAiQuestions(questions);
    setIsevaluateAiAnswereCorrect(
      questions.map((question) => ({ id: question.id, selectedOption: null }))
    );
  };
  const onEvaluateAiAnswerCorrect = (id: string, selectedOption: string) => {
    const isCorrect =
      evaluateAiQuestions.find((question) => question.id === id)?.answer ===
      selectedOption;
    setIsevaluateAiAnswereCorrect((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedOption: isCorrect } : item
      )
    );
  };
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const onQuizCompleted = (toggle: boolean) => {
    setIsQuizCompleted(toggle);
  };
  const [quizResult, setQuizResult] = useState<Record<string, string>>({});
  const onQuizResult = (result: Record<string, string>) => {
    setQuizResult(result);
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
          setConverseAiMarkdown(JSON.parse(savedMarkdown));
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
        isevaluateAiAnswereCorrect,
        onEvaluateAiAnswerCorrect,
        isQuizCompleted,
        onQuizCompleted,
        quizResult,
        onQuizResult,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
