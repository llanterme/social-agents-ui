'use client';

import React from 'react';
import { useController, Control, FieldPath } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GenerationFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface ImageCountSelectorProps {
  control: Control<GenerationFormData>;
  name: FieldPath<GenerationFormData>;
  label?: string;
  className?: string;
}

const imageOptions = [
  {
    count: 1,
    label: '1 Image',
    description: 'Single focused visual',
    icon: '🖼️',
    visualBlocks: ['bg-gradient-to-br from-blue-400 to-blue-600'],
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    selectedBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    selectedBorder: 'border-blue-400',
  },
  {
    count: 2,
    label: '2 Images',
    description: 'Comparison set',
    icon: '🖼️',
    visualBlocks: [
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600'
    ],
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    selectedBg: 'bg-gradient-to-br from-purple-100 to-pink-100',
    selectedBorder: 'border-purple-400',
  },
  {
    count: 3,
    label: '3 Images',
    description: 'Story sequence',
    icon: '🖼️',
    visualBlocks: [
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-cyan-400 to-cyan-600'
    ],
    bgColor: 'bg-gradient-to-br from-green-50 to-cyan-50',
    borderColor: 'border-green-200',
    selectedBg: 'bg-gradient-to-br from-green-100 to-cyan-100',
    selectedBorder: 'border-green-400',
  },
  {
    count: 4,
    label: '4 Images',
    description: 'Complete gallery',
    icon: '🖼️',
    visualBlocks: [
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-rose-400 to-rose-600',
      'bg-gradient-to-br from-amber-400 to-amber-600'
    ],
    bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
    selectedBg: 'bg-gradient-to-br from-orange-100 to-amber-100',
    selectedBorder: 'border-orange-400',
  },
];

export function ImageCountSelector({ 
  control, 
  name, 
  label = "Number of Images", 
  className 
}: ImageCountSelectorProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: 1,
  });

  const handleIncrement = () => {
    const currentValue = Number(field.value) || 1;
    const newValue = Math.min(currentValue + 1, 4);
    field.onChange(newValue);
  };

  const handleDecrement = () => {
    const currentValue = Number(field.value) || 1;
    const newValue = Math.max(currentValue - 1, 1);
    field.onChange(newValue);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <Label className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {label}
        </Label>
        <p className="text-sm text-gray-600">
          Select how many AI-generated images to create for your content
        </p>
      </div>

      {/* Enhanced Visual Counter */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-center space-x-6">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={Number(field.value) <= 1}
            aria-label="Decrease image count"
            className="h-12 w-12 rounded-xl border-2 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="text-lg font-bold">−</span>
          </Button>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {field.value || 1}
              </span>
              <span className="text-lg text-gray-600 font-medium">
                {field.value === 1 ? 'image' : 'images'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {field.value === 1 && 'Perfect for focused content'}
              {field.value === 2 && 'Great for comparisons'}
              {field.value === 3 && 'Ideal for storytelling'}
              {field.value === 4 && 'Maximum variety'}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={Number(field.value) >= 4}
            aria-label="Increase image count"
            className="h-12 w-12 rounded-xl border-2 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="text-lg font-bold">+</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Option Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {imageOptions.map((option) => {
          const isSelected = field.value === option.count;
          return (
            <button
              key={option.count}
              type="button"
              onClick={() => field.onChange(option.count)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50 p-4",
                isSelected 
                  ? `${option.selectedBg} ${option.selectedBorder} shadow-lg scale-[1.02]`
                  : `${option.bgColor} ${option.borderColor} hover:shadow-md`
              )}
              aria-pressed={isSelected}
              aria-describedby={error ? `${name}-error` : undefined}
            >
              <div className="space-y-3">
                {/* Visual Block Grid */}
                <div className="flex justify-center">
                  <div className={cn(
                    "grid gap-1 transition-transform duration-300",
                    option.count === 1 && "grid-cols-1",
                    option.count === 2 && "grid-cols-2",
                    option.count === 3 && "grid-cols-3",
                    option.count === 4 && "grid-cols-2 grid-rows-2",
                    isSelected ? "scale-110" : "group-hover:scale-105"
                  )}>
                    {option.visualBlocks.map((blockColor, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-6 h-6 rounded shadow-sm",
                          blockColor
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Label and Description */}
                <div className="text-center space-y-1">
                  <div className="font-bold text-sm text-gray-900">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {option.description}
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                )}
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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-2">
          <span className="text-blue-600 text-lg">💡</span>
          <div>
            <p className="text-sm text-blue-800 font-medium">Pro tip</p>
            <p className="text-xs text-blue-700 leading-relaxed mt-1">
              More images provide variety and visual interest, but take longer to generate. Start with 1-2 for quick results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}