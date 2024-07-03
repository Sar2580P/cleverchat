import classes from "@/styles/chat_ai.module.css";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Chat from "@/components/Chat/Chat";

export default function ConverseAi() {
  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <Chat />
      </div>
      <BottomNavigation
        left={{
          name: "Personalized AI Assessments",
          link: "/evaluate_ai",
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
