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
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <div className={cn(
          "text-xs font-mono",
          isAtLimit ? "text-destructive" : isNearLimit ? "text-warning" : "text-muted-foreground"
        )}>
          {currentLength}/{maxLength}
        </div>
      </div>
      
      <div className="relative">
        <Input
          {...field}
          id={name}
          type="text"
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            "transition-colors",
            error && "border-destructive focus-visible:ring-destructive",
            isAtLimit && "border-warning focus-visible:ring-warning"
          )}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
        />
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
        Describe the topic you want to generate content about. Be specific for better results.
      </p>
    </div>
  );
}