# Greencastle Local Club

A two-sided web app for a small downtown: shoppers discover local businesses and earn loyalty points, merchants check customers in from their own device. Built as a hackathon project and since rebuilt into a cleaner, more resilient version.

**Live demo:** [Local Club Website](https://local-club.vercel.app/)

**Stack:** React 19 · React Router 7 · Firebase (Auth + Firestore) · Google Maps · CI/CD via Vercel

---

## What it does

| Area | Feature |
| --- | --- |
| Discover | Directory of 19 downtown businesses with hours, ratings, phone, and an interactive Google Map (marker selection pans the map). |
| Loyalty | Each member has a personal QR code. Staff open the **Check-In** view, scan it with the device camera, and award points. |
| Deals | Members spend points on rotating deals; a redeemed deal renders a scannable barcode to show at the register. |
| Favorites | Heart a business; the list persists to the user's profile with an optimistic UI. |

---

## Tech stack

- **Frontend:** React 19, Create React App, React Router 7 (`BrowserRouter`, central route table in [App.js](src/App.js), nav bar hidden per-route via `useLocation`)
- **Auth:** Firebase Authentication (email/password)
- **Database:** Cloud Firestore — `Users` documents (points, favorites, redeemed deals) and an append-only `Checkins` collection
- **Maps:** `@react-google-maps/api` with `useJsApiLoader`
- **QR / barcode:** `qrcode.react` (member code), `html5-qrcode` (staff scanner), `react-barcode` (redeemed deal)
- **State:** React
- **Feedback:** `react-toastify`
- **Config:** API keys via `REACT_APP_*` environment variables; `.env` is git-ignored and secrets are injected in CI

---

## Architecture & decisions

### Client-only, Firebase as the backend
There is no custom server. Firebase Auth and Firestore cover identity, persistence, and real-time reads, which kept the surface area small and let the loyalty loop ship fast. Trade-off: business logic that ideally lives on a server (points math, rate limiting) is
currently enforced on the client and should move to Firestore Security Rules / Cloud Functions before real use.

### One auth context
[UserContext.js](src/components/contexts/UserContext.js) subscribes once to `onAuthStateChanged` and exposes `userDetails`, `loading`, and the favorites API to the whole tree. Chosen over prop-drilling and over Redux because the app has essentially one shared domain object (the signed-in user).

- **Degrades gracefully:** if the Firestore profile is missing, the context still seeds   `userDetails` from the auth user (name falls back to the email prefix) so dependent pages like Scan don't crash.
- **`loading` gate:** routes wait for the first auth resolution instead of flashing the login screen.

### Optimistic updates with rollback
Toggling a favorite updates local state immediately, writes to Firestore with `{ merge: true }`, and rolls back to the previous array if the write fails. The heart reacts instantly; a dropped network request doesn't leave the UI lying.

### The loyalty loop is a small state machine
[CheckIn.js](src/components/checkin/CheckIn.js) is the merchant side:

- `scanning → review → success` phases keep the camera, the confirm step, and the receipt
  visually separate
- A `Map` of `uid → timestamp` enforces a 60-second cooldown so the same code can't be
  awarded twice while the panel is open
- Points are written with Firestore `increment()` — an atomic server-side update, not a
  read-modify-write race
- Every award also appends a row to `Checkins` (who, how many, when) as an audit trail
- Per-frame decode failures from the camera are expected and ignored; only real errors
  surface

### Derived data stays out of state
[Home.js](src/components/home/Home.js) computes average rating, top-rated lists, and a regex-based "is this a restaurant" classification with `useMemo` from the source data rather than storing duplicated state.

### Seed data now, migration path later
Business and deal content lives in [LocalsData.js](src/components/locals/LocalsData.js) and [DealsData.js](src/components/deals/DealsData.js). A one-off [UploadData.js](src/components/uploadData/UploadData.js) component pushes it into Firestore when needed. Fast to iterate on during the build; the read path is already written to swap to a live collection.

---

## Deployment

Hosted on **Vercel** with continuous deployment from the `main` branch. On every push, Vercel installs dependencies, injects the Firebase and Google Maps keys as build-time environment variables, runs `npm run build`, and publishes the optimized static bundle to
its edge network. Pull requests get their own preview deployments.

---

## Running locally

```bash
npm install

# .env in the project root
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_GOOGLE_MAPS_KEY=your_key

npm start        # http://localhost:3000
npm run build    # production bundle
```

---

## Known limitations / next steps

- Move points and redemption logic behind Firestore Security Rules and/or Cloud Functions
- Replace the local deals array with a live Firestore collection (read path is ready)
- A few flows use `window.location.href` instead of the router — migrate to `navigate()`
- Leaderboard, mystery box, and weekly challenges are UI mockups, not yet wired up
- Test setup is scaffolded (`@testing-library/*`) but coverage is thin
