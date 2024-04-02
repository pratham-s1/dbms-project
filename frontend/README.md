# Railway Reservation and Management Portal

The project is a web application that allows users to book tickets for trains and manage their bookings. The application is built using the MERN stack.

## Steps to run the project

1. Clone the repository
2. Make sure `docker` is installed on your system
3. Make sure `nodejs v18` is installed on your system

To run the `mysql` server:

1. Run `docker-compose up -d` in the root directory of the project (`-d` is to run the container in the background)

To run the `frontend` (port 3000):

1. Go to the `frontend` directory (`cd frontend`)
2. Run `npm install` [Required only if packages are changed]
3. Run `npm run dev`

To run the `backend` (port 8080):

1. Go to the `backend` directory (`cd backend`)
2. Run `npm install` [Required only if packages are changed]
3. Run `npm run dev`
