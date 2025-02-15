import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, esRoleValido } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "El nombre es obligatorio").not().isEmpty(),
    body("surname", "El apellido es obligatorio").not().isEmpty(),
    body("email", "Debe ingresar un correo válido").isEmail(),
    body("email").custom(existenteEmail),  
    body('role').custom(esRoleValido), 
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8}),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Ingrese un correo válido"),
    body("username").optional().isString().withMessage("Ingrese un nombre de usuario válido"),
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8}),
    validarCampos
];
