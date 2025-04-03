# RoverWork 

_A streamlined platform for local job discovery and student applications._

---

## 📘 Description

**RoverWork** is a full-stack web application that connects students with local businesses for job opportunities. Students can browse available jobs, apply with resumes and cover letters, and track their application status. Businesses can post jobs, review applicants, and manage listings, all within an easy-to-use dashboard. The app features user authentication, role-based access control, and an admin messaging panel for user support.

---

## 🖥️ Live Demo

> _Coming soon…_  
> _(Consider deploying on DigitalOcean, Render, or Vercel for demo access)_

---

## 🚀 Features

- 🧑‍🎓 Student account registration & login
- 🏢 Business job posting and management
- 🔐 Secure role-based authentication (Student, Business, Admin)
- 📄 Resume & cover letter submission
- 💬 Contact form & messaging system
- ⚙️ Admin dashboard with message viewing
- 🌆 City-based job filtering (Easton, Wilson, Bethlehem, Nazareth)
- 📬 Email field for business contact

---

## 🛠️ Tech Stack

- **Frontend**: EJS templates, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: Passport.js
- **View Engine**: EJS
- **Styling**: Vanilla CSS (Modular: `navbar.css`, `auth.css`, etc.)

---

## 🧩 Directory Structure

```
RoverWork/
│
├── models/              # Mongoose schemas (Job, User, Application, Message)
├── routes/              # Express route files for different resources
├── views/               # EJS views grouped by page or feature
├── public/              # Static files (CSS, images, client JS)
├── middleware/          # Auth middleware (role-based access)
├── server.js            # App entry point
├── package.json
└── .gitignore
```

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YourUsername/RoverWork.git
cd RoverWork

# Install dependencies
npm install

# Create a .env file with the following:
# (you'll need to set these up in production)
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret

# Start the development server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file and add:

```env
MONGO_URI=mongodb://localhost:27017/RoverWork
SESSION_SECRET=yourSuperSecretString
PORT=3000
```

---

## 🧪 Usage

1. Students can register, login, and apply for jobs.
2. Businesses can register and post jobs.
3. Admin can log in to view user messages.
4. Navigate to `/jobs`, `/auth/login`, `/admin/messages`, etc.

---

## 🧰 Scripts

```bash
npm start       # Start server in production
npm run dev     # Start with nodemon for development
```

---

## 🧑‍💻 Contributing

Interested in improving RoverWork? Feel free to fork the repo and submit a pull request!

```bash
# Fork and clone the repo
git clone https://github.com/YourUsername/RoverWork.git

# Make your changes and push
git checkout -b your-feature
git push origin your-feature

# Submit a PR ✨
```

---

## 🧪 Testing

> Testing suite is not yet implemented. Consider adding:

- Jest or Mocha for unit testing
- Supertest for API testing

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

- UI inspiration: [undraw.co](https://undraw.co/)
- Built with Node.js, Express, and MongoDB 💚
- Managed and maintained by [Nicholas Ressler, Hargun Singh, and Anthony Dorsey]

---

## 📬 Contact

Have questions or suggestions?  
Reach out via the **Contact** form at `/contact` or open an issue.

---
