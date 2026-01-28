# FocusFriend - Copilot Instructions

## Project Context
"FocusFriend" is an ADHD productivity app built with **React Native (Expo Router)**. 
The Vibe is "Calm Tech": Low stimulation, dark mode by default, large typography, and a supportive, non-judgmental tone.

## Tech Stack
- Framework: React Native (Expo SDK 50+) with TypeScript.
- Navigation: Expo Router (File-based routing).
- State: Zustand.
- Styling: NativeWind (Tailwind CSS) or StyleSheet.
- Backend: OpenAI API (Direct calls for MVP).
- Storage: AsyncStorage.

## Coding Rules (The "Vibe")
1. **Throwaway Code:** Write modular code. If a component is too complex, prefer rewriting it over patching it.
2. **Safety:** Always use `safe-area-context`.
3. **Simplicity:** Do not over-engineer. Use built-in React Native components where possible.
4. **Testing:** All logic (timers, state) must be testable via Jest and playwright. UI must be accessible.

## Agent Behavior
- When asked to plan, iterate 5 times before suggesting the final plan.
- If you see a file growing over 200 lines, suggest a refactor immediately.