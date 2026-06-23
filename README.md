ShareShelf 🛒

A peer-to-peer marketplace where users can buy or rent items from each other — every listing supports both options.


Features


Listings — Create listings for sale, rent, or both
Search & Filters — Search by title, filter by type, location, price range, and sort by newest or price
Authentication — Register and login with JWT-based auth
Booking System — Request to borrow items, with approve/decline/complete flow
Orders — Buy items directly with delivery address
Messaging — Contact sellers directly
Reviews — Leave reviews after completed transactions
Dashboard — Manage your listings, orders, and booking requests



Tech Stack

Frontend


React (Vite)
Tailwind CSS
React Router


Backend


Node.js + Express
MongoDB + Mongoose
JWT Authentication
Cloudinary (image uploads)



Getting Started

Prerequisites


Node.js installed
MongoDB connection (local or Atlas)
Cloudinary account (for image uploads)


Installation


Clone the repo


bash   git clone https://github.com/Tarushi0508/ShareShelf.git
   cd ShareShelf


Set up the server


bash   cd marketplace-app/server
   npm install

Create a .env file in the server folder:

   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret


Set up the client


bash   cd ../client
   npm install


Run the app
In one terminal (server):


bash   cd marketplace-app/server
   npm run dev

In another terminal (client):

bash   cd marketplace-app/client
   npm run dev


Open http://localhost:5173 in your browser.
