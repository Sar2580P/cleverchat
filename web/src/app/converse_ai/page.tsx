"use client";
import { useContext, useEffect } from "react";
import Markdown from "react-markdown";
import classes from "@/styles/converse_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import AppContext from "@/contexts/AppContext";
import useGetLLMResponse from "@/hooks/useGetLLMResponse";
import LoadingComponent from "@/components/Loading/Loading";

export default function ConverseAi() {
  const appCtx = useContext(AppContext);
  const { getLLMResponse, loading } = useGetLLMResponse();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLLMResponse("converse_ai_readme/");
      if (response) appCtx.onConverseAiMarkdown(response);
    };
    if (typeof window !== "undefined") fetchData();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <h1>Summary of all the links</h1>
        {loading ? (
          <LoadingComponent height="90vh" />
        ) : (
          <Markdown>
            {appCtx.converseAiMarkdown
              ? appCtx.converseAiMarkdown
              : "No Knowledge Found"}
          </Markdown>
        )}
      </div>
      <BottomNavigation
        left={{ name: "Central AI Hub Add links", link: "/", display: "block" }}
        right={{
          name: "AI Video Insights",
          link: "/insight_ai",
          display: "block",
        }}
      />
    </div>
  );
}
