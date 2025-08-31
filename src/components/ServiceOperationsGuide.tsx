import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Clock, 
  CheckCircle2, 
  Users, 
  Wrench, 
  AlertTriangle, 
  Star, 
  TrendingUp, 
  Shield,
  Phone,
  FileText,
  Target,
  Zap,
  Award,
  BookOpen,
  Video,
  MessageSquare
} from 'lucide-react';

interface BestPractice {
  title: string;
  description: string;
  icon: any;
  category: 'efficiency' | 'quality' | 'customer' | 'safety';
  tips: string[];
  importance: 'high' | 'medium' | 'low';
}

interface ServiceTip {
  title: string;
  description: string;
  timeToComplete: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  steps: string[];
}

export function ServiceOperationsGuide() {
  const [activeTab, setActiveTab] = useState('best-practices');

  const bestPractices: BestPractice[] = [
    {
      title: 'Quick Vehicle Check-in Process',
      description: 'Streamline customer reception and initial assessment',
      icon: Clock,
      category: 'efficiency',
      importance: 'high',
      tips: [
        'Greet customer within 30 seconds of arrival',
        'Use QR code for quick vehicle identification',
        'Complete initial inspection in 5 minutes',
        'Explain estimated time and cost upfront',
        'Provide service token with clear timeline'
      ]
    },
    {
      title: 'Quality Inspection Standards',
      description: 'Ensure consistent high-quality service delivery',
      icon: CheckCircle2,
      category: 'quality',
      importance: 'high',
      tips: [
        'Follow 25-point inspection checklist',
        'Take before/after photos for transparency',
        'Use original/certified spare parts only',
        'Double-check all work before handover',
        'Test drive after major repairs'
      ]
    },
    {
      title: 'Customer Communication Excellence',
      description: 'Build trust through clear and proactive communication',
      icon: Users,
      category: 'customer',
      importance: 'high',
      tips: [
        'Send WhatsApp updates at key milestones',
        'Explain technical issues in simple terms',
        'Call if repair time exceeds estimate',
        'Share photos of identified problems',
        'Confirm completion before calling customer'
      ]
    },
    {
      title: 'Workshop Safety Protocols',
      description: 'Maintain safe working environment for all',
      icon: Shield,
      category: 'safety',
      importance: 'high',
      tips: [
        'Wear safety gear at all times',
        'Keep work area clean and organized',
        'Proper handling of oils and chemicals',
        'Fire extinguisher accessibility check',
        'First aid kit readily available'
      ]
    },
    {
      title: 'Green Coins Program Optimization',
      description: 'Maximize customer engagement with rewards',
      icon: Award,
      category: 'customer',
      importance: 'medium',
      tips: [
        'Explain green coins benefits to every customer',
        'Update kilometers accurately for fair rewards',
        'Promote referral bonuses actively',
        'Suggest services when coins are sufficient',
        'Track and celebrate customer milestones'
      ]
    },
    {
      title: 'Efficient Parts Management',
      description: 'Optimize inventory and reduce wait times',
      icon: Wrench,
      category: 'efficiency',
      importance: 'medium',
      tips: [
        'Maintain stock of common spare parts',
        'Build relationships with reliable suppliers',
        'Use genuine parts verification methods',
        'Keep digital catalog for quick reference',
        'Negotiate bulk purchase discounts'
      ]
    }
  ];

  const quickTips: ServiceTip[] = [
    {
      title: 'Fast Engine Oil Change',
      description: 'Complete oil change service in 15 minutes',
      timeToComplete: '15 mins',
      difficulty: 'easy',
      steps: [
        'Warm up engine for 2-3 minutes',
        'Position drain pan accurately',
        'Remove drain plug and filter simultaneously',
        'Clean drain plug and check washer',
        'Install new filter with thin oil layer',
        'Add new oil gradually, check level',
        'Reset service indicator if applicable'
      ]
    },
    {
      title: 'Brake System Quick Check',
      description: 'Comprehensive brake inspection in 10 minutes',
      timeToComplete: '10 mins',
      difficulty: 'medium',
      steps: [
        'Check brake fluid level and color',
        'Inspect brake pads through wheel spokes',
        'Test brake pedal feel and travel',
        'Check for brake disc wear/scoring',
        'Verify parking brake adjustment',
        'Road test for pulling or noise'
      ]
    },
    {
      title: 'Battery Health Assessment',
      description: 'Complete battery check and maintenance',
      timeToComplete: '8 mins',
      difficulty: 'easy',
      steps: [
        'Visual inspection for corrosion/damage',
        'Clean terminals with wire brush',
        'Test voltage with multimeter',
        'Check electrolyte level (if serviceable)',
        'Test charging rate with engine running',
        'Recommend replacement if needed'
      ]
    }
  ];

  const troubleshootingGuide = [
    {
      problem: 'Customer Complaint: Engine Overheating',
      diagnosis: [
        'Check coolant level and condition',
        'Inspect radiator for blockages',
        'Test thermostat operation',
        'Check fan belt tension',
        'Verify water pump operation'
      ],
      solution: 'Address root cause, not just symptoms. Always road test after repair.'
    },
    {
      problem: 'Customer Complaint: Poor Fuel Economy',
      diagnosis: [
        'Check air filter condition',
        'Inspect fuel injectors for clogs',
        'Test oxygen sensor readings',
        'Verify tire pressure',
        'Check engine timing'
      ],
      solution: 'Multiple factors contribute. Address all findings for best results.'
    },
    {
      problem: 'Customer Complaint: Unusual Noise',
      diagnosis: [
        'Identify noise location and type',
        'Check during idle vs acceleration',
        'Inspect belt and pulley systems',
        'Listen to engine, transmission, brakes',
        'Test drive to replicate conditions'
      ],
      solution: 'Accurate diagnosis prevents comebacks. Take time to identify source.'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'efficiency': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'quality': return 'bg-green-100 text-green-700 border-green-200';
      case 'customer': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'safety': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl text-gray-900 mb-4">
          Service Center Operations Guide
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Best practices, quick tips, and troubleshooting guide for efficient service center operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div className="text-2xl font-bold text-gray-900">{bestPractices.length}</div>
            </div>
            <div className="text-sm text-gray-600">Best Practices</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold text-gray-900">{quickTips.length}</div>
            </div>
            <div className="text-sm text-gray-600">Quick Tips</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div className="text-2xl font-bold text-gray-900">{troubleshootingGuide.length}</div>
            </div>
            <div className="text-sm text-gray-600">Common Issues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold text-gray-900">24/7</div>
            </div>
            <div className="text-sm text-gray-600">Support Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="best-practices" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Best Practices
          </TabsTrigger>
          <TabsTrigger value="quick-tips" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Tips
          </TabsTrigger>
          <TabsTrigger value="troubleshooting" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Troubleshooting
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Support
          </TabsTrigger>
        </TabsList>

        {/* Best Practices Tab */}
        <TabsContent value="best-practices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bestPractices.map((practice, index) => {
              const IconComponent = practice.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-[#c56321] to-[#088145] rounded-lg text-white">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{practice.title}</CardTitle>
                          <CardDescription>{practice.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getCategoryColor(practice.category)}>
                          {practice.category}
                        </Badge>
                        <Badge variant={practice.importance === 'high' ? 'destructive' : 'secondary'}>
                          {practice.importance} priority
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">Implementation Tips:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {practice.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Quick Tips Tab */}
        <TabsContent value="quick-tips" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {quickTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                    <div className="flex flex-col gap-1 text-right">
                      <Badge className={getDifficultyColor(tip.difficulty)}>
                        {tip.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {tip.timeToComplete}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{tip.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-900">Step-by-step:</h4>
                    <ol className="text-sm text-gray-600 space-y-2">
                      {tip.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Troubleshooting Tab */}
        <TabsContent value="troubleshooting" className="space-y-6">
          <div className="space-y-6">
            {troubleshootingGuide.map((guide, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    {guide.problem}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-3">Diagnostic Steps:</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {guide.diagnosis.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-3">Solution Approach:</h4>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">{guide.solution}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Emergency Support
                </CardTitle>
                <CardDescription>24/7 technical assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Tech Support Hotline</div>
                    <div className="text-sm text-gray-600">+91 8888-555-777</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">WhatsApp Support</div>
                    <div className="text-sm text-gray-600">+91 9999-444-888</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-600" />
                  Training Resources
                </CardTitle>
                <CardDescription>Skill development and certification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Service Manual Downloads
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Video Training Library
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Certification Programs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Support Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm text-gray-600">24/7 Available</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-sm text-gray-600">6 AM - 10 PM</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">Email Support</div>
                  <div className="text-sm text-gray-600">Response within 2 hours</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">On-site Visit</div>
                  <div className="text-sm text-gray-600">Same day if critical</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}