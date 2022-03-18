"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.getLogout = exports.getLogin = void 0;
const getLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.send(`
  <div>
    <form method="POST">
        <div>
          <label>Email</label>
          <input name="email" type="email">
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password">
        </div>
        <button type="submit">Submit</button>
    </form>
    </div>
  `);
};
exports.getLogin = getLogin;
const getLogout = (req, res, next) => {
    req.session = undefined;
    res.redirect('/auth/login');
};
exports.getLogout = getLogout;
const postLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (email === 'khaledrefaat08@gmail.com' && password === '5214705') {
        req.session = { isLoggedIn: true };
        return res.redirect('/');
    }
    res.send(`<div>
  <h1>Email or Password is wrong.</h1>
  <a href="/auth/login">Login</a>
  </div>`);
};
exports.postLogin = postLogin;
