export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un rol sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                success: false,
                msg: `Usuario no autorizado. Posee un rol '${req.usuario.role}', los roles autorizados son: ${roles.join(', ')}`
            });
        }
        next();
    };
};
