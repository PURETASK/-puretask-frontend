'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { MessageSquarePlus, ChevronDown } from 'lucide-react';

export interface MessageTemplate {
  id: string;
  label: string;
  body: string;
  /** Optional category for grouping (e.g. "Status", "Thank you") */
  category?: string;
}

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  { id: 'thank-you', label: 'Thank you', body: 'Thank you for booking with me. I’m looking forward to cleaning for you!', category: 'Courtesy' },
  { id: 'reschedule', label: 'Reschedule?', body: 'Hi, would it be possible to reschedule our cleaning? Please let me know what times work for you.', category: 'Requests' },
  { id: 'request-review', label: 'Request review', body: 'Thanks again for having me! If you have a moment, I’d really appreciate a quick review. It helps me a lot.', category: 'Follow-up' },
  { id: 'request-tip', label: 'Request tip', body: 'Thank you for the opportunity to clean for you. If you’re happy with the result, a tip is always appreciated but never expected.', category: 'Follow-up' },
  { id: 'on-my-way', label: 'On my way', body: 'I’m on my way to your place. I’ll be there shortly!', category: 'Status' },
  { id: 'arrived', label: 'Arrived', body: 'I’ve arrived. Let me know when you’re ready for me to get started.', category: 'Status' },
  { id: 'starting', label: 'Starting', body: 'Starting the cleaning now. I’ll update you when I’m done.', category: 'Status' },
  { id: 'finished', label: 'Finished', body: 'All done! The cleaning is complete. Let me know if you need anything else.', category: 'Status' },
];

export interface QuickTemplatePickerProps {
  /** Called when user selects a template; inserts this body (or append) */
  onSelect: (body: string) => void;
  /** Optional custom templates (otherwise uses defaults) */
  templates?: MessageTemplate[];
  /** If true, append to existing text; otherwise replace */
  append?: boolean;
  /** Optional current message value when append is true */
  currentMessage?: string;
  className?: string;
}

export function QuickTemplatePicker({
  onSelect,
  templates = DEFAULT_TEMPLATES,
  append = false,
  currentMessage = '',
  className,
}: QuickTemplatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (t: MessageTemplate) => {
    const newText = append && currentMessage ? `${currentMessage}\n\n${t.body}` : t.body;
    onSelect(newText);
    setOpen(false);
  };

  const byCategory = templates.reduce<Record<string, MessageTemplate[]>>((acc, t) => {
    const cat = t.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className={cn('relative', className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <MessageSquarePlus className="h-5 w-5" />
        Insert template
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </Button>
      {open && (
        <>
          <div className="absolute bottom-full left-0 mb-1 w-72 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-50 py-1" role="listbox">
            {Object.entries(byCategory).map(([category, items]) => (
              <div key={category}>
                <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">{category}</p>
                {items.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="option"
                    className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                    onClick={() => handleSelect(t)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
        </>
      )}
    </div>
  );
}
