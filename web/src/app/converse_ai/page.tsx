"use client";
import { useContext } from "react";
import Markdown from "react-markdown";
import classes from "@/styles/converse_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import AppContext from "@/contexts/AppContext";
import Chat from "@/components/Chat/Chat";

export default function ConverseAi() {
  const appCtx = useContext(AppContext);

  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <div className={classes.left}>
          <h1>Summary of all the links</h1>
          <Markdown>
            {appCtx.converseAiMarkdown
              ? appCtx.converseAiMarkdown
              : "No Knowledge Found"}
          </Markdown>
        </div>
        <div className={classes.right}>
          <Chat />
        </div>
      </div>
      <BottomNavigation
        left={{ name: "Central AI Hub", link: "/", display: "block" }}
        right={{
          name: "AI Video Insights",
          link: "/insight_ai",
          display: "block",
        }}
      />
    </div>
  );
}
