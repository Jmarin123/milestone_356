const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// can be .png or .jpeg
const MediaSchema = new Schema(
  {
    name: { type: String },
    id: { type: String },
    mimeType: {type: String },
    content: { type: String }
  },
  { timestamps: true },
);

module.exports = mongoose.model('Media', MediaSchema);
