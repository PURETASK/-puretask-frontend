'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ChoiceRewardOption {
  id: string;
  name: string;
  effect: string;
}

export interface ChoiceRewardModalProps {
  open: boolean;
  onClose: () => void;
  /** Title, e.g. "Choose your reward" */
  title?: string;
  /** Subtitle / explanation */
  subtitle?: string;
  options: ChoiceRewardOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ChoiceRewardModal({
  open,
  onClose,
  title = 'Choose your reward',
  subtitle = 'You must choose one reward from the options below.',
  options,
  selectedId,
  onSelect,
  onConfirm,
  confirmLabel = 'Confirm selection',
  isLoading = false,
}: ChoiceRewardModalProps) {
  const [localSelected, setLocalSelected] = useState<string | null>(selectedId);

  const current = localSelected ?? selectedId;

  if (!open) return null;

  const handleConfirm = () => {
    if (current) {
      onSelect(current);
      onConfirm();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="choice-reward-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <h2 id="choice-reward-title" className="text-xl font-semibold text-gray-900 mb-1">
              {title}
            </h2>
            <p className="text-sm text-gray-600 mb-6">{subtitle}</p>
            <div className="space-y-2 mb-6">
              {options.map((opt) => {
                const isSelected = current === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLocalSelected(opt.id)}
                    className={cn(
                      'w-full flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors',
                      isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 flex-shrink-0 rounded-full border-2',
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      )}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{opt.name}</p>
                      <p className="text-sm text-gray-600">{opt.effect}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={!current}
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
