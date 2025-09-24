import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from 'lucide-react';

const CertificatesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-primary">Certificates</span> & Achievements
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Earn certificates and showcase your learning progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Course Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Earn certificates for completing courses and achieving milestones in your JEE preparation journey.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Test Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get recognized for outstanding performance in mock tests and practice sessions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Streak Master</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Maintain consistent study streaks and earn special achievement badges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;