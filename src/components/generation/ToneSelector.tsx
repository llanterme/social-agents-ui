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
    description: 'Formal and business-appropriate',
    icon: '👔',
    example: 'Industry insights and expert analysis',
    color: 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100',
    selectedColor: 'bg-slate-100 border-slate-500 ring-2 ring-slate-200',
  },
  {
    value: 'casual' as const,
    label: 'Casual',
    description: 'Friendly and conversational',
    icon: '😊',
    example: 'Like chatting with a friend',
    color: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100',
    selectedColor: 'bg-blue-100 border-blue-500 ring-2 ring-blue-200',
  },
  {
    value: 'playful' as const,
    label: 'Playful',
    description: 'Fun and engaging',
    icon: '🎉',
    example: 'Energetic with humor and emojis',
    color: 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100',
    selectedColor: 'bg-purple-100 border-purple-500 ring-2 ring-purple-200',
  },
  {
    value: 'authoritative' as const,
    label: 'Authoritative',
    description: 'Expert and confident',
    icon: '🎯',
    example: 'Thought leadership and expertise',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100',
    selectedColor: 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-200',
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
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
      </Label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tones.map((tone) => (
          <button
            key={tone.value}
            type="button"
            onClick={() => field.onChange(tone.value)}
            className={cn(
              "relative flex items-start p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              field.value === tone.value 
                ? tone.selectedColor 
                : tone.color
            )}
            aria-pressed={field.value === tone.value}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <div className="text-xl mr-3 mt-0.5">{tone.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{tone.label}</div>
                {field.value === tone.value && (
                  <div className="text-xs ml-2">✓</div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {tone.description}
              </div>
              <div className="text-xs text-muted-foreground/80 mt-1 italic">
                {tone.example}
              </div>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <p 
          id={`${name}-error`}
          className="text-sm text-destructive" 
          role="alert"
        >
          {error.message}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Select the tone that best matches your brand voice and target audience.
      </p>
    </div>
  );
}