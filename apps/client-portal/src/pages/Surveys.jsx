import React, { useState } from 'react';
import { BarChart2, Star, CheckCircle, X } from 'lucide-react';
import SurveyForm from '../components/surveys/SurveyForm';

const Surveys = () => {
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [completedSurveys, setCompletedSurveys] = useState([]);

  // Mock surveys data
  const surveys = [
    {
      id: 'SV-2024-001',
      title: 'Purchase Experience Feedback',
      description: 'Please share your feedback about your recent purchase experience',
      type: 'purchase',
      status: 'pending',
      expiresAt: '2024-02-15',
      questions: [
        {
          id: 'q1',
          type: 'rating',
          text: 'How would you rate your overall purchase experience?',
          required: true,
          options: [1, 2, 3, 4, 5]
        },
        {
          id: 'q2',
          type: 'rating',
          text: 'How satisfied are you with the sales representative who assisted you?',
          required: true,
          options: [1, 2, 3, 4, 5]
        },
        {
          id: 'q3',
          type: 'text',
          text: 'What did you like most about your purchase experience?',
          required: false
        },
        {
          id: 'q4',
          type: 'text',
          text: 'What could we improve about our purchase process?',
          required: false
        }
      ]
    },
    {
      id: 'SV-2024-002',
      title: 'Service Experience Feedback',
      description: 'Please share your feedback about your recent service experience',
      type: 'service',
      status: 'pending',
      expiresAt: '2024-02-20',
      questions: [
        {
          id: 'q1',
          type: 'rating',
          text: 'How would you rate your overall service experience?',
          required: true,
          options: [1, 2, 3, 4, 5]
        },
        {
          id: 'q2',
          type: 'rating',
          text: 'How satisfied are you with the technician who assisted you?',
          required: true,
          options: [1, 2, 3, 4, 5]
        },
        {
          id: 'q3',
          type: 'text',
          text: 'What did you like most about your service experience?',
          required: false
        },
        {
          id: 'q4',
          type: 'text',
          text: 'What could we improve about our service process?',
          required: false
        }
      ]
    }
  ];

  const handleTakeSurvey = (survey) => {
    setSelectedSurvey(survey);
    setShowSurveyForm(true);
  };

  const handleSubmitSurvey = (surveyId, responses) => {
    // In a real app, this would submit the survey responses to the server
    console.log('Survey responses:', responses);
    
    // Add to completed surveys
    setCompletedSurveys([...completedSurveys, surveyId]);
    setShowSurveyForm(false);
    
    // Show success message
    alert('Thank you for your feedback!');
  };

  const getStatusBadge = (status, surveyId) => {
    if (completedSurveys.includes(surveyId)) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
    }
    
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Expired</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Surveys</h1>
        <p className="text-gray-500">
          Share your feedback to help us improve
        </p>
      </div>

      {/* Surveys List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Available Surveys</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {surveys.map((survey) => (
            <div key={survey.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <BarChart2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{survey.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{survey.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">Survey #{survey.id}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">Expires: {survey.expiresAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end space-x-2">
                  <div className="mr-4">
                    {getStatusBadge(survey.status, survey.id)}
                  </div>
                  <div>
                    {!completedSurveys.includes(survey.id) && (
                      <button 
                        onClick={() => handleTakeSurvey(survey)}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                      >
                        Take Survey
                      </button>
                    )}
                    
                    {completedSurveys.includes(survey.id) && (
                      <button 
                        disabled
                        className="px-4 py-2 bg-gray-100 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
                      >
                        <CheckCircle className="h-4 w-4 inline-block mr-2" />
                        Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {surveys.length === 0 && (
            <div className="p-8 text-center">
              <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No surveys available</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no surveys available for you at this time.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Survey Form Modal */}
      {selectedSurvey && showSurveyForm && (
        <SurveyForm 
          survey={selectedSurvey} 
          onClose={() => setShowSurveyForm(false)}
          onSubmit={(responses) => handleSubmitSurvey(selectedSurvey.id, responses)}
        />
      )}
    </div>
  );
};

export default Surveys;