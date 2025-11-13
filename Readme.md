# AlgoQuest - LeetCode-Inspired Coding Platform

AlgoQuest is a full-stack competitive programming platform inspired by LeetCode, built with modern web technologies. It provides an interactive environment for users to solve coding problems, submit solutions, and get real-time feedback through automated code execution.

## 🚀 Features

- **User Authentication & Authorization**

  - Secure JWT-based authentication
  - Role-based access control (User & Admin)
  - Protected routes and middleware

- **Interactive Code Editor**

  - Monaco Editor integration (VS Code editor)

- **Problem Management**

  - Browse problems by difficulty (Easy, Medium, Hard)
  - Filter by tags (Array, Linked List, Graph, Dynamic Programming)
  - Detailed problem descriptions with examples
  - Visible and hidden test cases

- **Code Execution & Submission**

  - Judge0 API integration for code execution
  - Support for 3 programming languages
  - Real-time compilation and execution results
  - Submission history tracking

- **Admin Panel**

  - Create, update, and delete problems
  - Upload video solutions

- **State Management**
    - Redux Toolkit integration for state management

- **File Uploads**
  - Cloudinary integration for video solution storage

## 🛠️ Tech Stack

### Frontend

- **Framework:** React.js 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, DaisyUI
- **Code Editor:** Monaco Editor (@monaco-editor/react)
- **State Management:** Redux Toolkit
- **Routing:** React Router 
- **Form Handling:** React Hook Form with Zod validation
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js 
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **File Upload:** Cloudinary
- **Code Execution:** Judge0 API
- **Validation:** Validator.js, Zod

### DevOps & Deployment

- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (Reverse Proxy)
- **Deployment:** AWS
- **Version Control:** Git, GitHub

## 📁 Project Structure

```
AlgoQuest/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── problem.controllers.js   # Problem CRUD operations
│   │   │   ├── submission.controller.js # Code submission handling
│   │   │   ├── userAuth.controllers.js  # Authentication logic
│   │   │   └── videoSolution.controllers.js
│   │   ├── middleware/
│   │   │   ├── adminMiddleware.js       # Admin authorization
│   │   │   └── userMiddleware.js        # User authentication
│   │   ├── models/
│   │   │   ├── problem.model.js         # Problem schema
│   │   │   ├── submission.model.js      # Submission schema
│   │   │   ├── user.model.js            # User schema
│   │   │   └── videoSolution.model.js
│   │   ├── routes/
│   │   │   ├── problem.routes.js
│   │   │   ├── submission.routes.js
│   │   │   ├── userAuth.routes.js
│   │   │   └── videoSolution.routes.js
│   │   ├── utils/
│   │   │   ├── api-responce.js          # Standardized API responses
│   │   │   ├── problem.utils.js
│   │   │   └── validators.js
│   │   └── index.js                     # Express server entry point
│   ├── Dockerfile
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Problems listing page
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ProblemPage.jsx          # Code editor & problem details
│   │   │   ├── SubmissionHistory.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AdminCreate.jsx          # Create new problems
│   │   │   ├── AdminUpdate.jsx
│   │   │   ├── AdminDelete.jsx
│   │   │   ├── AdminUpload.jsx
│   │   │   └── AdminVideo.jsx
│   │   ├── store/
│   │   │   └── store.js                 # Redux store configuration
│   │   ├── utils/
│   │   │   ├── authSlice.js             # Authentication state
│   │   │   ├── axiosClient.js           # Axios configuration
│   │   │   └── constant.js
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── nginx.conf
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Docker & Docker Compose (for containerized deployment)
- Judge0 API credentials

### Environment Variables

Create `.env` file in the `Backend` directory:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Judge0 API
JUDGE0_API_URL=your_judge0_api_url
JUDGE0_API_KEY=your_judge0_api_key
```

Create `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:4000
```

### Local Development

#### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

#### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:4000`.

### Docker Deployment

Build and run all services using Docker Compose:

```bash
docker-compose up --build
```

This will start:

- Nginx reverse proxy on port 80
- React frontend on port 3000 (internal)
- Express backend on port 4000 (internal)

## 🔑 API Endpoints

### Authentication

- `POST /user/signup` - Register new user
- `POST /user/login` - User login
- `POST /user/logout` - User logout
- `GET /user/checkAuth` - Verify authentication status

### Problems

- `GET /problem/all` - Get all problems
- `GET /problem/:id` - Get problem by ID
- `POST /problem/create` - Create new problem (Admin only)
- `PUT /problem/update/:id` - Update problem (Admin only)
- `DELETE /problem/delete/:id` - Delete problem (Admin only)

### Submissions

- `POST /submission/submit` - Submit code for evaluation
- `GET /submission/history` - Get user submission history
- `GET /submission/:id` - Get specific submission details

### Video Solutions

- `POST /video/upload` - Upload video solution (Admin only)
- `GET /video/:problemId` - Get video solution for problem

## 👥 User Roles

### Regular User

- View and solve problems
- Submit code solutions
- View submission history
- Access video solutions

### Admin

- All user permissions
- Create, update, and delete problems
- Upload video solutions
- Manage test cases

## 🌐 Deployment

The application is deployed on AWS using Docker containers:

- Frontend and backend are containerized
- Nginx acts as a reverse proxy
- Docker Compose orchestrates all services
- Environment-specific configurations via .env files

## 📝 Database Schema

### User

- firstName, lastName
- emailId (unique)
- password (hashed)
- role (user/admin)
- age, gender

### Problem

- title, description
- difficulty (easy/medium/hard)
- tags (array/linkedList/graph/dp)
- visibleTestCases[]
- hiddenTestCases[]
- constraints, hints

### Submission

- userId
- problemId
- code, language
- status, verdict
- executionTime, memory
- timestamp

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 👨‍💻 Author

**Gaurav Maurya**

## 🙏 Acknowledgments

- Judge0 API for code execution infrastructure
- LeetCode for inspiration
- MongoDB Atlas for database hosting
- Cloudinary for media storage

---
