'use client';

import React from 'react';
import { useController, Control, FieldPath } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { GenerationFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface ToneSelectorProps {
  control: Control<GenerationFormData>;
  name: FieldPath<GenerationFormData>;
  label?: string;
  className?: string;
}

const tones = [
  {
    value: 'professional' as const,
    label: 'Professional',
    description: 'Formal & business',
    example: 'Industry insights and expert analysis',
    icon: '💼',
    gradient: 'from-slate-600 to-gray-700',
    bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-900',
    hoverColor: 'hover:from-slate-100 hover:to-gray-100',
    selectedGradient: 'from-slate-600 to-gray-700',
    selectedBg: 'bg-gradient-to-br from-slate-100 to-gray-100',
    selectedBorder: 'border-slate-400',
    iconBg: 'bg-gradient-to-br from-slate-600 to-gray-700',
  },
  {
    value: 'casual' as const,
    label: 'Casual',
    description: 'Friendly & approachable',
    example: 'Like chatting with a close friend',
    icon: '😊',
    gradient: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-900',
    hoverColor: 'hover:from-blue-100 hover:to-cyan-100',
    selectedGradient: 'from-blue-500 to-cyan-600',
    selectedBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    selectedBorder: 'border-blue-400',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  },
  {
    value: 'playful' as const,
    label: 'Playful',
    description: 'Fun & energetic',
    example: 'Vibrant with humor and emojis',
    icon: '🎉',
    gradient: 'from-purple-500 to-pink-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-900',
    hoverColor: 'hover:from-purple-100 hover:to-pink-100',
    selectedGradient: 'from-purple-500 to-pink-600',
    selectedBg: 'bg-gradient-to-br from-purple-100 to-pink-100',
    selectedBorder: 'border-purple-400',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
  },
  {
    value: 'authoritative' as const,
    label: 'Authoritative',
    description: 'Expert & confident',
    example: 'Thought leadership and expertise',
    icon: '🎯',
    gradient: 'from-emerald-600 to-teal-700',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-900',
    hoverColor: 'hover:from-emerald-100 hover:to-teal-100',
    selectedGradient: 'from-emerald-600 to-teal-700',
    selectedBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    selectedBorder: 'border-emerald-400',
    iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-700',
  },
];

export function ToneSelector({ 
  control, 
  name, 
  label = "Tone", 
  className 
}: ToneSelectorProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {label}
        </Label>
        <p className="text-sm text-gray-600">
          Select the tone that matches your brand voice and target audience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tones.map((tone) => {
          const isSelected = field.value === tone.value;
          return (
            <button
              key={tone.value}
              type="button"
              onClick={() => field.onChange(tone.value)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50",
                isSelected 
                  ? `${tone.selectedBg} ${tone.selectedBorder} shadow-lg scale-[1.02]`
                  : `${tone.bgColor} ${tone.borderColor} hover:shadow-md`
              )}
              aria-pressed={isSelected}
              aria-describedby={error ? `${name}-error` : undefined}
            >
              <div className="relative p-5 space-y-3">
                {/* Header with Icon and Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300",
                      tone.iconBg,
                      isSelected ? "scale-110" : "group-hover:scale-105"
                    )}>
                      <span className="text-xl">{tone.icon}</span>
                    </div>
                    <div>
                      <h3 className={cn("font-bold text-lg", tone.textColor)}>
                        {tone.label}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full", 
                          isSelected ? "bg-current opacity-70" : "bg-gray-400"
                        )}></div>
                        <span className={cn("text-sm font-medium",
                          isSelected ? tone.textColor : "text-gray-600"
                        )}>
                          {tone.description}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm",
                      tone.iconBg
                    )}>
                      <span className="text-sm font-bold">✓</span>
                    </div>
                  )}
                </div>
                
                {/* Example */}
                <div className={cn(
                  "bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/50",
                  isSelected && "bg-white/70"
                )}>
                  <p className={cn("text-xs italic leading-relaxed",
                    isSelected ? tone.textColor + " opacity-80" : "text-gray-600"
                  )}>
                    "{tone.example}"
                  </p>
                </div>

                {/* Animated background effect */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  !isSelected && "bg-gradient-to-br from-white/10 to-white/5"
                )}></div>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <span className="text-sm">⚠️</span>
          <p 
            id={`${name}-error`}
            className="text-sm font-medium" 
            role="alert"
          >
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}