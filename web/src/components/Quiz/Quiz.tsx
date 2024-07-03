"use client";
import React, { useEffect, useContext } from "react";
import classes from "@/components/Quiz/Quiz.module.css";
import AppContext from "@/contexts/AppContext";
import useGetLLMResponse from "@/hooks/useGetLLMResponse";
import LoadingComponent from "@/components/Loading/Loading";
import { TiTickOutline } from "react-icons/ti";
import { AiOutlineClose } from "react-icons/ai";
import Popup from "@/reusables/PopUp/PopUp";

const Quiz = () => {
  const {
    evaluateAiQuestions,
    onEvaluateAiQuestions,
    isevaluateAiAnswereCorrect,
    onEvaluateAiAnswerCorrect,
    isQuizCompleted,
    onQuizCompleted,
    quizResult,
    onQuizResult,
  } = useContext(AppContext);
  const { getLLMResponse, loading: get_loading } = useGetLLMResponse();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLLMResponse("evaluate_ai/");
      if (response) onEvaluateAiQuestions(response);
      else {
        onEvaluateAiQuestions([
          {
            id: "1",
            question: "What is the primary function of a neural network in AI?",
            type: "single",
            options: [
              "To store data",
              "To perform computations",
              "To simulate human brain functions",
              "To connect multiple devices",
            ],
            answer: "To simulate human brain functions",
          },
          {
            id: "2",
            question:
              "Which of the following is an example of unsupervised learning?",
            type: "single",
            options: [
              "Classification",
              "Regression",
              "Clustering",
              "Reinforcement learning",
            ],
            answer: "Clustering",
          },
          {
            id: "3",
            question: "What does 'GPT' stand for in OpenAI's GPT models?",
            type: "single",
            options: [
              "Generalized Pre-training Transformer",
              "Generative Pre-trained Transformer",
              "Graphical Processing Transformer",
              "Global Pre-trained Transformer",
            ],
            answer: "Generative Pre-trained Transformer",
          },
        ]);
      }
    };
    if (typeof window !== "undefined") fetchData();
  }, []);

  const handleAnswerChange = (
    questionId: string,
    optionValue: string,
    type: "text" | "single" | "multi"
  ) => {
    onEvaluateAiAnswerCorrect(questionId, optionValue);
  };

  useEffect(() => {
    const totalMarked = isevaluateAiAnswereCorrect.filter(
      (a) => a.selectedOption === true || a.selectedOption === false
    ).length;
    const correctAnswers = isevaluateAiAnswereCorrect.filter(
      (a) => a.selectedOption === true
    ).length;
    if (totalMarked === evaluateAiQuestions.length && correctAnswers > 0) {
      onQuizResult({
        "Total Questions": `${evaluateAiQuestions.length}`,
        "Correct Answers": `${correctAnswers}`,
        "Incorrect Answers": `${evaluateAiQuestions.length - correctAnswers}`,
      });
      setTimeout(() => {
        if (isQuizCompleted === false) onQuizCompleted(true);
      }, 1000);
    }
  }, [isevaluateAiAnswereCorrect, evaluateAiQuestions]);

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
          <div className={classes["is-correct"]}>
            {isevaluateAiAnswereCorrect[index].selectedOption == true && (
              <TiTickOutline color="green" size="1.5em" />
            )}
            {isevaluateAiAnswereCorrect[index].selectedOption == false && (
              <AiOutlineClose color="red" size="1.5em" />
            )}
          </div>
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
              <div key={option}>
                <input
                  type="radio"
                  id={`q${index}-option${option}`}
                  name={`question-${index}`}
                  value={option}
                  onChange={(e) =>
                    handleAnswerChange(q.id, e.target.value, q.type)
                  }
                />
                <label htmlFor={`q${index}-option${option}`}>{option}</label>
              </div>
            ))}
          {q.type === "multi" &&
            q.options?.map((option) => (
              <div key={option}>
                <input
                  type="checkbox"
                  id={`q${index}-option${option}`}
                  name={`question-${index}`}
                  value={option}
                  onChange={(e) =>
                    handleAnswerChange(q.id, e.target.value, q.type)
                  }
                />
                <label htmlFor={`q${index}-option${option}`}>{option}</label>
              </div>
            ))}
        </div>
      ))}
      {isQuizCompleted && (
        <Popup
          heading="Quiz Result 🎉"
          data={quizResult}
          onClose={() => {
            onQuizCompleted(false);
          }}
        />
      )}
    </div>
  );
};

export default Quiz;
