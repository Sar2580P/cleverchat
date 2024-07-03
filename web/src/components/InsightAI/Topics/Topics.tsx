"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/reusables/Loader/Loader";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import Topic from "@/components/InsightAI/Topic/Topic";
import useGetLLMResponse from "@/hooks/useGetLLMResponse";
import classes from "@/components/InsightAI/Topics/Topics.module.css";

type Topic = {
  id: number;
  name: string;
  image: string;
  description: string;
};

const DUMMY_TOPICS: Topic[] = [
  {
    id: 1,
    name: "Artificial Intelligence",
    image: "/background.jpg",
    description:
      "Artificial intelligence AI is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions) and self-correction.",
  },
];

const Home: React.FC = () => {
  const { getLLMResponse, loading } = useGetLLMResponse();
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [topics, setTopics] = useState([] as Topic[]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLLMResponse("insight_ai_data/");
      if (response) setTopics(response);
      else setTopics(DUMMY_TOPICS);
    };
    if (typeof window !== "undefined") fetchData();
  }, []);

  const handleEnd = () => {
    if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
    } else {
      setCurrentTopicIndex(0);
    }
  };

  const handleNext = () => {
    setCurrentTopicIndex((prevIndex) => (prevIndex + 1) % topics.length);
  };
  const handlePrev = () => {
    setCurrentTopicIndex(
      (prevIndex) => (prevIndex - 1 + topics.length) % topics.length
    );
  };

  if (loading || topics.length === 0) return <Loader text="Loading..." />;

  const currentTopic = topics[currentTopicIndex];

  return (
    <div className={classes["container"]}>
      <Topic
        key={currentTopic.id}
        name={currentTopic.name}
        image={currentTopic?.image || "/background.jpg"}
        description={currentTopic.description}
        onEnd={handleEnd}
      />
      <div className={classes["buttons"]}>
        <button onClick={handlePrev} className={classes["prev-button"]}>
          <MdOutlineNavigateBefore />
        </button>
        <button onClick={handleNext} className={classes["next-button"]}>
          <MdOutlineNavigateNext />
        </button>
      </div>
    </div>
  );
};

export default Home;
