import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "El rol es obligatorio"],
        unique: true,
        enum: ["TEACHER_ROLE", "STUDENT_ROLE"]
    }
});

export default mongoose.model("Role", RoleSchema);
