import React from 'react';
import { CheckCircle, Circle, Clock, ArrowRight } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={`${step.id}-${index}`}
          className={`glass glass-hover rounded-xl p-4 cursor-pointer transition-all duration-300 ${
            currentStep === step.id
              ? 'border-purple-500/50 glow'
              : 'border-transparent'
          }`}
          onClick={() => onStepClick(step.id)}
        >
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              step.status === 'completed' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : step.status === 'in-progress'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                : 'bg-gray-600'
            }`}>
              {step.status === 'completed' ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : step.status === 'in-progress' ? (
                <Clock className="w-4 h-4 text-white" />
              ) : (
                <Circle className="w-4 h-4 text-gray-300" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-medium text-sm truncate ${
                  currentStep === step.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {step.title}
                </h3>
                {currentStep === step.id && (
                  <ArrowRight className="w-3 h-3 text-purple-400" />
                )}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {step.description}
              </p>
              
              {/* Progress indicator */}
              {step.status === 'in-progress' && (
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {steps.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm">No steps available yet</p>
          <p className="text-gray-500 text-xs mt-1">Steps will appear as AI generates your website</p>
        </div>
      )}
    </div>
  );
}