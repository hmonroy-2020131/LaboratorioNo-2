import { validationResult } from 'express-validator';

export const validarCampos = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: "Error en los campos de la petición",
            errors: errors.array()
        });
    }

    next();
};
