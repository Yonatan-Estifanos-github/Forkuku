# Final Invite — Interface Contract

This file defines the shared props/hooks/function signatures all three parallel
agents (UI, Nav/State, RSVP) must use, so their work merges cleanly on `test`
without renaming or refactoring.

Do not deviate from these names/shapes without updating this file and flagging
it back to the other worktrees.

---

## 1. View / Navigation State
Owned by: `feature/invite-nav`
Consumed by: `feature/invite-ui`

```ts
type ActiveView = "save-the-date" | "final-invite";

interface NavState {
  activeView: ActiveView;
  onToggleView: (view: ActiveView) => void;
}
```

- The top nav bar component (built in `invite-ui`) receives `activeView` and
  `onToggleView` as props. It does not manage this state itself.
- `onToggleView` handles the actual navigation (route change or client state
  switch — nav agent decides which, based on existing codebase patterns).

---

## 2. RSVP Submission
Owned by: `feature/invite-rsvp`
Consumed by: `feature/invite-ui`

```ts
interface RSVPPayload {
  name: string;
  response: "accept" | "decline";
}

interface RSVPResult {
  success: boolean;
  error?: string;
}

submitRSVP(payload: RSVPPayload): Promise<RSVPResult>;

interface UseRSVP {
  submitRSVP: (payload: RSVPPayload) => Promise<RSVPResult>;
  isSubmitting: boolean;
  error: string | null;
}
```

- The RSVP form UI (built in `invite-ui`) calls `submitRSVP` on submit and
  reads `isSubmitting` / `error` to drive its own visual states (spinner,
  error message, etc.) — but the RSVP agent owns what "submit" actually does
  (validation beyond required-fields, Supabase write, dedupe logic against
  prior Save the Date responses).
- UI layer is responsible for disabling the submit button while
  `isSubmitting` is true and displaying `error` if present. It does not
  need to know Supabase internals.

---

## 3. Component Boundaries (who builds what)

| Piece                            | Owner                  |
|-----------------------------------|-------------------------|
| Visual layout, Tailwind, motion   | `feature/invite-ui`    |
| Nav bar *logic* (state/routing)   | `feature/invite-nav`   |
| Nav bar *markup/styling*          | `feature/invite-ui`    |
| RSVP form *markup/styling*        | `feature/invite-ui`    |
| RSVP form *submit logic*          | `feature/invite-rsvp`  |
| Supabase schema/queries           | `feature/invite-rsvp`  |

The UI worktree builds all markup as presentational components that accept
the props/hooks defined above — it does not implement routing or Supabase
logic itself, only wires up the props/callbacks passed to it.

---

## 4. Merge Order

1. `feature/invite-nav` — pure logic, no dependencies
2. `feature/invite-rsvp` — pure logic, no dependencies
3. `feature/invite-ui` — merge last, since it's the one that actually wires
   the other two together into a working page

If `invite-ui` was built against this contract, merging nav and rsvp first
means the UI's prop expectations should already line up with what's on
`test` by the time it merges.
