"use client";
import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  XCircle,
  Lightbulb,
  Timer
} from "lucide-react";
import Link from "next/link";
// import { createPageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import QuizQuestion from "@/components/games/quizquestion";

const questions = [
  {
    id: 1,
    question: "What percentage of the Earth's water is freshwater?",
    options: ["97%", "50%", "25%", "3%"],
    correct: 3,
    explanation: "Only about 3% of Earth's water is freshwater, and most of that is frozen in ice caps and glaciers."
  },
  {
    id: 2,
    question: "Which gas is the primary contributor to global warming?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
    correct: 1,
    explanation: "Carbon dioxide is the main greenhouse gas contributing to global warming from human activities."
  },
  {
    id: 3,
    question: "How long does it take for a plastic bottle to decompose?",
    options: ["1 year", "10 years", "100 years", "450 years"],
    correct: 3,
    explanation: "A plastic bottle can take up to 450 years to completely decompose in the environment."
  },
  {
    id: 4,
    question: "What is the most renewable energy source?",
    options: ["Solar", "Wind", "Geothermal", "All are equally renewable"],
    correct: 3,
    explanation: "All of these are renewable energy sources as they can be naturally replenished continuously."
  },
  {
    id: 5,
    question: "Which activity saves the most water?",
    options: ["Taking shorter showers", "Fixing leaky faucets", "Using dishwasher only when full", "All save significant water"],
    correct: 3,
    explanation: "All these activities can save significant amounts of water when practiced consistently."
  },
  {
    id: 6,
    question: "What percentage of global greenhouse gas emissions come from transportation?",
    options: ["5%", "14%", "28%", "45%"],
    correct: 1,
    explanation: "Transportation accounts for about 14% of global greenhouse gas emissions."
  },
  {
    id: 7,
    question: "Which material can be recycled indefinitely without losing quality?",
    options: ["Paper", "Plastic", "Glass", "Aluminum"],
    correct: 3,
    explanation: "Aluminum can be recycled indefinitely without losing its properties or quality."
  },
  {
    id: 8,
    question: "How many trees does it take to make one ton of paper?",
    options: ["5 trees", "12 trees", "24 trees", "50 trees"],
    correct: 2,
    explanation: "It takes approximately 24 trees to make one ton of paper."
  },
  {
    id: 9,
    question: "What is the largest source of ocean plastic pollution?",
    options: ["Straws", "Bottles", "Fishing gear", "Food packaging"],
    correct: 2,
    explanation: "Abandoned fishing gear (ghost nets) makes up nearly half of ocean plastic pollution."
  },
  {
    id: 10,
    question: "Which country produces the most renewable energy?",
    options: ["USA", "Germany", "China", "Denmark"],
    correct: 2,
    explanation: "China is the world's largest producer of renewable energy, particularly solar and wind power."
  }
];

export default function EcoQuiz() {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('intro'); // intro, playing, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOverData, setGameOverData] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    // no-op — api routes handle auth internally
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setCorrectAnswers(0);
    setShowExplanation(false);
    setAnswers([]);
  };

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    const points = isCorrect ? 10 : 0;

    if (isCorrect) {
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    }

    setAnswers(prev => [...prev, {
      question: questions[currentQuestion],
      selected: answerIndex,
      correct: isCorrect,
      points
    }]);

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setGameState('results');
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const finalScore = score;
    try {
      const session = await api.createGameSession("ECO_QUIZ");
      await api.completeGameSession(session.id, finalScore, "COMPLETED");
      setGameOverData({ score: finalScore, accuracy, correctAnswers, totalQuestions: questions.length, answers });
    } catch (error) {
      console.error('Error saving game results:', error);
      setGameOverData({ score: finalScore, accuracy, correctAnswers, totalQuestions: questions.length, answers });
    }
  };

  const restartGame = () => {
    setGameState('intro');
    setGameOverData(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>


          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center">
              <Brain className="w-7 h-7 text-purple-600" />
              Eco Knowledge Challenge
            </h1>
          </div>

          <div className="text-right">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Brain className="w-5 h-5 mr-2" />
              {score} pts
            </Badge>
          </div>
        </div>

        {/* Game Content */}
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-12 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent>
                  <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Brain className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Test Your Eco Knowledge!</h2>
                  <p className="text-xl mb-6 text-purple-100">
                    Answer {questions.length} questions about the environment and sustainability!
                  </p>
                  <div className="space-y-2 mb-8">
                    <p className="text-purple-100">🧠 Learn fascinating environmental facts</p>
                    <p className="text-pink-100">🌍 Test your knowledge on climate, recycling, and more</p>
                    <p className="text-purple-100">🏆 Earn points for correct answers</p>
                  </div>
                  <Button onClick={startGame} size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {gameState === 'playing' && questions[currentQuestion] && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Progress */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">
                      {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>

              {/* Current Question */}
              <QuizQuestion
                question={questions[currentQuestion]}
                questionNumber={currentQuestion + 1}
                selectedAnswer={selectedAnswer}
                showExplanation={showExplanation}
                onAnswer={handleAnswer}
                onNext={nextQuestion}
              />
            </motion.div>
          )}

          {gameState === 'results' && gameOverData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Results Summary */}
              <Card className="text-center p-8">
                <CardContent>
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    Quiz Complete! 🎉
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    You scored {gameOverData.correctAnswers} out of {gameOverData.totalQuestions} questions correctly!
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {gameOverData.accuracy}%
                      </div>
                      <div className="text-sm text-purple-700">Accuracy</div>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <div className="text-3xl font-bold text-pink-600">
                        {gameOverData.score}
                      </div>
                      <div className="text-sm text-pink-700">Points Earned</div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button onClick={restartGame} className="bg-purple-600 hover:bg-purple-700">
                      Try Again
                    </Button>
                    <Link href="/games">
                      <Button variant="outline">Back to Games</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}