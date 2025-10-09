import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface StudentProfile {
  strengths: string[];
  weaknesses: string[];
  studyHours: number;
  examDate: string;
  preferredTime: string;
  learningStyle: string;
}

interface PlannerProps {
  studentProfile: StudentProfile;
  currentWeek: {
    completed: number;
    total: number;
    targets: { subject: string; topic: string; status: string; time: string }[];
  };
  adaptiveRecommendations: {
    type: string;
    title: string;
    description: string;
    action: string;
    priority: string;
  }[];
}

const AIStudyPlanner = ({
  studentProfile,
  currentWeek,
  adaptiveRecommendations,
}: PlannerProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-bold text-lg">Personal Learning Profile</h2>
        </CardHeader>
        <CardContent>
          <div>
            <strong>Strengths:</strong> {studentProfile.strengths.join(", ")}<br />
            <strong>Weaknesses:</strong> {studentProfile.weaknesses.join(", ")}<br />
            <strong>Study Hours:</strong> {studentProfile.studyHours}<br />
            <strong>Exam Date:</strong> {studentProfile.examDate}<br />
            <strong>Preferred Time:</strong> {studentProfile.preferredTime}<br />
            <strong>Learning Style:</strong> {studentProfile.learningStyle}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-bold text-lg">This Week's Targets</h2>
        </CardHeader>
        <CardContent>
          <div>
            <strong>Completed:</strong> {currentWeek.completed} / {currentWeek.total}
            <ul className="mt-2">
              {currentWeek.targets.map((target, idx) => (
                <li key={idx}>
                  <strong>{target.subject}</strong> - {target.topic} ({target.status}, {target.time})
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-bold text-lg">Adaptive Recommendations</h2>
        </CardHeader>
        <CardContent>
          <ul>
            {adaptiveRecommendations.map((rec, idx) => (
              <li key={idx} className="mb-2">
                <strong>{rec.title}</strong>: {rec.description}<br />
                <em>Action:</em> {rec.action}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIStudyPlanner;
