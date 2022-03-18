"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const router = (0, express_1.Router)();
router.get('/login', authControllers_1.getLogin);
router.get('/logout', authControllers_1.getLogout);
router.post('/login', authControllers_1.postLogin);
exports.default = router;
