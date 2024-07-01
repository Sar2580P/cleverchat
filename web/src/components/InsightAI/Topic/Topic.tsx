"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import classes from "@/components/InsightAI/Topic/Topic.module.css";

interface TopicProps {
  name: string;
  image: string;
  description: string;
  onEnd: () => void;
}

const Topic: React.FC<TopicProps> = ({ name, image, description, onEnd }) => {
  const [currentCharIndex, setCurrentCharIndex] = useState<number | null>(null);
  const [currentCharLength, setCurrentCharLength] = useState<number | null>(
    null
  );
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.lang = "en-IN";
    utterance.pitch = 2;
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.onboundary = (event) => {
      setCurrentCharIndex(event.charIndex);
      setCurrentCharLength(event.charLength);
    };
    utterance.onerror = (event) => {
      console.error("onerror event", event);
    };
    utterance.onend = () => {
      setCurrentCharIndex(null);
      setCurrentCharLength(null);
      onEnd();
    };
    setUtterance(utterance);
    return () => {
      speechSynthesis.cancel();
    };
  }, [description, onEnd]);

  const playSpeech = () => {
    if (utterance) {
      speechSynthesis.speak(utterance);
      setIsPaused(false);
    }
  };
  const pauseSpeech = () => {
    speechSynthesis.pause();
    setIsPaused(true);
  };
  const resumeSpeech = () => {
    speechSynthesis.resume();
    setIsPaused(false);
  };

  const renderTextWithHighlight = () => {
    if (currentCharIndex !== null && currentCharLength !== null) {
      const before = description.substring(0, currentCharIndex);
      const highlighted = description.substring(
        currentCharIndex,
        currentCharIndex + currentCharLength
      );
      const after = description.substring(currentCharIndex + currentCharLength);

      return (
        <p>
          {before}
          <span
            style={{
              textDecoration: "underline",
              textDecorationColor: "var(--primary-color)",
              color: "var(--primary-color)",
            }}
          >
            {highlighted}
          </span>
          {after}
        </p>
      );
    }
    return <p>{description}</p>;
  };

  return (
    <div className={classes["container"]}>
      <h2>{name}</h2>
      <div className={classes["box"]}>
        {image && <Image src={image} alt={name} width={300} height={400} />}
        {!image && (
          <Image src="/background.jpg" alt={name} width={300} height={400} />
        )}
        {renderTextWithHighlight()}
      </div>
      <div className={classes.controls}>
        {!isPaused &&
          typeof window !== "undefined" &&
          window.speechSynthesis &&
          !speechSynthesis.speaking && (
            <button onClick={playSpeech}>Play</button>
          )}
        {!isPaused &&
          typeof window !== "undefined" &&
          window.speechSynthesis &&
          speechSynthesis.speaking && (
            <button onClick={pauseSpeech}>Pause</button>
          )}
        {isPaused && <button onClick={resumeSpeech}>Resume</button>}
      </div>
    </div>
  );
};

export default Topic;
