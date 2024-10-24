// models/getNextSequenceValue.js
const DeletedID = require('./DeletedID');
const Counter = require('./Counter'); // Ensure you have this model

async function getNextSequenceValue(sequenceName) {
  try {
    // Check if there are any recycled IDs
    const recycledId = await DeletedID.findOne().sort({ id: 1 }).exec();
    if (recycledId) {
      await DeletedID.findByIdAndDelete(recycledId._id);  // Remove it from the recycled list
      return recycledId.id;
    }

    // Get or initialize the sequence counter
    const counter = await Counter.findByIdAndUpdate(
      sequenceName,
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    return counter.sequence_value;
  } catch (err) {
    console.error('Error getting next sequence value:', err);
    throw err;
  }
}

module.exports = getNextSequenceValue;
