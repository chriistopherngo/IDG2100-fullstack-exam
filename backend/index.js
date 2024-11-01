// Most code reused from Ola's Oblig 2 – also essentially identical to code covered in classes
// New from Oblig 3: CORS, /api/auth, /api/bulk-add, /api/bulk-edit
// New additions: cookie-parser middleware, combined bulk add and edit into one route

// Declare dependencies and variables
const express = require("express")
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 2100
const connectDB = require("./utils/connectDB")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const swaggerDoc = require("swagger-ui-express")
const swaggerDocumentation = require("./documentation/swagger/documentation")
const path = require("path")
const {iconUpload} = require("./utils/multerSetup")

// Creates an express application
const app = express()
// Configures express to parse JSON data passed through the body
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// Calls connectDB, which connects to the database
connectDB()

const corsOptions = {
    origin: "http://localhost:10453",
    credentials: true
}
// Configures express to use the CORS policy, allowing communication between the frontend and backend
app.use(cors(corsOptions))
// Configures express to use the cookie-parser middleware
app.use(cookieParser())

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.post('/uploads', (req, res, next) => {
    const upload = iconUpload.single('default_icon');
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        res.status(200).send('Icon updated successfully');
    });
});
  
// Defines endpoints and connects them to routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/assessment", require("./routes/assessmentRoutes"))
app.use("/api/mission", require("./routes/missionRoutes"))
app.use("/api/user", require("./routes/userRoutes"))
app.use("/api/search", require("./routes/searchRoutes"))
app.use("/api/bulk", require("./routes/bulkRoutes"))
app.use("/api/scheme", require("./routes/schemeRoutes"))
// Swagger
app.use(
    "/api/documentation",
    swaggerDoc.serve,
    swaggerDoc.setup(swaggerDocumentation, {
        customSiteTitle: "SUPER Assessor Docs", // custom documentation page title
        // customfavIcon: "./swagger/favicon.png", // custom documentation page icon
        // withCredentials: true // allows sending cookies I think?? probably useful for us?
    })
)

// Starts the server on the port defined using the .env file
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

