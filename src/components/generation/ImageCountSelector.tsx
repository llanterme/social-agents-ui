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
    description: 'Single focused image',
    icon: '🖼️',
  },
  {
    count: 2,
    label: '2 Images',
    description: 'Comparison or sequence',
    icon: '🖼️🖼️',
  },
  {
    count: 3,
    label: '3 Images',
    description: 'Step-by-step or variety',
    icon: '🖼️🖼️🖼️',
  },
  {
    count: 4,
    label: '4 Images',
    description: 'Comprehensive set',
    icon: '🖼️🖼️🖼️🖼️',
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
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
      </Label>

      {/* Counter Controls */}
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={Number(field.value) <= 1}
          aria-label="Decrease image count"
          className="h-8 w-8"
        >
          -
        </Button>
        
        <div className="flex items-center justify-center min-w-[120px]">
          <span className="text-2xl font-mono font-semibold">
            {field.value || 1}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            {field.value === 1 ? 'image' : 'images'}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={Number(field.value) >= 4}
          aria-label="Increase image count"
          className="h-8 w-8"
        >
          +
        </Button>
      </div>

      {/* Option Cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {imageOptions.map((option) => (
          <button
            key={option.count}
            type="button"
            onClick={() => field.onChange(option.count)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              field.value === option.count
                ? "bg-primary/10 border-primary text-primary"
                : "bg-background border-border hover:bg-accent hover:text-accent-foreground"
            )}
            aria-pressed={field.value === option.count}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <div className="text-lg mb-1">{option.icon}</div>
            <div className="text-xs font-medium text-center">{option.label}</div>
            <div className="text-xs text-center text-muted-foreground mt-1">
              {option.description}
            </div>
            
            {field.value === option.count && (
              <div className="absolute top-1 right-1 text-xs">✓</div>
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
        Choose how many AI-generated images to include with your content. More images provide variety but take longer to generate.
      </p>
    </div>
  );
}