import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser, updateUserPassword , asignarCursoAEstudiante} from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getUsers);

router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);


router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUserPassword
);

router.post(
    "/:id/courses", 
    [
        validarJWT, 
        tieneRole("STUDENT_ROLE", "ADMIN_ROLE"),
        check("id", "No es un ID válido").isMongoId(), 
        check("id").custom(existeUsuarioById), 
        check("courseId", "El curso es obligatorio").notEmpty(), 
        validarCampos
    ],
    asignarCursoAEstudiante 
);


export default router;
