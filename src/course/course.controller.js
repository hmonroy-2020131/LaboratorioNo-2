import { request, response } from "express";
import mongoose from "mongoose";
import Course from "./course.model.js";
import User from '../users/user.model.js';  

export const getCourses = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, courses] = await Promise.all([
            Course.countDocuments(query),
            Course.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('teacher', 'name')   
                .populate('students', 'name')  
        ]);

        res.status(200).json({
            success: true,
            total,
            courses
        });
    } catch (error) {
        console.error(error);  
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los cursos',
            error: error.message || error
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id)
            .populate('teacher', 'name uid') 
            .populate('students', 'name uid');  

        if (!course) {
            return res.status(404).json({
                success: false,
                msg: "Curso no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            total: 1,
            courses: [
                {
                    _id: course._id,
                    title: course.title,
                    description: course.description,
                    teacher: course.teacher,  
                    students: course.students, 
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt
                }
            ]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener el curso",
            error
        });
    }
};


export const createCourse = async (req, res = response) => {
    try {
        const { title, description, teacher, students = [] } = req.body;
        const validStudents = await User.find({ '_id': { $in: students } });
        if (validStudents.length !== students.length) {
            return res.status(400).json({
                success: false,
                msg: 'Algunos de los estudiantes no son válidos'
            });
        }

        const course = new Course({
            title,
            description,
            teacher,
            students
        });

        await course.save();

        await User.updateMany(
            { '_id': { $in: students } },
            { $push: { courses: course._id } }  
        );

        res.status(201).json({
            success: true,
            msg: 'Curso creado',
            course
        });
    } catch (error) {
        console.error(error);  
        res.status(500).json({
            success: false,
            msg: 'Error al crear el curso',
            error: error.message || error
        });
    }
};

export const updateCourse = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { title, description, students } = req.body;

        if (students) {
            const validStudents = await User.find({ '_id': { $in: students } });
            if (validStudents.length !== students.length) {
                return res.status(400).json({
                    success: false,
                    msg: 'Algunos de los estudiantes no son válidos'
                });
            }
        }

        const course = await Course.findByIdAndUpdate(id, { title, description, students }, { new: true });

        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Curso actualizado',
            course
        });
    } catch (error) {
        console.error(error);  
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el curso',
            error: error.message || error
        });
    }
};

export const deleteCourse = async (req, res = response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "ID de curso no válido" });
        }

        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                msg: "Curso no encontrado"
            });
        }

        await User.updateMany(
            { courses: id },
            { $pull: { courses: id } } 
        );

        res.status(200).json({
            success: true,
            msg: "Curso eliminado y removido de los usuarios",
            course
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al eliminar el curso",
            error: error.message || error
        });
    }
};
