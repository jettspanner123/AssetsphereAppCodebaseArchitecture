# Modal Architecture & Design System Invariant

Whenever creating, updating, or refactoring any modal or dialog in the AssetSphere client application, you MUST strictly adhere to the canonical modal specification in:
[`AssetsphereAgentDocumentationNMCS/AddingNewFeatureStore/HOW_TO_CREATE_AND_MANAGE_MODALS.md`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereAgentDocumentationNMCS/AddingNewFeatureStore/HOW_TO_CREATE_AND_MANAGE_MODALS.md)

### Strict Behavioral & Visual Rules:

1. **Base Component**:
   - MUST use [`ModalSharedComponent`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/ModalSharedComponent.tsx). Never build ad-hoc `<AnimatePresence>` modal overlays in screen controllers.
   - Use `scrollMode="backdrop"` for multi-section forms (enabling natural document scrolling) and `maxWidth="3xl"` for forms.

2. **Exit Direction Physics (`exitDirection`)**:
   - Manage local `const [exitDirection, setExitDirection] = useState<'down' | 'up'>('down')`.
   - **Slide Down (`'down'`)**: Triggered when clicking header **`X`** button (`headerCloseDirection="down"`), or top-level backdrop click (`scrollTop <= 40`).
   - **Slide Up (`'up'`)**: Triggered when clicking footer **`Close`** button (`handleCloseButton()`), submitting a form (**`Submit`**, **`Save Changes`**), clicking footer **`Dismiss`** / **`Cancel`**, executing actions (**`Resolve Ticket`**), or deep-scroll backdrop clicks (`scrollTop > 40`).
   - **Data Caching Ref (Anti-Instant Disappearance)**: Modals receiving entity props (e.g. `request` or `asset`) MUST use `const lastRef = React.useRef(item); if (item) lastRef.current = item; const displayItem = item || lastRef.current;` to prevent the modal from instantly disappearing while `AnimatePresence` completes its 600ms exit animation.

3. **Section Structure & Spacing**:
   - Section headers MUST use:
     `<h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800 mt-[15px]">`
   - Sections 2, 3, 4+ MUST have an explicit `15px` top margin (`mt-[15px]`).

4. **Card Grid Constraints (Max 3 Cards per Row)**:
   - Metric and info card rows MUST use `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3` (maximum of 3 cards per row on large displays).

5. **Brand Primary Accent**:
   - Submit and action buttons MUST use the `#0C2086` brand blue palette (`!bg-[#0C2086] hover:!bg-[#081765] !text-white`).
