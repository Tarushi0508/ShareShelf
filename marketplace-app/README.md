# LoopMarket — Sell or Borrow Marketplace

A full MERN stack starter app where every listing can be sold outright, rented out,
or both. Built with MongoDB, Express, React (Vite), and Node.js.

You currently have neither Node.js nor MongoDB set up, so follow every step below
in order — it should take about 15–20 minutes the first time.

## What's included

- **Auth** — register/login with JWT, passwords hashed with bcrypt
- **Listings** — create, edit, delete, browse, search, and filter by sale/rent/both
- **Bookings** — request to borrow an item for a date range, with automatic
  conflict checking so the same item can't be double-booked
- **Dashboard** — manage your listings, approve/decline borrow requests you've
  received, and track requests you've sent
- A distinct visual identity (sage green for "rent", clay/terracotta for "sale")
  so the dual sell-or-borrow concept is visible everywhere, not just explained

## Step 1 — Install Node.js

Download and install the LTS version from https://nodejs.org (just click through
the installer). Once done, confirm it worked by opening a terminal and running:

```
node -v
npm -v
```

Both should print a version number.

## Step 2 — Create a free MongoDB database

You don't need to install MongoDB locally — use the free cloud version:

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account
2. Create a new free cluster (the M0 free tier is enough)
3. Under **Database Access**, create a database user with a username and password
4. Under **Network Access**, click "Add IP Address" and choose "Allow access from anywhere" (fine for development)
5. Click **Connect** on your cluster, choose "Drivers", and copy the connection
   string — it looks like
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`
6. Replace `<username>` and `<password>` with the database user you created, and
   add a database name at the end, e.g. `.../loopmarket?retryWrites=true&w=majority`

## Step 3 — Set up the backend

```
cd server
npm install
```

Then copy `.env.example` to `.env`:

```
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — the connection string from Step 2
- `JWT_SECRET` — any long random string (e.g. mash your keyboard for 30 characters)

Start the backend:

```
npm run dev
```

You should see `Server running on port 5000` and `MongoDB connected: ...` in the
terminal. Leave this running.

## Step 4 — Set up the frontend

Open a **new** terminal window/tab (keep the backend running in the first one):

```
cd client
npm install
cp .env.example .env
npm run dev
```

This starts the React app, usually at `http://localhost:5173`. Open that in your
browser — you should see the LoopMarket homepage.

## Step 5 — Try it out

1. Sign up for an account
2. Click "List an item" and create a listing — try one marked "both" so you can
   test the sale and rental flows on the same item
3. Log out, sign up as a second user (or open an incognito window), and try
   buying or requesting to borrow that listing
4. Log back in as the first account and check the Dashboard → "Borrow requests
   received" tab to approve or decline the request

## Project structure

```
marketplace-app/
├── server/             Express API
│   ├── models/         Mongoose schemas (User, Listing, Booking)
│   ├── controllers/    Route logic
│   ├── routes/         API endpoints
│   ├── middleware/      JWT auth guard
│   └── server.js        Entry point
└── client/             React app (Vite + Tailwind)
    └── src/
        ├── pages/        Home, Login, Register, ListingDetail, CreateListing, Dashboard
        ├── components/   Navbar, ListingCard, BookingRequestForm, ProtectedRoute
        ├── context/      AuthContext (login/register/logout, JWT in localStorage)
        └── api/          Axios instance with auth header attached automatically
```

## Natural next steps once this is running

- **Real payments** — swap the simulated "Buy now" button for actual Stripe Checkout
- **Image uploads** — currently listings take image URLs; add file upload via a
  service like Cloudinary
- **Reviews & ratings** — add a Review model so buyers/borrowers can rate each
  other after a completed transaction
- **Messaging** — let buyers and owners chat before committing
- **Deployment** — deploy the backend to Render or Railway, and the frontend to
  Vercel or Netlify, once you're ready to share it with real users

## Renaming

The app is currently called "LoopMarket" as a placeholder — change the title in
`client/index.html` and the brand text in `client/src/components/Navbar.jsx` to
whatever name you land on.
