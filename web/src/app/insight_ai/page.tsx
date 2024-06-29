import classes from "@/styles/insight_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

export default function insight_ai() {
  return (
    <div className={classes.container}>
      <div className={classes.box}>insight_ai</div>
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
