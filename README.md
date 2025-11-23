# Resume Builder Application

A full-stack resume builder application with Next.js, Ant Design, Express, and Prisma.

## Features

- User authentication (register, login, logout)
- Create, edit, and delete resumes
- Multiple professional templates (Classic, Modern, Minimal)
- Rich-text editing with HTML support
- Auto-save functionality (every 10 seconds)
- Real-time preview
- PDF export with Puppeteer
- Responsive design with Ant Design

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Ant Design v5
- TypeScript
- TanStack Query (React Query)
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT Authentication
- Puppeteer (PDF generation)
- Handlebars (templating)

## Project Structure

```
resume updater/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── resumeController.js
│   │   │   └── pdfController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── resumeRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── resumeService.js
│   │   │   └── pdfService.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validate.js
│   │   ├── templates/
│   │   │   ├── classic.html
│   │   │   ├── modern.html
│   │   │   └── minimal.html
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   └── resume/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Providers.tsx
│   │   │   ├── AutosaveIndicator.tsx
│   │   │   ├── ResumeListCard.tsx
│   │   │   └── TemplateSelector.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── hooks.ts
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── .env.local
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Open `backend/.env`
   - Update the `DATABASE_URL` with your MySQL credentials:
     ```
     DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/resume_builder"
     ```
   - Replace `USERNAME` and `PASSWORD` with your MySQL credentials
   - Change `JWT_SECRET` to a secure random string

4. Create the database:
   ```bash
   # Log into MySQL
   mysql -u root -p

   # Create database
   CREATE DATABASE resume_builder;
   exit;
   ```

5. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The `.env.local` file is already configured for local development
   - If your backend runs on a different port, update `NEXT_PUBLIC_API_URL`

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Log in with your credentials
4. Click "Create New Resume" to start building your resume
5. Fill in your information in the editor
6. The resume will auto-save every 10 seconds
7. Click "Preview" to see how your resume looks
8. Click "Export PDF" to download your resume as a PDF

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Resume
- `GET /api/resume` - Get all resumes for current user
- `POST /api/resume` - Create new resume
- `GET /api/resume/:id` - Get resume by ID
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume

### Export
- `POST /api/resume/:id/export/pdf` - Export resume as PDF

### Templates
- `GET /api/resume/templates/list` - Get available templates

## Database Schema

### User Table
- `id` - Auto-incrementing primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - Optional user name
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Resume Table
- `id` - Auto-incrementing primary key
- `userId` - Foreign key to User
- `title` - Resume title
- `template` - Template name (classic, modern, minimal)
- `content` - JSON object containing resume data
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Resume Content Structure

```json
{
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/johndoe",
    "website": "johndoe.com"
  },
  "summary": "<p>Experienced software engineer...</p>",
  "experience": [
    {
      "company": "Tech Corp",
      "title": "Senior Developer",
      "from": "Jan 2020",
      "to": "Present",
      "html": "<ul><li>Led team of 5</li><li>Built microservices</li></ul>"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "B.S. Computer Science",
      "from": "2016",
      "to": "2020",
      "html": "<p>GPA: 3.8/4.0</p>"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Description",
      "html": "<ul><li>Feature 1</li></ul>"
    }
  ]
}
```

## Available Templates

### 1. Classic
Traditional professional resume with serif fonts and clear sections.

### 2. Modern
Contemporary design with gradient sidebar and clean typography.

### 3. Minimal
Simple and elegant layout with monospace fonts.

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Build and start:
   ```bash
   npm start
   ```

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = your backend URL
4. Deploy

## Security Features

- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Input validation with Joi
- CORS protection
- Helmet security headers
- SQL injection prevention with Prisma

## Troubleshooting

### Puppeteer Issues
If you encounter Puppeteer errors:
- Windows: Make sure you have the latest Chrome installed
- Linux: Install required dependencies:
  ```bash
  sudo apt-get install -y chromium-browser
  ```

### Database Connection Issues
- Verify MySQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### CORS Issues
- Verify CLIENT_URL in backend .env matches your frontend URL
- Check that credentials are being sent with requests

## Future Enhancements

- Rich text editor (TipTap integration)
- More templates
- Resume sharing
- PDF customization options
- Export to Word format
- Resume analytics

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.
