# S3 with CloudFront - Image Upload & Retrieval

This repository provides a complete setup to upload images to AWS S3 and serve them via AWS CloudFront using an Express backend and a React frontend. The backend stores metadata using PostgreSQL with Prisma ORM.

## Features
- Upload images to AWS S3 via Express API
- Store image metadata in PostgreSQL using Prisma ORM
- Retrieve images via AWS CloudFront
- Delete images and automatically invalidate CloudFront cache
- React frontend to upload and display images

---

## Table of Contents
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [License](#license)

---

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (>= 18)
- PostgreSQL
- AWS Account with IAM credentials for S3 and CloudFront

### Clone the repository
```sh
$ git clone https://github.com/ratishjain12/s3-with-cloudfront.git
$ cd s3-with-cloudfront
```

---

## Environment Variables

Create a `.env` file in the `express/` directory using `.env.example` as a reference:
```sh
BUCKET_NAME=your-s3-bucket-name
SECRET_ACCESS_KEY=your-aws-secret-access-key
ACCESS_KEY_ID=your-aws-access-key-id
CLOUDFRONT_URL=your-cloudfront-distribution-url
DISTRIBUTION_ID=your-cloudfront-distribution-id
DATABASE_URL=your-postgresql-connection-string
```

---

## Backend Setup
Navigate to the `express/` directory:

### Install Dependencies
```sh
$ cd express
$ npm install
```

### Run Database Migrations
```sh
$ npx prisma migrate dev --name init
```

### Start the Server
```sh
$ npm run dev
```
The backend will run on `http://localhost:8000`

---

## Frontend Setup
Navigate to the `react/` directory:

### Install Dependencies
```sh
$ cd ../react
$ npm install
```

### Start the Development Server
```sh
$ npm run dev
```
The frontend will run on `http://localhost:5173`

---

## API Endpoints

### Upload Image
```http
POST /api/post
```
**Request:** (multipart/form-data)
```sh
image: (File)
caption: (String)
```
**Response:**
```json
{
  "id": 1,
  "image_name": "random_generated_name",
  "caption": "Sample Caption"
}
```

### Get All Images
```http
GET /api/posts
```
**Response:**
```json
[
  {
    "id": 1,
    "image_name": "random_generated_name",
    "caption": "Sample Caption",
    "url": "https://your-cloudfront-url/random_generated_name"
  }
]
```

### Delete Image
```http
DELETE /api/post/:id
```
**Response:**
```json
{
  "id": 1,
  "image_name": "random_generated_name",
  "caption": "Sample Caption"
}
```

---

## Project Structure
```
ratishjain12-s3-with-cloudfront/
├── express/               # Backend API
│   ├── index.js           # Main Express server
│   ├── package.json       # Node dependencies
│   ├── .env.example       # Environment variables template
│   ├── prisma/            # Prisma ORM configurations
│   │   ├── schema.prisma  # Database schema
│   │   └── migrations/    # Database migrations
│   └── .gitignore         # Ignored files
├── react/                 # Frontend application
│   ├── src/               # React components
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # React entry point
│   │   └── assets/        # Static assets
│   ├── public/            # Public files
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── .gitignore         # Ignored files
│   └── README.md          # Frontend documentation
└── README.md              # Main documentation
```



