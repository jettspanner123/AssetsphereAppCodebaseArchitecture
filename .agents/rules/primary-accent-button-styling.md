# Primary Accent Button Styling Rule

Whenever creating or styling a primary accent button (such as "Add Asset", "Run Diagnostics", or key call-to-action buttons across headers, toolbars, and modals):

1. **Background Color**: Use the exact `#0C2086` brand blue with hover state `#081765`:
   - `!bg-[#0C2086] hover:!bg-[#081765] border-none shadow-sm font-semibold`

2. **White Text & Icon Invariant**:
   - Icon: Include `!text-white` on the icon element (e.g. `<Plus className="w-4 h-4 !text-white" />`).
   - Text Label: Wrap text in `<span className="!text-white font-medium">Text</span>` (or apply `!text-white`) to ensure text remains pure white in both Light and Dark modes without theme override conflicts.

3. **Example Invocation**:
   ```tsx
   <ButtonSharedComponent
     variant="primary"
     size="sm"
     onClick={handleAction}
     className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
     icon={<Plus className="w-4 h-4 !text-white" />}
   >
     <span className="!text-white font-medium">Button Label</span>
   </ButtonSharedComponent>
   ```
