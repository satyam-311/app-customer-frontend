# MyJob — Customer App

A React Native (Expo) customer-facing app for a tradesperson marketplace, built
from 15 Figma screen exports.

## Running it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android), or press `i` / `a` for a simulator.

The app opens on a Login screen. There's no real backend yet (see
[Swapping in a real backend later](#swapping-in-a-real-backend-later)), so
any well-formed email/phone + a 6+ character password logs you in — same
for Create Account, any valid-looking form submits successfully. Nothing
is actually verified server-side.

> Note: `react-native-maps` (used in the Post-a-Job location step) works in
> Expo Go for basic map display, but for a production build you'll want an
> [EAS development build](https://docs.expo.dev/develop/development-builds/introduction/)
> plus a Google Maps API key on Android.

> The `design figma/` folder (the original exported screens this app was
> built from) is gitignored and kept local-only — it's reference material,
> not app code, so it isn't part of a fresh clone.

## Folder structure

```
src/
  constants/theme.js       Design tokens: colors, spacing, radius, typography,
                            and CURRENCY ('£'). Every screen imports from here
                            instead of hardcoding hex values or a currency
                            symbol — a re-theme (or re-market) later is a
                            one-file change.

  config/env.js             Placeholder for a future API_BASE_URL, read from
                            an EXPO_PUBLIC_ env var. Nothing uses it yet —
                            it exists so wiring a real backend later is
                            "fill this in," not "restructure the app."

  data/mockData.js          Mock arrays (SERVICE_CATEGORIES, PROFESSIONALS,
                            JOBS, CHATS) + an `api` facade (api.getJobs(),
                            api.postJob(), api.login(), api.updateProfile(),
                            etc). Screens only ever call the `api.*`
                            functions, never the raw arrays — so swapping in
                            a real backend later means rewriting the
                            *bodies* of these functions (fetch/axios calls)
                            without touching any screen code.

  context/
    JobFormContext.js       Holds the in-progress "post a job" draft
                            (category → description/photos → location →
                            review) across all 4 steps. A context was used
                            instead of route params because the draft
                            grows across steps and every step needs to both
                            read and patch it — cleaner than passing an
                            ever-larger params object forward.
    AuthContext.js           Holds the signed-in user (or null). login()/
                            signup()/logout() call the mock api.login()/
                            api.signup() facade functions — same
                            drop-in-a-real-backend story as JobFormContext.

  components/
    UI.js                   Shared dumb components: PrimaryButton,
                            StarRating, Badge, Avatar, Card, ScreenHeader,
                            ServiceIcon. Used by nearly every screen.
    StepHeader.js           The header shared by the 4 post-a-job screens:
                            back button + static title, a single continuous
                            progress bar (fill width = step/totalSteps, not
                            segmented), and the two-tone heading + paragraph
                            each step passes in. Each screen's own footer
                            pairs a "Back" button (navigation.goBack()) with
                            the step's primary action.

  navigation/
    RootNavigator.js         One native-stack navigator for the whole app.
                            Screen 1 is Splash, which routes to Login or
                            MainTabs depending on AuthContext; everything
                            else (auth, post-a-job flow, pro profile, chat
                            thread, profile settings, personal info) is
                            pushed on top with a back button. Kept as a
                            single stack (rather than nesting stacks inside
                            each tab) so `navigation.navigate('ProProfile',
                            {...})` works identically no matter which tab
                            you tapped it from.
    MainTabNavigator.js       The 5-item bottom tab bar (Home, Pro's,
                            Post a Job, Posted Job, Messages). The "Post a
                            Job" tab is special: it renders as a raised
                            orange FAB, and tapping it doesn't switch to a
                            tab screen — a `tabPress` listener intercepts
                            the event and pushes `PostJobStep1` onto the
                            *root* stack instead. That's what gives the
                            4-step flow its own back-history and a proper
                            "X" close button, instead of being trapped
                            inside the tab bar's own navigation state.

  screens/
    Splash/                 Logo animation / launch screen, then routes to
                            Auth or MainTabs.
    Auth/                   LoginScreen.js + SignupScreen.js (mock
                            validation, no real backend yet) + AuthLogo.js
                            (shared logo mark, same one used on Splash).
    Home/                   Greeting header with notification bell, hero
                            photo banner, a search/location/Post-a-Job
                            panel, services grid, posted jobs preview,
                            elite pros list, trust badges.
    PostJob/                4 files: PostJobStep1.js (category) →
                            PostJobStep2.js (description + photos) →
                            PostJobStep3.js (map + address) →
                            PostJobStep4.js (review + submit).
    PostedJobs/              Job Management screen — Active/Completed
                            underline tabs, jobs grouped by status
                            (Opened/Assigned or Completed/Cancelled),
                            status-tinted cards.
    Quotes/                  Location bar + heading + search + filter
                            chips above a 2-column pro grid (the "Pro's"
                            tab) — photo, rating badge, role + experience,
                            skill tags.
    ProProfile/               A pro's public profile — about, portfolio,
                            reviews, licensed/insured badges, "Message"
                            button.
    Messages/                MessagesScreen.js (chat list) +
                            ChatThreadScreen.js (individual thread with
                            text bubbles + an inline Service Quote card
                            with Accept/Counter Offer).
    Profile/                  ProfileScreen.js (hero avatar with Verified
                            badge, sectioned account-settings menu, Logout
                            actually signs you out) + PersonalInfoScreen.js
                            (photo section, floating-label form fields,
                            validation).
```

## Design tokens used

- Navy header: `#0D1C32`
- Orange accent / CTA: `#F4831F`
- App background: `#F5F6F8`
- See `src/constants/theme.js` for the full palette, spacing scale, and
  typography scale.

## Real functionality implemented

- **Auth**: Login + Create Account screens with mock validation (email/phone
  + password regex checks, touched-based error display); `AuthContext`
  tracks the signed-in user; Splash routes to Login or MainTabs based on
  it; Profile's Logout actually signs out and resets navigation back to
  Login. No session persistence yet — every fresh launch requires login.
- **Post-a-Job flow**: form state carried across all 4 steps via
  `JobFormContext`; per-step validation (category required, description
  ≥ 10 chars, address + map pin required before continuing); review step
  lets you jump back to edit any section; submitting resets the draft and
  clears the flow from navigation history.
- **Posted/Completed Jobs**: real tab switching (`useState`), jobs grouped
  by status using a small `groupBy` helper.
- **Quotes → Pro Profile**: tapping any pro card navigates with the pro's
  id as a param; the profile screen looks the pro up via the mock API.
- **Messages → Chat Thread**: tapping a conversation navigates with a
  chat id; the "Message" button on a Pro Profile instead passes a `proId`
  and the thread screen resolves either one to the same chat.
- **Chat UI**: text bubbles (mine vs. theirs), timestamps, an inline quote
  card type with Accept/Counter Offer actions, and a working (mocked)
  send box that appends messages instantly.
- **Personal Info form**: field-level validation (email regex, phone
  regex, min-length checks) that only shows errors after a field has been
  touched; saving goes through `api.updateProfile()`.

## Design fidelity

A pass was done comparing every screen against its `design figma/` export
and fixing what didn't match:

- **Home, Posted Jobs, Profile, Personal Info** were rebuilt to match their
  Figma frames — these were previously simplified/placeholder layouts.
- **Quotes** gained the header the design has above its pro grid: location
  bar, "Find the Perfect Pro" heading, search bar with a docked Search
  button, and filter chips (built from the professionals' actual `service`
  values, since the mock data doesn't have separate category data).
- Two bugs fixed along the way: Posted Jobs' "In Progress" badge
  referenced a `warning` tone that doesn't exist in `Badge`'s tone map
  (`src/components/UI.js`) and was silently falling back to orange — fixed
  by adding a proper `navy` tone and pointing the Assigned status at it;
  `ChatThreadScreen`'s sent/received bubble colors and the send-button
  color were inverted relative to the design.

### Known gaps / not yet matching design

Called out explicitly so this doesn't read as "fully done":

- **Post Job Step 1 & 2**: category-card and textarea color scheme aren't
  finalized against the design yet.
- **Post Job Step 3**: no "SELECTED SITE" map overlay, and no separate
  City field (only one address line).
- **Post Job Step 4**: review-card section labels aren't styled as pills
  yet.
- **Login / Signup**: no Figma source exists for these screens at all —
  they were built without a design reference, so there's nothing to
  compare them against. Not a bug, just undocumented territory.
- No real device/emulator testing has been done on this design pass —
  verified via static analysis and Metro bundle checks only.

## Swapping in a real backend later

Everything data-related — auth, jobs, quotes, pros, chats, profile
updates — funnels through `src/data/mockData.js`'s `api` object. To
connect a real backend:

1. Fill in `API_BASE_URL` in `src/config/env.js` (via an
   `EXPO_PUBLIC_API_BASE_URL` env var).
2. Keep the function names and return shapes the same (e.g. `getJobs()`
   still returns an array of job objects with the same fields).
3. Replace the mock array lookups / `delay()` calls with `fetch()`/`axios`
   calls against `API_BASE_URL`.
4. No screen code needs to change.
