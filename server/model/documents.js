const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const DocumentSchema = new Schema(
  {
    name: { type: String },
    id: { type: String },
    body: { type: String },
    timeCreated: { type: Date},
    timeModified: { type: Date}
  },
  { timestamps: true },
);

module.exports = mongoose.model('Document', DocumentSchema);
