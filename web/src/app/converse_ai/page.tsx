"use client";
import { useContext, useEffect } from "react";
import Markdown from "react-markdown";
import classes from "@/styles/converse_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import AppContext from "@/contexts/AppContext";
import useGetLLMResponse from "@/hooks/useGetLLMResponse";
import LoadingComponent from "@/components/Loading/Loading";

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
          appCtx.converseAiMarkdown?.map((markdownString, index) => (
            <div
              className={classes["each-markdown"]}
              style={{
                backgroundColor: shadesOfWhite[index % shadesOfWhite.length],
              }}
              key={index}
            >
              <Markdown key={index}>{markdownString}</Markdown>
            </div>
          ))
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
