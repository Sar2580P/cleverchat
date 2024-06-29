import classes from "@/styles/converse_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

export default function converse_ai() {
  return (
    <div className={classes.container}>
      <div className={classes.box}>converse_ai</div>
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
