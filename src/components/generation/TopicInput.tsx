'use client';

import React from 'react';
import { useController, Control, FieldPath } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GenerationFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface TopicInputProps {
  control: Control<GenerationFormData>;
  name: FieldPath<GenerationFormData>;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function TopicInput({ 
  control, 
  name, 
  label = "Topic", 
  placeholder = "What would you like to create content about?",
  className 
}: TopicInputProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  const maxLength = 200;
  const currentLength = String(field.value || '').length;
  const isNearLimit = currentLength > maxLength * 0.8; // Show warning at 80%
  const isAtLimit = currentLength >= maxLength;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={name} className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {label}
          </Label>
          <div className={cn(
            "text-sm font-medium px-3 py-1 rounded-full transition-colors",
            isAtLimit 
              ? "bg-red-100 text-red-700 border border-red-200" 
              : isNearLimit 
                ? "bg-amber-100 text-amber-700 border border-amber-200" 
                : "bg-gray-100 text-gray-600 border border-gray-200"
          )}>
            {currentLength}/{maxLength}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Describe your topic clearly and specifically for the best AI-generated content
        </p>
      </div>
      
      <div className="relative">
        <Input
          {...field}
          id={name}
          type="text"
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            "h-14 px-6 text-lg rounded-2xl border-2 transition-all duration-300 bg-white placeholder:text-gray-400 focus:bg-white focus:shadow-lg focus:scale-[1.01]",
            error 
              ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-400" 
              : isAtLimit 
                ? "border-amber-300 focus-visible:ring-amber-200 focus-visible:border-amber-400"
                : "border-gray-200 focus-visible:ring-blue-200 focus-visible:border-blue-400 hover:border-gray-300"
          )}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-medium text-sm">Input Error</p>
            <p 
              id={`${name}-error`}
              className="text-sm" 
              role="alert"
            >
              {error.message}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Pro Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-600 text-lg">✨</span>
          <div className="space-y-2">
            <p className="text-sm text-blue-800 font-medium">Make your topic shine</p>
            <div className="text-xs text-blue-700 space-y-1">
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Be specific: "AI in healthcare diagnostics" vs "AI"</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Include context: "Benefits of remote work for startups"</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Target audience: "Beginner's guide to..." or "Advanced..."</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}