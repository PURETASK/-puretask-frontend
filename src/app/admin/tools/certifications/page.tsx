'use client';

import LegacyToolPage from '@/components/admin/LegacyToolPage';
import { CertificationDisplay } from '@/components/admin/legacy/components/CertificationDisplay';

export default function AdminToolsCertificationsPage() {
  return (
    <LegacyToolPage
      title="Certifications (Legacy)"
      description="Legacy certification progression UI."
    >
      <CertificationDisplay />
    </LegacyToolPage>
  );
}
