import classes from "@/styles/evaluate_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Quiz from "@/components/Quiz/Quiz";

export default function EvaluateAi() {
  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <h1>AI Evaluation</h1>
        <Quiz />
      </div>
      <BottomNavigation
        left={{
          name: "AI Video Insights",
          link: "/insight_ai",
          display: "block",
        }}
        right={{
          name: "Central AI Hub",
          link: "/",
          display: "none",
        }}
      />
    </div>
  );
}
