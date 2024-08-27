import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.slice('Bearer '.length);

    if (!token) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = jwt.verify(token, process.env['JWT_PASSWORD']!);

    if (!user) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    req.user = user;

    return next();
};

export default auth;