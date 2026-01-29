'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { TemplateEditor } from '@/components/admin/legacy/components/TemplateEditor';

export default function AdminToolsTemplateEditorPage() {
  return (
    <LegacyToolPage
      title="Template Editor (Legacy)"
      description="Legacy template editor with variables and preview."
    >
      <TemplateEditor
        onSave={async () => {}}
        onCancel={() => {}}
        template={{
          type: 'booking_confirmation',
          name: 'Welcome Message',
          content: 'Hi {client_name}, your booking is confirmed for {date} at {time}.',
          variables: ['client_name', 'date', 'time'],
        }}
      />
    </LegacyToolPage>
  );
}
