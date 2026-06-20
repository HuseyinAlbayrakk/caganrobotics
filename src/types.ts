/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Workshop {
  id: string;
  title: string;
  ageGroup: string;
  description: string;
  color: string;
  icon: string; // Lucide icon name
  features: string[];
  gradient: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FeedbackSubmission {
  id: string;
  parentName: string;
  studentName: string;
  studentAge: number;
  phone: string;
  workshopInterest: string;
  message: string;
  date: string;
  isApproved?: boolean; // For listing on the visitors log
}

// Interactive Coding Game States
export type CommandType = 'FORWARD' | 'TURN_RIGHT' | 'TURN_LEFT' | 'LIGHT_ON';

export interface CommandBlock {
  id: string;
  type: CommandType;
  label: string;
  color: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameLevel {
  id: number;
  gridSize: { cols: number; rows: number };
  startPos: Position;
  startDir: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
  targetPos: Position;
  targetLightRequired: boolean;
  obstaclePositions: Position[];
  description: string;
  hint: string;
}
