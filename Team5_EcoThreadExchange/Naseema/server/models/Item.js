import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    size: { type: String, required: true },
    condition: { type: String, required: true },
    preferences: { type: String },
    image: { type: String, required: true }, // Path to the uploaded image
});

const Item = mongoose.model('Item', ItemSchema);

export default Item;
