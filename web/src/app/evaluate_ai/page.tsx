import classes from "@/styles/evaluate_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

export default function evaluate_ai() {
  return (
    <div className={classes.container}>
      <div className={classes.box}>evaluate_ai</div>
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
