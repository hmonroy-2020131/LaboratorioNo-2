import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            maxLength: [25, "Cannot exceed 25 characters"]
        },
        surname: {
            type: String,
            required: [true, "Surname is required"],
            maxLength: [25, "Cannot exceed 25 characters"]
        },
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: 8
        },
        profilePicture: {
            type: String,
        },
        phone: {
            type: String,
            minLength: 8,
            maxLength: 8,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["TEACHER_ROLE", "STUDENT_ROLE"],
        },
        courses: [{
            type: Schema.Types.ObjectId,
            ref: "Course",
            validate: {
                validator: function (v) {
                    return this.role === "STUDENT_ROLE" ? v.length <= 3 : true;
                },
                message: "Students can only be assigned to a maximum of 3 courses"
            }
        }],        
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default model('User', UserSchema);
