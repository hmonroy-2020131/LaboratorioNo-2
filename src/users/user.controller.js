import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true }; 

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener usuarios",
            error
        });
    }
};


export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener el usuario",
            error
        });
    }
};


export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, courses, ...data } = req.body;

        if (password) {
            data.password = await hash(password);
        }

        if (courses) {
            const user = await User.findById(id);
            if (user.role === "STUDENT_ROLE" && courses.length > 3) {
                return res.status(400).json({
                    success: false,
                    msg: "Los estudiantes solo pueden tener hasta 3 cursos"
                });
            }
            data.courses = courses;
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({ 
            success: true, 
            msg: "Usuario actualizado", 
            user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            msg: "Error al actualizar usuario", 
            error 
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: false });
        res.status(200).json({ 
            success: true, 
            msg: "Usuario eliminado", 
            user
         });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            msg: "Error al eliminar usuario", 
            error 
        });
    }
};

export const updateUserPassword = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ 
                success: false, 
                msg: "La contraseña es requerida" 
            });
        }
        const hashedPassword = await hash(password);
        const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        res.status(200).json({ 
            success: true, 
            msg: "Contraseña actualizada", 
            user 
        });

    } catch (error) {
        res.status(500).json({ success: false, msg: "Error al actualizar la contraseña", error });
    }
};

export const asignarCursoAEstudiante = async (req, res = response) => {
    try {
        const { id } = req.params;  
        const { courseId } = req.body;

        const user = await User.findById(id);
        if (user.role !== "STUDENT_ROLE") {
            return res.status(400).json({
                success: false,
                msg: "Solo los estudiantes pueden ser asignados a cursos"
            });
        }

        if (user.courses.includes(courseId)) {
            return res.status(400).json({
                success: false,
                msg: "El estudiante ya está inscrito en este curso"
            });
        }

        if (user.courses.length >= 3) {
            return res.status(400).json({
                success: false,
                msg: "El estudiante no puede estar inscrito en más de 3 cursos"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $push: { courses: courseId } }, 
            { new: true } 
        );

        res.status(200).json({
            success: true,
            msg: "Curso asignado exitosamente",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al asignar curso",
            error
        });
    }
};
