"use client";
import { useContext } from "react";
import classes from "@/styles/page.module.css";
import AddLinks from "@/components/AddLinks/AddLinks";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Button from "@/reusables/Button/Button";
import AppContext from "@/contexts/AppContext";
import usePostLLMResponse from "@/hooks/usePostLLMResponse";

export default function Home() {
  const { links } = useContext(AppContext);
  const { postLLMResponse, loading } = usePostLLMResponse();
  const handleSubmit = async () => {
    const response = await postLLMResponse(
      { links: links },
      "link_knowledge_base/"
    );
  };
  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <h1>Enhance Your AI with Custom Knowledge Integration</h1>
        <p>
          Power of web scraping to enrich your AI&apos;s knowledge base
          dynamically. By scraping data from designated websites, your AI can
          continuously update and expand its understanding of various topics,
          making it more responsive and insightful in its interactions. Let your
          AI evolve alongside real-time information, providing users with
          up-to-date and relevant knowledge effortlessly.
        </p>
        <AddLinks />
      </div>
      <BottomNavigation
        left={{
          name: "Personalized AI Assessments",
          link: "/evaluate_ai",
          display: "none",
        }}
        right={{
          name: "Intelligent AI Chatbot",
          link: "/converse_ai",
          display: "block",
        }}
      />
      <Button text="Make Your AI Smarter" onClick={handleSubmit} />
    </div>
  );
}
