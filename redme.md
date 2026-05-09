# Backend (Node.js / Express/Mongoose/ )

RESTful API with endpoints:

Jobs

GET /api/jobs – List all jobs

GET /api/jobs/:id – Get job details

POST /api/jobs – Create a job (Admin)

DELETE /api/jobs/:id – Delete a job (Admin)

Applications

POST /api/applications – Submit job application

Input validation:

Required fields

Proper email format

Resume URL validation

# MongoDB Database for data storage

# Models:

Job: id, title, company, location, category, description, created_at

Application: id, job_id, name, email, resume_link, cover_note, created_at
