"use client";
import React, { useEffect, useContext } from "react";
import classes from "@/components/Quiz/Quiz.module.css";
import Button from "@/reusables/Button/Button";
import AppContext from "@/contexts/AppContext";
import useGetLLMResponse from "@/hooks/useGetLLMResponse";
import usePostLLMResponse from "@/hooks/usePostLLMResponse";

const Quiz = () => {
  const {
    evaluateAiQuestions,
    onEvaluateAiQuestions,
    evaluateAiAnswers,
    onEvaluateAiAnswers,
  } = useContext(AppContext);
  const { getLLMResponse } = useGetLLMResponse();
  const { postLLMResponse, loading } = usePostLLMResponse();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLLMResponse("evaluate_ai/");
      onEvaluateAiQuestions(response);
    };
    if (typeof window !== "undefined") fetchData();
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
    postLLMResponse({ data: evaluateAiAnswers }, "evaluate_ai/");
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
