# Component Documentation

## UI Components

### Loading States

#### `Skeleton`
Skeleton loader for content placeholders.

```tsx
import { Skeleton } from '@/components/ui/Skeleton';

<Skeleton className="h-4 w-full" />
<SkeletonList items={6} />
```

#### `LoadingSpinner`
Loading spinner component.

```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
```

#### `ProgressBar`
Progress bar for long-running operations.

```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar value={75} max={100} />
```

### Error Handling

#### `ErrorDisplay`
Display user-friendly error messages.

```tsx
import { ErrorDisplay } from '@/components/error/ErrorDisplay';

<ErrorDisplay
  error={error}
  onRetry={() => refetch()}
  variant="card"
  title="Failed to load data"
/>
```

#### `RetryButton`
Button for retrying failed operations.

```tsx
import { RetryButton } from '@/components/error/RetryButton';

<RetryButton onRetry={() => refetch()} />
```

### Forms

#### `FormField`
Form field with label and error message.

```tsx
import { FormField } from '@/components/forms/FormField';

<FormField
  label="Email"
  error={errors.email}
  required
>
  <input type="email" {...register('email')} />
</FormField>
```

#### `FileUpload`
File upload with drag & drop.

```tsx
import { FileUpload } from '@/components/forms/FileUpload';

<FileUpload
  accept="image/*"
  maxSize={5}
  onUpload={handleUpload}
  preview
/>
```

#### `DatePicker` & `TimePicker`
Date and time selection.

```tsx
import { DatePicker, TimePicker } from '@/components/ui';

<DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date()}
/>

<TimePicker
  value={time}
  onChange={setTime}
  step={15}
/>
```

### Navigation

#### `MobileNav`
Mobile navigation menu.

```tsx
import { MobileNav } from '@/components/layout/MobileNav';

<MobileNav />
```

#### `BottomNav`
Bottom navigation for mobile.

```tsx
import { BottomNav } from '@/components/layout/BottomNav';

<BottomNav />
```

### Other Components

#### `EmptyState`
Display when no data is available.

```tsx
import { EmptyState } from '@/components/ui/EmptyState';

<EmptyState
  icon={<Icon />}
  title="No items"
  description="Get started by creating one"
  action={<Button>Create</Button>}
/>
```

#### `ConfirmDialog`
Confirmation dialog for destructive actions.

```tsx
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

<ConfirmDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  title="Delete item?"
  description="This action cannot be undone"
/>
```

#### `NotificationCenter`
Notification dropdown.

```tsx
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

<NotificationCenter />
```

#### `MapView`
Interactive map component.

```tsx
import { MapView } from '@/components/maps/MapView';

<MapView
  lat={40.7128}
  lng={-74.0060}
  zoom={15}
  markers={[{ lat: 40.7128, lng: -74.0060, label: 'Location' }]}
/>
```

## Hooks

### `useErrorHandler`
Handle errors consistently.

```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';

const { handleError } = useErrorHandler();
try {
  // ...
} catch (error) {
  handleError(error);
}
```

### `useFormValidation`
Form validation with Zod.

```tsx
import { useFormValidation } from '@/hooks/useFormValidation';
import { bookingSchema } from '@/lib/validation/schemas';

const form = useFormValidation(bookingSchema);
```

### `useAnalytics`
Track page views and events.

```tsx
import { useAnalytics, useTrackEvent } from '@/hooks/useAnalytics';

useAnalytics(); // Auto-track page views

const { track } = useTrackEvent();
track({ action: 'button_click', category: 'engagement' });
```

## Utilities

### Analytics
```tsx
import { trackEvent, trackPageView } from '@/lib/analytics';

trackPageView('/dashboard');
trackEvent({ action: 'click', category: 'button' });
```

### Error Tracking
```tsx
import { captureException, setUserContext } from '@/lib/errorTracking';

captureException(error, { userId: '123' });
setUserContext('123', 'client', 'user@example.com');
```

### Validation
```tsx
import { bookingSchema, profileSchema } from '@/lib/validation/schemas';

const result = bookingSchema.safeParse(data);
```
