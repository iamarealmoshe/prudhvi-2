# Event Registration Portal

A MERN stack event registration portal with:

- Event registration form collection
- Ticket summary UI
- Confirmation screen
- Backend capacity checks before registration is accepted
- MongoDB models for events and registrations

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `server/.env` from `server/.env.example`.

3. Seed a sample event:

   ```bash
   npm run seed
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

The client runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Capacity Check

Registration is accepted only if the event still has enough remaining seats for the requested ticket quantity. The server performs the check with an atomic MongoDB update so two users cannot overbook the same event at the same time.
# prudhvi-2
