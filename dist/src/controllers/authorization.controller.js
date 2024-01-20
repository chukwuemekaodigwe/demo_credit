"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../helpers/util");
exports.default = {
    login: (req, res, next) => {
        try {
            const token = (0, util_1.signJwt)(req.token);
            res.status(201).send({ accessToken: token, message: 'Authenticaton successful' });
        }
        catch (err) {
            next(err);
            console.log(err);
        }
    },
};
