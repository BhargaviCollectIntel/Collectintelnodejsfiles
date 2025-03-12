import express from "express";
import mysql from "mysql2";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
// Use a MySQL connection pool instead of a single connection
const db = mysql.createPool({
    connectionLimit: 10, // Allows multiple connections
    host: "selectcardcustomers.cjmo02o4ck7j.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "Collectintel123",
    database: "CollectIntel",
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database Connection Failed:", err);
    } else {
        console.log("Connected to MySQL Database");
        connection.release(); // Release connection back to pool
    }
});


// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Change to 465 if using SSL
    secure: true,
    auth: {
        user: "collectintelpvtltd@gmail.com",
        pass: "gxtz qrer qibt urhl",
    },
});

// Send Email API
app.post("/send-email", (req, res) => {
    const { recipient_email } = req.body;

    if (!recipient_email || !/\S+@\S+\.\S+/.test(recipient_email)) {
        return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    // Fetch the most recent email template based on created_at
    const sql = "SELECT * FROM emailTemplate WHERE recipient_email = ? ORDER BY created_at DESC LIMIT 1";
    
    db.query(sql, [recipient_email], (err, results) => {
        if (err) {
            console.error("Database Query Failed:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "No email template found" });
        }

        const row = results[0];
        const client_name = row.client_name;
        const email_content = row.email_content;
        const imageUrl = row.image_url; // ✅ Now correctly using image URL
        const facebookUrl = "https://collectintel.in/emailtemplateicons/facebook.png";
        const instagramUrl = "https://collectintel.in/emailtemplateicons/social.png";
        const linkedinUrl = "https://collectintel.in/emailtemplateicons/linkedin.png";
        const twitterUrl = "https://collectintel.in/emailtemplateicons/twitter.png";

        if (!imageUrl.startsWith("http")) {
            console.error("Error: Invalid Image URL.");
            return res.status(400).json({ success: false, message: "Invalid Image URL in database" });
        }

        const subject = `New Email Template from ${client_name}`;

        const message = `
        <html>
        <head>
        
        </head>
        <body style="font-family: Arial, sans-serif; background-color:#f6f6f6; margin: 10px auto; padding: auto auto; width:60%;height:auto;">
        <div class='main-heading' style="color:black;text-align: center; "><h1 style="margin-top:35px;padding-top:20px">Explore Your Dreams with Collectintel Associates LLP</h1></div>
        <div class='image' style="width: 80%; margin: auto; text-align: center;">
        <img src="${imageUrl}" width="350" alt="Email Image" style="border-radius:8px;"/>
        </div>
        <div  style="text-align:center;color:black"><h1>Dear,${client_name}  </h1></div>
        <div  style="font-size: 18px;text-align:center;margin:5px 30px"><p>We are excited to introduce Collectintel Associates LLP, your trusted partner for the services mentioned below.</p></div>
       
       <div style="text-align: center; background-color: #4C6AE9; padding: 10px; display: flex; flex-direction: column; justify-content: center; color: white; border-radius: 10px; margin: 5px auto; width: 300px;">
    
       <ul style="list-style: none; padding: 0; text-align: left; margin-left: 20px;">
        <h3>We Offer the Following Services:</h3>
        
        <li style="display: flex; align-items: center; margin: 5px 12px;">
            <span style="width: 10px; height: 10px; background-color: white; border-radius: 50%; display: inline-block; margin-right: 10px; margin-top: 5px;"></span>
            SEO Services
        </li>

        <li style="display: flex; align-items: center; margin: 5px 12px;">
            <span style="width: 10px; height: 10px; background-color: white; border-radius: 50%; display: inline-block; margin-right: 10px; margin-top: 5px;"></span>
            SMO Services
        </li>

        <li style="display: flex; align-items: center; margin: 5px 12px;">
            <span style="width: 10px; height: 10px; background-color: white; border-radius: 50%; display: inline-block; margin-right: 10px; margin-top: 5px;"></span>
            Content Marketing
        </li>

        <li style="display: flex; align-items: center; margin: 5px 12px;">
            <span style="width: 10px; height: 10px; background-color: white; border-radius: 50%; display: inline-block; margin-right: 10px; margin-top: 5px;"></span>
            Web Designing
        </li>

        <li style="display: flex; align-items: center; margin: 5px 12px;">
            <span style="width: 10px; height: 10px; background-color: white; border-radius: 50%; display: inline-block; margin-right: 10px; margin-top: 5px;"></span>
            Pay Per Click Services
        </li>

        <li style="display: flex; align-items: center; margin: 5px 12px;">
            <span style="width: 10px; height: 10px; background-color: white; border-radius: 50%; display: inline-block; margin-right: 10px; margin-top: 5px;"></span>
            Graphic Design Marketing
        </li>

        <li style="display: flex; align-items: center; margin: 5px 12px;">
            <span style="width: 10px; height: 10px; background-color: white; border-radius: 50%; display: inline-block; margin-right: 10px; margin-top: 5px;"></span>
            Influence Marketing
        </li>
        
        </ul>
        </div>

      

       

                        <div style="
                    font-family: 'Poppins', sans-serif; 
                    font-weight: 800; 
                    font-size: 20px; 
                    margin: 15px 40px; 
                    text-align: justify:
                    padding: 10px 40px; 
                    display: flex; 
                    flex-direction: column;  
                    justify-content: center; 
                    color: black; 
                    border-radius: 10px; 
                    width: auto; 
                    height: auto;
                    background-color:white
                ">
                    <p style="background-color:white;margin: 15px 40px;color:black;font-size:17px;font-weight:700;padding:5px">${email_content}</p>
                </div>

        <h2 style="text-align:center;color:black">Why Choose Us?</h2>
        <p style="font-size: 18px;text-align:center;margin:5px 40px;">We are dedicated to delivering exceptional service with transparency, integrity, and efficiency.  Our policies ensure secure transactions, data protection, and a seamless customer experience. </p>
        <div>

       

             

        <div  style="text-align:center">
            <h2 style="color:blue;text-align:center"> <a href="https://collectintel.in/contact-us" style="color:black;text-decoration: none;">Let's Connect </a></h2>
            <p >info@collectintel.in | <a href="https://collectintel.in">88856 00476</a> | <a href="https://collectintel.in">Visit Website</a></p>
        </div>
        <div  style="text-align:center">
            <h2 style="color:black">Our Address</h3>
        </div>
      <p style="font-size: 18px;text-align:center;margin:5px 40px;">Plot no. 40, Green Hills, Kaithalapur Flyover Rd, Bhagyanagar Colony, Madhapur, Hyderabad, Telangana 500072</p>

        <div style="
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 40px;
    margin: 20px auto;
    padding: 15px;
    width: fit-content;
    text-align: center;
    text-decoration: none;
     ">
                <a href="https://www.facebook.com/share/1LNq1LHAPo/" style="text-decoration: none;padding:10px">
                    <img src="${facebookUrl}" alt="Facebook" width="30" height="30">
                </a>
                <a href=" https://www.instagram.com/collectintel.in?igsh=dXZtaXJucnl6anEz" style="text-decoration: none;padding:10px">
                    <img src="${instagramUrl}" alt="Instagram" width="30" height="30">
                </a>
                <a href="https://www.linkedin.com/company/104473669/admin/dashboard/" style="text-decoration: none;padding:10px">
                    <img src="${linkedinUrl}" alt="LinkedIn" width="30" height="30">
                </a>
                <a href="https://x.com/Collectintelin?t=xcdVgiixPyZ9h1iOTt-yCw&s=09" style="text-decoration: none;padding:10px">
                    <img src="${twitterUrl}" alt="Twitter" width="30" height="30">
                </a>
            </div>


        </body>
        </html>`
        ;

        const mailOptions = {
            from: "collectintelpvtltd@gmail.com",
            to: recipient_email,
            subject: subject,
            html: message, // ✅ Uses image URL directly
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ success: false, message: "Failed to send email" });
            }
            console.log("Email sent successfully:", info.response);
            res.json({ success: true, message: "Email sent successfully" });
        });
    });
});





// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
