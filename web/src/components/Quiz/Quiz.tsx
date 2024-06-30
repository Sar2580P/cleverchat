"use client";
import React, { useEffect, useContext } from "react";
import classes from "@/components/Quiz/Quiz.module.css";
import Button from "@/reusables/Button/Button";
import AppContext from "@/contexts/AppContext";
import useGetLLMResponse from "@/hooks/useGetLLMResponse";
import usePostLLMResponse from "@/hooks/usePostLLMResponse";
import LoadingComponent from "@/components/Loading/Loading";
import Loader from "@/reusables/Loader/Loader";
import Popup from "@/reusables/PopUp/PopUp";

const Quiz = () => {
  const {
    evaluateAiQuestions,
    onEvaluateAiQuestions,
    evaluateAiAnswers,
    onEvaluateAiAnswers,
    evaluateAiResult,
    onEvaluateAiResult,
    evaluateAiResultVisible,
    setEvaluateAiResultVisible,
  } = useContext(AppContext);

  const { getLLMResponse, loading: get_loading } = useGetLLMResponse();
  const { postLLMResponse, loading: post_loading } = usePostLLMResponse();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLLMResponse("evaluate_ai/");
      if (response) onEvaluateAiQuestions(response);
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

  const handleSubmit = async () => {
    console.log(evaluateAiAnswers);
    const response = await postLLMResponse(
      { data: evaluateAiAnswers },
      "evaluate_ai/"
    );
    if (response) {
      onEvaluateAiResult(response);
      setEvaluateAiResultVisible(true);
    }
  };

  if (get_loading) {
    return <LoadingComponent height="70vh" />;
  }

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
      {post_loading && <Loader text="Evaluating..." />}
      {evaluateAiResultVisible && (
        <Popup
          heading="Evaluation Result"
          data={evaluateAiResult}
          onClose={() => setEvaluateAiResultVisible(false)}
        />
      )}
      {Object.keys(evaluateAiResult).length > 0 && (
        <Button
          text="Show Result"
          onClick={() => setEvaluateAiResultVisible(true)}
        />
      )}
    </div>
  );
};

export default Quiz;
