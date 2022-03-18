"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_session_1 = __importDefault(require("cookie-session"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_session_1.default)({ keys: ['!!Lc/,!b4Sn!&C)x'] }));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
app.use('/auth', authRoutes_1.default);
app.use((req, res, next) => {
    if (req.session.isLoggedIn) {
        return next();
    }
    res.status(203).redirect('/auth/login');
});
app.use('/', (req, res) => {
    return res.send(`<div><h1 style="text-align: center">This is App Root Dir</h1>
        <a href="/auth/logout">LogOut</a>
      </div>`);
});
app.listen(9000);
