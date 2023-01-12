import { debug as Debug } from "https://deno.land/x/debug/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import * as dbModel from "./db-model.js";

const debug = Debug("app:formController");

export const isValidText = (text) => text.length >= 2;

export function add(ctx) {
   ctx.response.body = ctx.nunjucks.render("login.html", {});
   ctx.response.status = 200;
   ctx.response.headers["content-type"] = "text/html";
  return ctx;
  }

export async function submitForm(ctx) {
  const enteredLoginData = await ctx.request.formData();
  const enteredUsername = enteredLoginData.get("name");
  const enteredPassword = enteredLoginData.get("password");
  
  ctx.errors.login = validate(enteredUsername, enteredPassword);
  if (Object.values(ctx.errors.login).length > 0) {
    const errors = ctx.errors.login;
    console.log("errors: ", errors);
    ctx.response.body = ctx.nunjucks.render("login.html", { errors, name: enteredUsername});
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    const user = await getByUsername(ctx.data, enteredUsername);
    if (await bcrypt.compare(password, user.password)) {
      user.password_hash = undefined;
      //ctx.state.user = user;
      //ctx.state.flash = `Du bist als ${user.username} eingeloggt.`;
      ctx.response.status = 303;
      ctx.session.userId = user.id;
      ctx.response.headers.location = new URL("/", ctx.request.url);
    } else {
      ctx.errors.login = 'Diese Kombination aus Benutzername und Passwort ist nicht gültig.';
      console.log(errors);
      ctx.response.body = ctx.nunjucks.render("login.html", { errors, name: enteredUsername}); //namen übernehmen
      ctx.response.status = 200;
      ctx.response.headers["content-type"] = "text/html";
    }
  }
  return ctx;
}

//should return complete user object, currently database cannot be reached
export function getByUsername(database, usernameForm) {
  const userDataRaw = dbModel.getUser(database, usernameForm);
  const userData = userDataRaw[0];
  console.log(userData);
  if(userData == undefined) {
      ctx.errors.name = 'Dieser Username existiert nicht.';
      console.log(errors);
      ctx.response.body = ctx.nunjucks.render("login.html", { errors, name: enteredUsername}); //namen übernehmen
      ctx.response.status = 200;
      ctx.response.headers["content-type"] = "text/html";
  }
  else{
    return userData;
  }
}


function validate(username, password) {
  let errors = {};

  if (!isValidText(username)) {
    errors.name = "invalid username";
  }
  if (!isValidText(password)) {
    errors.password = "invalid password";
  }
  return errors;
}

export function logout(ctx) {
ctx.session.userId = undefined;
ctx.session.flash = `Du hast dich ausgeloggt.`;
ctx.response.headers['location'] = '/'
ctx.response.status = 302; // Found
return ctx;
}