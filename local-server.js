import app from "./server/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend API server running locally on http://localhost:${PORT}`);
  console.log(`Test Health: http://localhost:${PORT}/api/health`);
  console.log(`Test Projects: http://localhost:${PORT}/api/projects`);
});
