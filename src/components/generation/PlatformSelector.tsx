'use client';

import React from 'react';
import { useController, Control, FieldPath } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { GenerationFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  control: Control<GenerationFormData>;
  name: FieldPath<GenerationFormData>;
  label?: string;
  className?: string;
}

const platforms = [
  {
    value: 'twitter' as const,
    label: 'Twitter',
    description: 'Short-form posts with hashtags',
    icon: '𝕏',
    color: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100',
    selectedColor: 'bg-blue-100 border-blue-500 ring-2 ring-blue-200',
  },
  {
    value: 'linkedin' as const,
    label: 'LinkedIn',
    description: 'Professional content and articles',
    icon: '💼',
    color: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100',
    selectedColor: 'bg-blue-100 border-blue-600 ring-2 ring-blue-200',
  },
  {
    value: 'instagram' as const,
    label: 'Instagram',
    description: 'Visual-focused posts with captions',
    icon: '📸',
    color: 'bg-pink-50 border-pink-200 text-pink-900 hover:bg-pink-100',
    selectedColor: 'bg-pink-100 border-pink-500 ring-2 ring-pink-200',
  },
  {
    value: 'blog' as const,
    label: 'Blog',
    description: 'Long-form articles and posts',
    icon: '📝',
    color: 'bg-green-50 border-green-200 text-green-900 hover:bg-green-100',
    selectedColor: 'bg-green-100 border-green-500 ring-2 ring-green-200',
  },
];

export function PlatformSelector({ 
  control, 
  name, 
  label = "Platform", 
  className 
}: PlatformSelectorProps) {
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {platforms.map((platform) => (
          <button
            key={platform.value}
            type="button"
            onClick={() => field.onChange(platform.value)}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              field.value === platform.value 
                ? platform.selectedColor 
                : platform.color
            )}
            aria-pressed={field.value === platform.value}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <div className="text-2xl mb-2">{platform.icon}</div>
            <div className="text-sm font-medium text-center">{platform.label}</div>
            <div className="text-xs text-center text-muted-foreground mt-1">
              {platform.description}
            </div>
            
            {field.value === platform.value && (
              <div className="absolute top-2 right-2 text-xs">✓</div>
            )}
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
        Choose the platform where you plan to publish your content. This affects the style and format.
      </p>
    </div>
  );
}