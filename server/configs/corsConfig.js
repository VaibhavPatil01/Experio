const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://interview-experience-gsmcoe.vercel.app",
  "https://interview-experience-gsmcoe.onrender.com",
  "https://experio-beryl.vercel.app",
  "https://experio-mll8.onrender.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

export default corsOptions;
