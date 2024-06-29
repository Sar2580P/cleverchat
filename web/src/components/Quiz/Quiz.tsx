"use client";
import React, { useEffect, useContext } from "react";
import classes from "@/components/Quiz/Quiz.module.css";
import Button from "@/reusables/Button/Button";
import AppContext from "@/contexts/AppContext";

type Question = {
  question: string;
  type: "text" | "multi" | "single";
  options: { id: string; option: string }[];
  id: string;
};

const questions: Question[] = [
  {
    question: "What is your name?",
    type: "text",
    options: [],
    id: "1",
  },
  {
    question: "Select your favorite colors",
    type: "multi",
    options: [
      { id: "1", option: "Red" },
      { id: "2", option: "Blue" },
      { id: "3", option: "Green" },
    ],
    id: "2",
  },
  {
    question: "Which planet is known as the Red Planet?",
    type: "single",
    options: [
      { id: "1", option: "Earth" },
      { id: "2", option: "Mars" },
      { id: "3", option: "Jupiter" },
    ],
    id: "3",
  },
  {
    question: "What is the capital of France?",
    type: "single",
    options: [
      { id: "1", option: "Paris" },
      { id: "2", option: "London" },
      { id: "3", option: "Berlin" },
    ],
    id: "4",
  },
];

const Quiz = () => {
  const {
    evaluateAiQuestions,
    onEvaluateAiQuestions,
    evaluateAiAnswers,
    onEvaluateAiAnswers,
  } = useContext(AppContext);

  useEffect(() => {
    onEvaluateAiQuestions(questions);
  }, []);

  const handleAnswerChange = (
    questionId: string,
    optionValue: string,
    type: "text" | "single" | "multi"
  ) => {
    onEvaluateAiAnswers(questionId, optionValue, type);
  };

  const handleSubmit = () => {
    console.log(evaluateAiAnswers);
  };

  if (evaluateAiQuestions.length === 0) {
    return (
      <div
        className={classes["quiz-container"]}
        style={{
          height: "auto",
        }}
      >
        <p>
          No questions available. Please contact the administrator for more
          information.
        </p>
      </div>
    );
  }

  return (
    <div className={classes["quiz-container"]}>
      {evaluateAiQuestions.map((q, index) => (
        <div key={index} className={classes["question"]}>
          <h2>{q.question}</h2>
          {q.type === "text" && (
            <input
              type="text"
              id={`q${index}-option`}
              name={`question-${index}`}
              onChange={(e) => handleAnswerChange(q.id, e.target.value, q.type)}
            />
          )}
          {q.type === "single" &&
            q.options?.map((option) => (
              <div key={option.id}>
                <input
                  type="radio"
                  id={`q${index}-option${option.id}`}
                  name={`question-${index}`}
                  value={option.option}
                  onChange={(e) =>
                    handleAnswerChange(q.id, e.target.value, q.type)
                  }
                />
                <label htmlFor={`q${index}-option${option.id}`}>
                  {option.option}
                </label>
              </div>
            ))}
          {q.type === "multi" &&
            q.options?.map((option) => (
              <div key={option.id}>
                <input
                  type="checkbox"
                  id={`q${index}-option${option.id}`}
                  name={`question-${index}`}
                  value={option.option}
                  onChange={(e) =>
                    handleAnswerChange(q.id, e.target.value, q.type)
                  }
                />
                <label htmlFor={`q${index}-option${option.id}`}>
                  {option.option}
                </label>
              </div>
            ))}
        </div>
      ))}
      <Button text="Submit" onClick={handleSubmit} />
    </div>
  );
};

export default Quiz;
