import classes from "@/styles/page.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

export default function Home() {
  return (
    <div className={classes.container}>
      <div className={classes.box}>Home page</div>
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
    </div>
  );
}
