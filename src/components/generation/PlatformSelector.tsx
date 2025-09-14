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
    description: 'Short & punchy',
    details: 'Engaging posts with hashtags',
    icon: '🐦',
    gradient: 'from-blue-400 to-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    hoverColor: 'hover:from-blue-100 hover:to-blue-200',
    selectedGradient: 'from-blue-500 to-blue-700',
    selectedBg: 'bg-gradient-to-br from-blue-100 to-blue-150',
    selectedBorder: 'border-blue-400',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    value: 'linkedin' as const,
    label: 'LinkedIn',
    description: 'Professional',
    details: 'Thought leadership & insights',
    icon: '💼',
    gradient: 'from-blue-600 to-indigo-700',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-900',
    hoverColor: 'hover:from-blue-100 hover:to-indigo-100',
    selectedGradient: 'from-blue-600 to-indigo-700',
    selectedBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    selectedBorder: 'border-blue-500',
    iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-700',
  },
  {
    value: 'instagram' as const,
    label: 'Instagram',
    description: 'Visual-first',
    details: 'Stunning visuals with captions',
    icon: '📸',
    gradient: 'from-pink-500 to-purple-600',
    bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-900',
    hoverColor: 'hover:from-pink-100 hover:to-purple-100',
    selectedGradient: 'from-pink-500 to-purple-600',
    selectedBg: 'bg-gradient-to-br from-pink-100 to-purple-100',
    selectedBorder: 'border-pink-400',
    iconBg: 'bg-gradient-to-br from-pink-500 to-purple-600',
  },
  {
    value: 'blog' as const,
    label: 'Blog',
    description: 'In-depth',
    details: 'Detailed articles & guides',
    icon: '✍️',
    gradient: 'from-green-500 to-teal-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-teal-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    hoverColor: 'hover:from-green-100 hover:to-teal-100',
    selectedGradient: 'from-green-500 to-teal-600',
    selectedBg: 'bg-gradient-to-br from-green-100 to-teal-100',
    selectedBorder: 'border-green-400',
    iconBg: 'bg-gradient-to-br from-green-500 to-teal-600',
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
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {label}
        </Label>
        <p className="text-sm text-gray-600">
          Choose your target platform to optimize content style and format
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const isSelected = field.value === platform.value;
          return (
            <button
              key={platform.value}
              type="button"
              onClick={() => field.onChange(platform.value)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50",
                isSelected 
                  ? `${platform.selectedBg} ${platform.selectedBorder} shadow-lg scale-[1.02]`
                  : `${platform.bgColor} ${platform.borderColor} hover:shadow-md`
              )}
              aria-pressed={isSelected}
              aria-describedby={error ? `${name}-error` : undefined}
            >
              <div className="relative p-6 space-y-3">
                {/* Icon Container */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md mx-auto transition-transform duration-300",
                  platform.iconBg,
                  isSelected ? "scale-110" : "group-hover:scale-105"
                )}>
                  <span className="text-2xl">{platform.icon}</span>
                </div>
                
                {/* Content */}
                <div className="text-center space-y-1">
                  <h3 className={cn("font-bold text-lg", platform.textColor)}>
                    {platform.label}
                  </h3>
                  <div className="flex items-center justify-center space-x-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", 
                      isSelected ? "bg-current opacity-70" : "bg-gray-400"
                    )}></div>
                    <span className={cn("text-sm font-medium",
                      isSelected ? platform.textColor : "text-gray-600"
                    )}>
                      {platform.description}
                    </span>
                  </div>
                  <p className={cn("text-xs leading-relaxed",
                    isSelected ? platform.textColor + " opacity-80" : "text-gray-500"
                  )}>
                    {platform.details}
                  </p>
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm",
                      platform.iconBg
                    )}>
                      <span className="text-sm font-bold">✓</span>
                    </div>
                  </div>
                )}

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