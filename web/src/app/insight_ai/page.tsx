import classes from "@/styles/insight_ai.module.css";
import Topics from "@/components/InsightAI/Topics/Topics";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

export default function InsightAi() {
  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <h1>Learn By Video Lectures</h1>
        <Topics />
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
