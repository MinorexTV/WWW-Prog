import { debug as Debug } from "https://deno.land/x/debug/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import * as dbModel from "./db-model.js";

const debug = Debug("app:formController");

export const isValidText = (text) => text.length >= 2;

//only for testing:
export const user = {
  username: "Nat",
  password: "1234",
  id: "1"
};

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
  
  const errors = validate(enteredUsername, enteredPassword);
  if (Object.values(errors).length > 0) {
    console.log(errors);
  } else {
    //const user = await getByUsername(ctx.data, enteredUsername);
    if ((await passwordIsCorrect(user, enteredPassword)) === true) {
      user.password_hash = undefined;
      //ctx.state.user = user;
      //ctx.state.flash = `Du bist als ${user.username} eingeloggt.`;
      ctx.response.status = 303;
      ctx.session.userId = user.id;
      ctx.response.headers.location = new URL("/", ctx.request.url);
    } else {
      errors.login = 'Diese Kombination aus Benutzername und Passwort ist nicht gültig.';
      console.log(errors);
      ctx.redirect = Response.redirect(new URL("/login", ctx.request.url));
    }
  }
  return ctx;
}

//should return complete user object, currently database cannot be reached
export function getByUsername(database, usernameForm) {
  const userData = dbModel.getUser(database, usernameForm);
  console.log(userData);
  console.log("username: " + userData.username);
  return userData;
}

export async function passwordIsCorrect(user, password) {
  const hash_from_DB = await bcrypt.hash(user.password);
  const ok = await bcrypt.compare(password, hash_from_DB);
  if (ok === true) {
    console.log("Password is correct");
  }
  else {
    console.log("Password is incorrect");
  }
  return ok;
}

function validate(username, password) {
  let errors = {};

  if (!isValidText(username)) {
    errors.title = "invalid username";
  }
  if (!isValidText(password)) {
    errors.text = "invalid password";
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