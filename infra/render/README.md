# Render deployment notes

- Create a Docker service per microservice using the Dockerfile in each service folder.
- Set `MONGO_URI` to your MongoDB (e.g., Atlas) connection string in each service environment.
- For the frontend, deploy to Vercel (or Render static) and set the API base URL to the API Gateway on Render.

Environment vars to set per service:
- MONGO_URI
- NODE_ENV=production
- EXTERNAL_AI_API_KEY (optional)
