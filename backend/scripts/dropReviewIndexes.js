/**
 * Drop stale unique indexes on the reviews collection
 * that prevent multiple reviews per guide across bookings.
 * 
 * Run once: node scripts/dropReviewIndexes.js
 * Or it runs automatically on server start.
 */

const mongoose = require("mongoose");
require("dotenv").config();

async function dropStaleIndexes() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/cultour";
  
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const collection = mongoose.connection.collection("reviews");
    const indexes = await collection.indexes();
    
    console.log("Current indexes on reviews collection:");
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)} ${idx.unique ? '(UNIQUE)' : ''}`);
    });

    // Drop problematic unique compound indexes
    const problematicIndexes = [
      "user_1_destination_1",
      "user_1_guide_1_booking_1",
      "user_1_guide_1",
      "user_1_cuisine_1",
    ];

    for (const indexName of problematicIndexes) {
      try {
        await collection.dropIndex(indexName);
        console.log(`✅ Dropped index: ${indexName}`);
      } catch (err) {
        if (err.codeName === "IndexNotFound") {
          console.log(`⏭️  Index not found (already dropped): ${indexName}`);
        } else {
          console.log(`⚠️  Could not drop ${indexName}: ${err.message}`);
        }
      }
    }

    console.log("\nDone! Stale indexes cleaned up.");
    
    // If run standalone, disconnect
    if (require.main === module) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (err) {
    console.error("Error:", err.message);
    if (require.main === module) process.exit(1);
  }
}

module.exports = dropStaleIndexes;

// Run if executed directly
if (require.main === module) {
  dropStaleIndexes();
}
