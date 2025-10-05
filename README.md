# 🎬 VideoTube - YouTube Clone

VideoTube is a full-stack web application inspired by YouTube, built with the **MERN stack** (MongoDB, Express.js, React, Node.js). It allows users to upload, watch, like, comment on videos, and subscribe to channels.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Documentation](#-api-documentation)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🚀 Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📤 **Video Upload** - Upload videos with thumbnails
- ▶️ **Video Streaming** - Watch videos with responsive player
- 👍 **Like System** - Like videos, comments, and tweets
- 💬 **Comments** - Add, edit, and delete comments
- 📊 **Channel Analytics** - View channel statistics and metrics
- 📜 **Subscriptions** - Subscribe/unsubscribe to channels
- 📝 **Tweet System** - Create and interact with tweet-like posts
- ❤️ **Playlists** - Create and manage video playlists
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Performance Optimized** - Fast loading with pagination

---

## 🛠️ Tech Stack

### Frontend

- **React** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Context API** - State management

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Media storage (optional)

### Development Tools

- **Nodemon** - Development server
- **Postman** - API testing

---

## 📖 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

All endpoints (except auth endpoints) require JWT authentication via Bearer token.

### Authentication Endpoints

| Method  | Endpoint                 | Description          | Auth Required |
| ------- | ------------------------ | -------------------- | ------------- |
| `POST`  | `/users/register`        | Register new user    | No            |
| `POST`  | `/users/login`           | Login user           | No            |
| `POST`  | `/users/logout`          | Logout user          | Yes           |
| `POST`  | `/users/refresh-token`   | Refresh access token | No            |
| `GET`   | `/users/current-user`    | Get current user     | Yes           |
| `POST`  | `/users/change-password` | Change password      | Yes           |
| `PATCH` | `/users/update-account`  | Update account       | Yes           |
| `PATCH` | `/users/avatar`          | Update avatar        | Yes           |
| `PATCH` | `/users/cover-image`     | Update cover image   | Yes           |
| `GET`   | `/users/c/:username`     | Get channel profile  | Yes           |
| `GET`   | `/users/history`         | Get watch history    | Yes           |

### Video Endpoints

| Method   | Endpoint                | Description           | Auth Required |
| -------- | ----------------------- | --------------------- | ------------- |
| `GET`    | `/videos`               | Get all videos        | No            |
| `POST`   | `/videos/publish`       | Upload video          | Yes           |
| `GET`    | `/videos/:videoId`      | Get video details     | Yes           |
| `PATCH`  | `/videos/:videoId/edit` | Update video          | Yes           |
| `DELETE` | `/videos/:videoId`      | Delete video          | Yes           |
| `PATCH`  | `/videos/:videoId`      | Toggle publish status | Yes           |

### Subscription Endpoints

| Method | Endpoint                    | Description             | Auth Required |
| ------ | --------------------------- | ----------------------- | ------------- |
| `POST` | `/subscriptions/:channelId` | Toggle subscription     | Yes           |
| `GET`  | `/subscriptions/:channelId` | Get subscribers         | Yes           |
| `GET`  | `/subscriptions`            | Get subscribed channels | Yes           |

### Playlist Endpoints

| Method   | Endpoint                                 | Description                | Auth Required |
| -------- | ---------------------------------------- | -------------------------- | ------------- |
| `GET`    | `/playlists`                             | Get user playlists         | Yes           |
| `POST`   | `/playlists`                             | Create playlist            | Yes           |
| `GET`    | `/playlists/:playlistId`                 | Get playlist               | Yes           |
| `PATCH`  | `/playlists/:playlistId`                 | Update playlist            | Yes           |
| `DELETE` | `/playlists/:playlistId`                 | Delete playlist            | Yes           |
| `PATCH`  | `/playlists/add/:playlistId/:videoId`    | Add video to playlist      | Yes           |
| `PATCH`  | `/playlists/remove/:playlistId/:videoId` | Remove video from playlist | Yes           |

### Like Endpoints

| Method | Endpoint                    | Description             | Auth Required |
| ------ | --------------------------- | ----------------------- | ------------- |
| `POST` | `/likes/video/:videoId`     | Toggle video like       | Yes           |
| `GET`  | `/likes/video/:videoId`     | Get video likes count   | Yes           |
| `POST` | `/likes/comment/:commentId` | Toggle comment like     | Yes           |
| `GET`  | `/likes/comment/:commentId` | Get comment likes count | Yes           |
| `POST` | `/likes/tweet/:tweetId`     | Toggle tweet like       | Yes           |
| `GET`  | `/likes/tweet/:tweetId`     | Get tweet likes count   | Yes           |
| `GET`  | `/likes`                    | Get user's liked videos | Yes           |

### Comment Endpoints

| Method   | Endpoint                 | Description        | Auth Required |
| -------- | ------------------------ | ------------------ | ------------- |
| `GET`    | `/comments/:videoId`     | Get video comments | Yes           |
| `POST`   | `/comments/:videoId`     | Add comment        | Yes           |
| `PATCH`  | `/comments/c/:commentId` | Update comment     | Yes           |
| `DELETE` | `/comments/c/:commentId` | Delete comment     | Yes           |

### Tweet Endpoints

| Method   | Endpoint                 | Description     | Auth Required |
| -------- | ------------------------ | --------------- | ------------- |
| `POST`   | `/tweets`                | Create tweet    | Yes           |
| `GET`    | `/tweets/user/:username` | Get user tweets | Yes           |
| `PATCH`  | `/tweets/:tweetId`       | Update tweet    | Yes           |
| `DELETE` | `/tweets/:tweetId`       | Delete tweet    | Yes           |

### Dashboard Endpoints

| Method | Endpoint                    | Description        | Auth Required |
| ------ | --------------------------- | ------------------ | ------------- |
| `GET`  | `/dashboard/stats/:userId`  | Get channel stats  | Yes           |
| `GET`  | `/dashboard/videos/:userId` | Get channel videos | Yes           |

### Health Check

| Method | Endpoint       | Description  | Auth Required |
| ------ | -------------- | ------------ | ------------- |
| `GET`  | `/healthcheck` | Health check | No            |

---

## ⚙️ Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Pranav8206/VideoTube.git
cd videotube
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/videotube
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
```

### 5. Start the Application

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory, in a new terminal)
npm start
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔧 Environment Variables

| Variable             | Description                              | Example                               |
| -------------------- | ---------------------------------------- | ------------------------------------- |
| `PORT`               | Backend server port                      | `5000`                                |
| `MONGODB_URI`        | MongoDB connection string                | `mongodb://localhost:27017/videotube` |
| `JWT_SECRET`         | Secret key for JWT tokens                | `your_jwt_secret`                     |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens            | `your_refresh_secret`                 |
| `CLOUDINARY_*`       | Cloudinary credentials for media storage | (Optional)                            |
| `CORS_ORIGIN`        | Allowed origin for CORS                  | `http://localhost:5000`               |

---

## 📁 Project Structure

```
videotube/
|
├── backend/
│   ├── controllers/     # Route controllers
│   ├── db/              # Database configuration
│   ├── middlewares/     # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── app.js           # Express app setup
|
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── context/     # React context API
│       └── utils/       # Utility functions
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

---

## 🙏 Acknowledgments

- Inspired by YouTube
- Built with the MERN stack
- Icons from [Lucide icons](https://lucide.dev//)
- UI components with Tailwind CSS

---

**Note**: This is a only portfolio project.
