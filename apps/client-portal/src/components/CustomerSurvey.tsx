import React, { useState } from 'react';
import { CustomerSurvey } from '@/types';

interface CustomerSurveyProps {
  clientId: string;
  serviceTicketId?: string;
  deliveryId?: string;
  onSubmit: (surveyData: Partial<CustomerSurvey>) => Promise<void>;
}

export function CustomerSurveyForm({ clientId, serviceTicketId, deliveryId, onSubmit }: CustomerSurveyProps) {
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleStarHover = (value: number | null) => {
    setHoveredStar(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }
    
    setLoading(true);
    
    try {
      const surveyData: Partial<CustomerSurvey> = {
        clientId,
        serviceTicketId,
        deliveryId,
        rating,
        comments,
        submittedAt: new Date()
      };
      
      await onSubmit(surveyData);
      setSuccess(true);
      
      // Reset form
      setRating(0);
      setComments('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Feedback</h2>
      </div>

      {success ? (
        <div className="p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 mb-2">Thank You for Your Feedback</h3>
          <p className="text-green-700">
            We appreciate you taking the time to provide your feedback. Your opinion helps us improve our services.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Submit Another Survey
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => handleStarHover(value)}
                  onMouseLeave={() => handleStarHover(null)}
                  className="focus:outline-none"
                >
                  <svg 
                    className={`w-8 h-8 ${
                      (hoveredStar !== null ? value <= hoveredStar : value <= rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {rating === 0 ? 'Select a rating' : 
                 rating === 1 ? 'Poor' :
                 rating === 2 ? 'Fair' :
                 rating === 3 ? 'Good' :
                 rating === 4 ? 'Very Good' : 'Excellent'}
              </span>
            </div>
          </div>
          
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please share your thoughts about our service"
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}