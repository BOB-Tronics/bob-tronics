# Frontend Development Rules

## 1. General Approach

* Build the frontend using the existing project environment and technologies.
* **Do not change or recreate the project setup** unless absolutely necessary.
* Before creating a new component, check whether a suitable component already exists and reuse it.
* Keep the implementation simple, readable, and beginner-friendly.
* Avoid unnecessary complexity, abstractions, or advanced patterns.
* Write code that is easy to understand, modify, debug, and connect to a backend later.

## 2. Reuse Existing Components

* Always inspect the existing components before creating new ones.
* Reuse existing buttons, inputs, cards, modals, navigation, layouts, forms, and other UI components whenever possible.
* Do not create duplicate components that perform the same job.
* If an existing component needs a small improvement to support a new feature, improve and reuse it instead of creating another version.
* Keep reusable components generic enough to work in multiple pages.

## 3. Project Structure

Keep a clear and predictable structure.

Use:

* `components/` → reusable UI components
* `pages/` or `app/` → pages/routes
* `services/` or `lib/` → API/backend communication
* `types/` → shared TypeScript types
* `hooks/` → reusable React hooks when needed
* `utils/` → small helper functions
* `assets/` → images, icons, and static assets

Do not create folders unless they are actually needed.

## 4. Components

* Prefer small components with one clear responsibility.
* Avoid putting an entire page into one huge component.
* Use props to make components reusable.
* Give props clear and understandable names.
* Keep component logic close to where it is used unless it is genuinely reusable.
* Avoid unnecessary component splitting.

## 5. Code Style

* Use clear and descriptive names.
* Use TypeScript properly when the project uses TypeScript.
* Avoid `any` unless there is a strong reason.
* Keep functions short and understandable.
* Avoid deeply nested logic.
* Prefer simple solutions over clever solutions.
* Add comments only when they explain something that is not obvious.
* Do not add comments that simply repeat what the code already says.

## 6. UI and Design

* Keep the UI clean, modern, responsive, and consistent.
* Follow the existing project's design system and styles.
* Reuse existing colors, spacing, typography, buttons, and components.
* Do not introduce a completely different design style without a reason.
* Make pages responsive for mobile, tablet, and desktop.
* Use semantic HTML where appropriate.
* Make interactive elements clearly recognizable.

## 7. Forms

* Reuse the existing input, button, and form components.
* Keep form state and validation understandable.
* Show clear validation and error messages.
* Disable submit buttons when appropriate.
* Show loading states during requests.
* Do not duplicate validation logic unnecessarily.

## 8. Backend Integration

Design the frontend so that backend integration is straightforward.

* Keep API calls separate from UI components whenever practical.
* Put API communication inside `services/` or the project's existing API layer.
* Do not put large `fetch`/API implementations directly inside page components.
* Use clear functions such as:

  * `getUsers()`
  * `getUser(id)`
  * `createUser(data)`
  * `updateUser(id, data)`
  * `deleteUser(id)`
* Keep API functions simple and easy to replace or modify.
* Define TypeScript types for API data when possible.
* Handle:

  * loading
  * success
  * empty states
  * errors
* Never hardcode data that is expected to come from the backend unless it is explicitly mock data for development.

## 9. Mock Data

When the backend is not available yet:

* Use clearly separated mock data.
* Make the mock data structure match the expected backend response.
* Do not mix mock data throughout components.
* Make it easy to replace mock data with real API calls later.

## 10. State Management

* Start with local React state when it is sufficient.
* Do not introduce global state management unless the project actually requires it.
* Use Context or another state solution only for genuinely shared state.
* Avoid unnecessary state.
* Keep state as close as possible to where it is used.

## 11. API and Environment Variables

* Never hardcode API URLs, secrets, tokens, or credentials inside components.
* Use environment variables for configurable backend URLs and public configuration.
* Never expose private backend secrets in frontend code.
* Keep API configuration in one predictable location.

## 12. Error and Loading States

Every backend-dependent feature should consider:

* Loading state
* Successful state
* Empty state
* Error state

Do not leave the user with a blank screen when something fails.

## 13. Authentication

When authentication is required:

* Keep authentication logic separate from UI components.
* Store only what is appropriate for the frontend.
* Protect authenticated routes/pages where necessary.
* Handle expired or invalid authentication gracefully.
* Never expose sensitive credentials or secrets.

## 14. Responsive Design

Every page should work on:

* Mobile
* Tablet
* Desktop

Do not design only for desktop and fix mobile afterward.

## 15. Accessibility

* Use semantic HTML.
* Buttons should be buttons.
* Links should be links.
* Inputs should have understandable labels.
* Images should have appropriate `alt` text.
* Ensure keyboard interaction works where applicable.
* Do not rely only on color to communicate information.

## 16. Before Creating New Code

Before implementing a feature:

1. Check the existing project structure.
2. Find reusable components.
3. Find existing types, hooks, utilities, and API functions.
4. Reuse them where possible.
5. Only create something new when the existing code cannot reasonably support the feature.

## 17. Making Changes

When modifying existing code:

* Make the smallest reasonable change.
* Do not rewrite unrelated files.
* Do not change working functionality without a reason.
* Preserve existing component APIs unless there is a clear need to change them.
* After changes, check for TypeScript errors, broken imports, and obvious UI problems.

## 18. Keep It Beginner-Friendly

The code should be understandable by a beginner who needs to maintain the project.

Prefer:

`simple → clear → reusable → maintainable`

Avoid:

`complex → clever → heavily abstracted → difficult to modify`

The goal is not to write the shortest code. The goal is to write code that is **easy to understand and easy to change**.

## 19. Do Not Overengineer

Do not add libraries, patterns, architecture, or abstractions just because they are available.

Only introduce something new when:

* It solves a real problem.
* The existing project cannot reasonably solve it.
* It makes the project easier to maintain.

## 20. Final Rule

Before finishing any feature, make sure:

* Existing components were reused where possible.
* The code is simple and readable.
* The UI is responsive.
* Loading, empty, and error states are handled.
* API/backend integration can be added or replaced easily.
* No unnecessary files or dependencies were created.
* No unrelated parts of the project were changed.
* The implementation is easy for a beginner to understand and modify.

**Build the project as if another beginner will need to take over the code tomorrow.**