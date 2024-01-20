"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const knexfile_1 = __importDefault(require("../knexfile"));
const config_1 = __importDefault(require("./helpers/config"));
const routes_1 = __importDefault(require("./routes"));
const knex_1 = __importDefault(require("knex"));
const util_1 = require("./helpers/util");
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const marked_1 = require("marked");
const app = (0, express_1.default)();
const port = config_1.default.port;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    var readme = __dirname + '/README.md';
    var output = fs_1.default.readFileSync(readme, 'utf8');
    res.send((0, marked_1.marked)(output.toString()));
});
app.use('/api', routes_1.default);
app.use(util_1.fourOhFour);
app.use((err, req, res, next) => {
    (0, util_1.errResponse)({
        errtype: err.message,
        message: config_1.default.env == 'dev' ? err.stack : err.message,
        statusCode: res.statusCode,
        response: res
    });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    const db = (0, knex_1.default)(knexfile_1.default);
});
exports.default = app;
