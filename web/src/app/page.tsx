"use client";
import classes from "@/styles/page.module.css";
import AddLinks from "@/components/AddLinks/AddLinks";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Button from "@/reusables/Button/Button";
export default function Home() {
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
      <Button
        text="Make Your AI Smarter"
        onClick={() => {
          console.log("Make Your AI Smarter");
        }}
      />
    </div>
  );
}
