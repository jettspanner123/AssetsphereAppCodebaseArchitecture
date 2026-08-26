# Use EmptyStateSharedComponent for All Empty States Rule

Whenever rendering an empty state in any screen, table, grid, modal, or component (e.g. no search results found, empty list, no items registered, no activity history):

## Invariant Requirements:
1. **Never create one-off or custom empty state markup**:
   - Do NOT use arbitrary `<div className="border border-dashed p-12 text-center...">` or custom placeholder containers.
2. **Always import and use `EmptyStateSharedComponent`**:
   - Location: `src/Shared/Components/EmptyStateSharedComponent.tsx`
3. **Required Props**:
   - `icon`: Large Lucide icon (e.g. `<Wrench className="w-6 h-6" />` or `<Search className="w-6 h-6" />`).
   - `title`: Short, clear heading explaining the empty state (e.g. `"No Service Requests Found"`).
   - `description`: Informative subtext guiding the user on how to resolve or why it is empty (e.g. `"No tickets matched your filter criteria or search query."`).
   - `actionButton` *(optional)*: Call-to-action button when applicable (e.g. primary action to create or reset filters).

## Standard Usage Example:

```tsx
import EmptyStateSharedComponent from '../../Shared/Components/EmptyStateSharedComponent';
import { Wrench } from 'lucide-react';

{filteredItems.length === 0 && (
  <EmptyStateSharedComponent
    icon={<Wrench className="w-6 h-6" />}
    title={searchQuery || activeFilter !== 'ALL' ? 'No Matching Requests' : 'No Service Requests in Registry'}
    description={
      searchQuery || activeFilter !== 'ALL'
        ? 'No service tickets matched your active search or filter criteria. Try resetting filters.'
        : 'Your enterprise hardware maintenance queue is currently empty.'
    }
  />
)}
```
