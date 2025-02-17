import { Router } from "express";
import { check } from "express-validator";
import { getCourses, getCourseById,createCourse,updateCourse,deleteCourse } from "./course.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { existeCursoById } from "../helpers/db-validator.js";

const router = Router();

router.get("/", getCourses);

router.get(
    "/:id",  // Cambiar a :id en vez de findCourse/:id
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos
    ],
    getCourseById
);

router.post(
    "/",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("title", "El título es obligatorio").not().isEmpty(),
        check("description", "La descripción es obligatoria").not().isEmpty(),
        check("students", "El campo 'students' debe ser un arreglo de IDs de estudiantes").isArray().not().isEmpty(),
        check("students.*", "Cada estudiante debe ser un ID de Mongo válido").isMongoId(),
        validarCampos
    ],
    createCourse
);


router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos
    ],
    updateCourse
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos
    ],
    deleteCourse
);

export default router;
