const db = require("../db/dbConfig");
const { StatusCodes } = require('http-status-codes');

async function addPerson(req, res) {
    const { name, description, datelost, phone, status } = req.body;

    // Debugging logs to check input
    console.log('Received data:', { name, description, datelost, phone, status });

    // Check if all required fields are provided
    if (!name || !description || !datelost || !phone || !status) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide all required information" });
    }

    try {
        // Check if the person already exists in the system
        const [existingUser] = await db.query("SELECT name FROM lost_people WHERE name = ?", [name]);

        // If a user with the same name exists, return a message
        if (existingUser.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Person already registered" });
        }

        // Insert the new person into the database
        const result = await db.query(
            "INSERT INTO lost_people (name, description, date_lost, phone, status) VALUES (?, ?, ?, ?, ?)", 
            [name, description, datelost, phone, status]
        );

        // Debugging log to check the insert query result
        console.log('Insert result:', result);

        return res.status(StatusCodes.CREATED).json({ msg: "The person has been added to the list" });
    } catch (error) {
        // Log the actual error message for debugging
        console.error('Error during insertion:', error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong, try again later!" });
    }
}

async function seeAllPersons(req, res) {
    try {
        const [items] = await db.query("SELECT * FROM lost_people");

        // If no items are found
        if (items.length === 0) {
            return res.status(StatusCodes.OK).send("<h3>No lost people found</h3>");
        }

        // Create an HTML table
        let html = `
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Person ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Date Lost</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Loop through each item and add a row to the table
        items.forEach(item => {
            html += `
                <tr>
                    <td>${item.lost_id}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.date_lost}</td>
                    <td>${item.phone}</td>
                    <td>${item.status}</td>
                    <td>${item.image}</td>
                </tr>
            `;
        });

        // Close the table tag
        html += `
                </tbody>
            </table>
        `;

        // Send the HTML response
        return res.status(StatusCodes.OK).send(html);
    } catch (error) {
        console.error('Error retrieving data:', error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to retrieve data, try again later!" });
    }
}
async function reportFound(req, res) {
    const { name } = req.body;

    if (!name) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide a valid person name" });
    }

    try {
        // Update the status of the person to 'Found'
        const result = await db.query(
            "UPDATE lost_people SET status = 'Found' WHERE name = ?", 
            [name]
        );

        if (result.affectedRows === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Can't find the person in the database" });
            console.log(result.affectedRows);
        }

        return res.status(StatusCodes.OK).json({ msg: "Person marked as found." });
        console.log(result.affectedRows);
    } catch (error) {
        console.error('Error during update:', error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong, try again later!" });
        console.log(error);
    }
}

module.exports = { addPerson, seeAllPersons, reportFound };
