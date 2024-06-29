import classes from "@/styles/insight_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

export default function InsightAi() {
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
