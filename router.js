const controllerUser = require("./controller/user_list");
const controllerLogin = require("./controller/login");
const controllerForgot = require("./controller/forgot_password");
const Module = require("./function_global");

function getRouter(app) {
  app.get("/td2", controllerUser.td2);
  app.get("/td", controllerUser.td);
  app.get("/get_user", Module.ensureToken, controllerUser.get_user);
  app.post("/add_user", controllerUser.add_user);
  app.post("/check_user", controllerUser.check_user);
  app.post("/update_user", Module.ensureToken, controllerUser.update_user);
  app.post("/delete_user", Module.ensureToken, controllerUser.delete_user);
  app.post("/search_user", Module.ensureToken, controllerUser.search_user);

  app.post("/login", controllerLogin.login);
  app.post("/exit", Module.ensureToken, controllerLogin.exit);
  app.post("/protected", controllerLogin.protected);

  app.post("/forgot", controllerForgot.forgot);
  app.post("/reset_password", controllerForgot.reset_password);
  app.post("/protectForgot", controllerForgot.protectedForgot);
}

module.exports = {
  getRouter
};
