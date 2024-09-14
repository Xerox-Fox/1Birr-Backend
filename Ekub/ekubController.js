const conn = require('../db/dbConfig'); // Database connection

class Ekub {
    constructor(contributionAmount) {
        this.contributionAmount = contributionAmount;
        this.currentRound = 0;
    }

    // Add a new member to the Ekub and save to the database
    async addMember(memberName, ekubId) {
        try {
            // Check if the Ekub exists
            const [ekub] = await conn.execute("SELECT * FROM ekub_list WHERE id = ?", [ekubId]);

            if (ekub.length === 0) {
                throw new Error("Invalid Ekub ID.");
            }

            // Set the member limit (12 members)
            const maxMembers = 12;

            // Get the current number of members in this Ekub
            const [members] = await conn.execute("SELECT COUNT(*) AS count FROM ekub_members WHERE ekub_id = ?", [ekubId]);

            if (members[0].count >= maxMembers) {
                return `This Ekub has reached its maximum number of members (${maxMembers}).`;
            }

            // Check if the member already exists in this Ekub
            const [existingMember] = await conn.execute(
                "SELECT * FROM ekub_members WHERE name = ? AND ekub_id = ?",
                [memberName, ekubId]
            );

            if (existingMember.length > 0) {
                return `The member ${memberName} is already part of this Ekub.`;
            }

            // Insert new member into the specified Ekub
            await conn.execute(
                "INSERT INTO ekub_members (name, ekub_id) VALUES (?, ?)",
                [memberName, ekubId]
            );

            return `${memberName} has joined the Ekub.`;
        } catch (error) {
            console.log("Error adding member:", error.message);
            throw new Error("Failed to add member.");
        }
    }

    // Run the Ekub round and distribute the money to the next member
    async runRound(ekubId) {
        try {
            const [members] = await conn.execute(
                "SELECT * FROM ekub_members WHERE ekub_id = ? AND has_received_money = 0", 
                [ekubId]
            );

            // Same logic for distributing money
        } catch (error) {
            throw new Error("Failed to run Ekub round.");
        }
    }

    // Get the current status of all Ekub members
    async getStatus(ekubId) {
        try {
            const [members] = await conn.execute("SELECT * FROM ekub_members WHERE ekub_id = ?", [ekubId]);

            // Same logic for getting status
        } catch (error) {
            throw new Error("Failed to fetch status.");
        }
    }
}

const ekub = new Ekub(100); // Each member contributes 100 units

module.exports = ekub;
