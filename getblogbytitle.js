import express from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2/promise';

// Create Express app
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors({ origin: '*', credentials: true }));
app.use(cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connection configuration
const dbConfig = {
  host: "selectcardcustomers.cbg8oyggkzt8.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Kalyan9751",
  database: "CollectIntel",
};

// Function to get a database connection
async function getConnection() {
  const connection = await createConnection(dbConfig);
  return connection;
}

// Handle GET request to fetch a blog post by title
app.get('/getblogbytitle', async (req, res) => {
  const { title } = req.query;

  // Check if 'title' parameter is provided
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Missing 'title' parameter.",
    });
  }

  try {
    const connection = await getConnection();

    // Log for debugging
    console.log(`Fetching blog with title: ${title}`);

    const [rows] = await connection.execute(
      'SELECT * FROM addBlogdocuments WHERE title = ?',
      [title]
    );

    await connection.end();

    // Check if any matching blog post was found
    if (rows.length > 0) {
      res.status(200).json({
        success: true,
        data: rows[0],  // Return the first matched document
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: "Database error: " + error.message,
    });
  }
});

// Handle preflight OPTIONS request
app.options('/getblogbytitle', (req, res) => {
  res.sendStatus(200);
});

// Default route for invalid endpoints
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
