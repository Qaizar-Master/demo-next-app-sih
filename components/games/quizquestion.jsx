import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function QuizQuestion({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  showExplanation, 
  onAnswer, 
  onNext 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Question {questionNumber}
          </CardTitle>
          <p className="text-lg text-gray-700 mt-4">
            {question.question}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => onAnswer(index)}
                disabled={selectedAnswer !== null}
                whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                className={`p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === null
                    ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    : selectedAnswer === index
                    ? index === question.correct
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : index === question.correct
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {selectedAnswer !== null && (
                    <div>
                      {index === question.correct && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                      {selectedAnswer === index && index !== question.correct && (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Did you know?</h4>
                  <p className="text-blue-700">{question.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="text-center pt-4">
              <Button 
                onClick={onNext}
                className="bg-purple-600 hover:bg-purple-700 px-8"
              >
                {questionNumber < 10 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}