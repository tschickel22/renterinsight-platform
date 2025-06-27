import React, { useState } from 'react';
import { X, Check, Star, AlertCircle } from 'lucide-react';

const SurveyForm = ({ survey, onClose, onSubmit }) => {
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const handleRatingChange = (questionId, rating) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: rating
    }));
    
    // Clear error when field is updated
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: undefined }));
    }
  };

  const handleTextChange = (questionId, text) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: text
    }));
    
    // Clear error when field is updated
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    survey.questions.forEach(question => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = 'This question is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit responses
    onSubmit(responses);
  };

  const StarRating = ({ questionId, value, onChange, required }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(questionId, rating)}
            className={`p-1 focus:outline-none ${value >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{survey.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600">{survey.description}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {survey.questions.map((question) => (
                <div key={question.id} className="border-b border-gray-200 pb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {question.text}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {question.type === 'rating' && (
                    <div>
                      <StarRating 
                        questionId={question.id}
                        value={responses[question.id] || 0}
                        onChange={handleRatingChange}
                        required={question.required}
                      />
                      {errors[question.id] && (
                        <p className="mt-1 text-sm text-red-600">{errors[question.id]}</p>
                      )}
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <div>
                      <textarea
                        value={responses[question.id] || ''}
                        onChange={(e) => handleTextChange(question.id, e.target.value)}
                        rows="3"
                        className={`w-full px-3 py-2 border ${errors[question.id] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        placeholder="Your answer"
                      ></textarea>
                      {errors[question.id] && (
                        <p className="mt-1 text-sm text-red-600">{errors[question.id]}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                <Check className="h-4 w-4 inline-block mr-2" />
                Submit Survey
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;