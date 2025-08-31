import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Star, MessageSquare, ThumbsUp, Award, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FeedbackEntry {
  id: string;
  vehicleNo: string;
  owner: string;
  service: string;
  rating: number;
  comments: string;
  date: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export function Feedback() {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const [feedbackList] = useState<FeedbackEntry[]>([
    {
      id: '1',
      vehicleNo: 'MH12AB1234',
      owner: 'John Doe',
      service: '2W General Service',
      rating: 5,
      comments: 'Excellent service! Very professional and timely. Will definitely come back.',
      date: '2025-08-16',
      status: 'new'
    },
    {
      id: '2',
      vehicleNo: 'MH14CD5678',
      owner: 'Jane Smith',
      service: '4W Full Service',
      rating: 4,
      comments: 'Good service overall, but took a bit longer than expected. Staff was helpful.',
      date: '2025-08-15',
      status: 'acknowledged'
    },
    {
      id: '3',
      vehicleNo: 'MH16EF9012',
      owner: 'Mike Johnson',
      service: 'EV Battery Check',
      rating: 5,
      comments: 'Amazing experience! Very knowledgeable about EV systems.',
      date: '2025-08-14',
      status: 'resolved'
    },
    {
      id: '4',
      vehicleNo: 'MH18GH3456',
      owner: 'Sarah Wilson',
      service: '2W Oil Change',
      rating: 3,
      comments: 'Service was okay, but waiting area could be improved.',
      date: '2025-08-13',
      status: 'acknowledged'
    }
  ]);

  const availableVehicles = [
    { value: 'MH12AB1234', label: 'MH12AB1234 - John Doe' },
    { value: 'MH14CD5678', label: 'MH14CD5678 - Jane Smith' },
    { value: 'MH16EF9012', label: 'MH16EF9012 - Mike Johnson' },
    { value: 'MH18GH3456', label: 'MH18GH3456 - Sarah Wilson' },
    { value: 'MH20IJ7890', label: 'MH20IJ7890 - Alex Brown' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle || rating === 0) {
      toast.error('Please select a vehicle and provide a rating');
      return;
    }

    // Simulate submission
    toast.success('Feedback submitted successfully! Thank you for your input.');
    
    // Reset form
    setSelectedVehicle('');
    setRating(0);
    setComments('');
  };

  const StarRating = ({ value, onSelect, readonly = false }: { value: number, onSelect?: (rating: number) => void, readonly?: boolean }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            onClick={() => !readonly && onSelect?.(star)}
            disabled={readonly}
          >
            <Star 
              className={`h-6 w-6 ${
                star <= value 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'acknowledged': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const averageRating = feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbackList.length;
  const ratingsDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbackList.filter(f => f.rating === rating).length,
    percentage: (feedbackList.filter(f => f.rating === rating).length / feedbackList.length) * 100
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Feedback</h1>
        <p className="text-gray-600 mt-1">Collect and manage customer feedback to improve service quality</p>
      </div>

      {/* Feedback Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              <StarRating value={Math.round(averageRating)} readonly />
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{feedbackList.length}</div>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Total Feedback
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {feedbackList.filter(f => f.rating >= 4).length}
            </div>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              Positive Reviews
            </p>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">95%</div>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Satisfaction Rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Feedback Form */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#036b61]" />
              Submit New Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Vehicle</label>
                <Select onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose vehicle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.value} value={vehicle.value}>
                        {vehicle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rating *</label>
                <StarRating value={rating} onSelect={setRating} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Comments</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#036b61] to-[#4aa370] text-white hover:shadow-lg transition-all"
              >
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#036b61]" />
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingsDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#036b61] to-[#4aa370] h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#036b61]" />
              Recent Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {feedbackList.slice(0, 3).map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="text-sm">
                      <p className="font-medium">{feedback.vehicleNo}</p>
                      <p className="text-gray-600">{feedback.owner}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs border ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </div>
                  </div>
                  
                  <StarRating value={feedback.rating} readonly />
                  
                  <p className="text-sm text-gray-700">{feedback.comments}</p>
                  
                  <p className="text-xs text-gray-500">
                    {new Date(feedback.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Feedback */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>All Customer Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbackList.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-4">
                      <h3 className="font-medium">{feedback.vehicleNo}</h3>
                      <StarRating value={feedback.rating} readonly />
                    </div>
                    <p className="text-sm text-gray-600">{feedback.owner} • {feedback.service}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(feedback.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm">{feedback.comments}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}