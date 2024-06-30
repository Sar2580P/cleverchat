"use client";
import { useEffect } from "react";
import classes from "@/styles/insight_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import useGetLLMResponse from "@/hooks/useGetLLMResponse";

export default function InsightAi() {
  const { getLLMResponse, loading } = useGetLLMResponse();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLLMResponse("insight_ai_data/");
      console.log(response);
    };
    if (typeof window !== "undefined") fetchData();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.box}>
        Our AI-powered insights help you understand your customers better.
      </div>
      <BottomNavigation
        left={{
          name: "Intelligent AI Chatbot",
          link: "/converse_ai",
          display: "block",
        }}
        right={{
          name: "Personalized AI Assessments",
          link: "/evaluate_ai",
          display: "block",
        }}
      />
    </div>
  );
}
