const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    material: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    itemType: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        default: [],
        required: true,
    },
    billAvailable: {
        type: Boolean,
        default: false,
        required: true,
    },
    warrantyAvailable: {
        type: Boolean,
        default: false,
        required: true,
    },
    boxAvailable: {
        type: Boolean,
        default: false,
        required: true,
    },
    showBids: {
        type: Boolean,
        default: false,
        required: true,
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:true,
    },
    status:{
        type: String,
        default: "pending",
        required: true,
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model("products", productSchema);