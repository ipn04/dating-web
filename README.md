# Dating Web Application Frontend

📂 **Repository:** https://github.com/ipn04/dating-web.git

## Features

### User Authentication & Profile
- **User Registration**: Sign up with email, password, and profile information (name, age, bio, profile picture).
- **Login & Logout**: Secure login and logout functionality.
- **Profile Management**: Update profile details and upload a new profile picture.

### User Interaction
- **Browse Users**: View other users and filter by age range.
- **Matchmaking**: Like and match with other users.
- **Real-time Chat**: Chat with matches in real time using WebSockets.

### UI & UX
- **Responsive Design**: Works on desktop and mobile devices.
- **Dark & Light Mode**: Toggle between themes.
- **Smooth Scroll Navigation**: Navigate to sections like Home, About, How it Works.

### Other Features
- **Integration with Backend API**: Communicates with NestJS backend for authentication, users, matches, and chat.
- **AWS S3 Integration**: Upload and display profile pictures securely.

---

## Installation & Setup

1. **Clone Repository**

```bash
git clone https://github.com/ipn04/dating-web.git
cd dating-web
```

2. **Install Dependencies**

```bash
npm install
```

3. **Copy the env.example and rename it to .env**

4. **Run the app**

```bash
npm run dev
```