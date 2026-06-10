import { Request, Response, NextFunction } from 'express';

export const validateUserCreate = (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password, rol } = req.body;

    // Expresiones regulares
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    // Letras, espacios, acentos y algunos caracteres comunes
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;

    const emailValue = email?.trim();
    const nameValue = name?.trim();
    const passwordValue = password?.trim();

    // EMAIL
    if (
        typeof emailValue !== 'string' ||
        emailValue.length < 4 ||
        emailValue.length > 255 ||
        !emailRegex.test(emailValue)
    ) {
        return res.status(400).json({
            error: 'El campo "email" es inválido'
        });
    }

    // NOMBRE
    if (
        typeof nameValue !== 'string' ||
        nameValue.length < 4 ||
        nameValue.length > 100 ||
        !nameRegex.test(nameValue)
    ) {
        return res.status(400).json({
            error: 'El campo "name" es inválido'
        });
    }

    // PASSWORD
    if (
        typeof passwordValue !== 'string' ||
        passwordValue.length < 8 ||
        passwordValue.length > 64
    ) {
        return res.status(400).json({
            error: 'La contraseña debe tener al menos 8 caracteres'
        });
    }

    // ROL (solo 0 o 1)
    if (
        rol === undefined ||
        rol === null ||
        !Number.isInteger(rol) ||
        ![0, 1].includes(rol)
    ) {
        return res.status(400).json({
            error: 'El campo "rol" debe ser 0 o 1'
        });
    }

    next();
};
