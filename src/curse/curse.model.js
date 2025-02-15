import { Schema, model } from "mongoose";

const CourseSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            unique: true
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        students: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Course', CourseSchema);
