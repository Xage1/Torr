import "express";

declare global {
    namespace Express {
        interface User {
            id: number;
            email: string;
            role: "ADMIN" | "CUSTOMER";
        }

        interface Request {
            user?: User;
            session?: {
                id: number;
            };
        }
    }
}

export {};