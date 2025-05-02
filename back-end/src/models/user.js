const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: false },
        last_name: { type: String, required: false },
        avatar: { type: String },
        gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
        date_of_birth: { type: Date, required: false },
        email: { type: String, required: [true, 'Email is require'], unique: true },
        password: { type: String, required: [true, 'Password is require'] },
        role: {
            type: String,
            enum: ["ADMIN", "USER"],
            default: "USER"
        },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        is_active: {
            type: Boolean, default: true, required: false
        },
        access_token: { type: String, required: false },
        refresh_token: { type: String, required: false },
    },
    {
        timestamps: true,
        collection: 'Users'
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;