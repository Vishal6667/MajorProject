# Airbnb Clone

An Airbnb-like web application built using **Express, JavaScript, and MongoDB** that allows users to list, browse, and book properties.

## Features

✅ User authentication (Login/Register)  
✅ Add, edit, and delete property listings  
✅ Upload images for listings  
✅ Responsive UI using Bootstrap/EJS  
✅ MongoDB integration for data storage  
✅ Dynamic routes with Express.js  

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)  
- **Frontend**: EJS (Embedded JavaScript), CSS, Bootstrap  
- **Authentication**: Passport.js (if implemented)  
- **File Upload**: Multer (for image uploads)  

## Installation

Follow these steps to set up and run the project on your local machine:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Vishal6667/MajorProject.git
cd MajorProject
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the project root and add:
```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### 4️⃣ Start the Server
```bash
npm start
```
Server runs at: **http://localhost:3000**

## Usage

1. Open the app in your browser.
2. Sign up or log in.
3. Add a new listing with an image.
4. View, edit, or delete listings.

## File Structure
```
MajorProject/
│── models/        # Mongoose schemas
│── routes/        # Express routes
│── views/         # EJS templates
│── public/        # Static files (CSS, images, JS)
│── uploads/       # Uploaded images
│── app.js         # Main Express server
│── package.json   # Dependencies
│── .gitignore     # Ignored files
```

## Contribution
Feel free to fork this repository and submit pull requests!

## License
This project is licensed under the MIT License.

---

### 🚀 Happy Coding!

