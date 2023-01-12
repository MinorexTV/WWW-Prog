import { debug as Debug } from "https://deno.land/x/debug/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import * as dbModel from "./db-model.js";

const debug = Debug("app:formController");

export const isValidText = (text) => text.length >= 2;

export function login(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("login.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export async function submitForm(ctx) {
  const enteredLoginData = await ctx.request.formData();
  const enteredUsername = enteredLoginData.get("name");
  const enteredPassword = enteredLoginData.get("password");

  ctx.errors.input = validate(enteredUsername, enteredPassword);
  if (Object.values(ctx.errors.input).length > 0) {
    ctx.response.body = ctx.nunjucks.render("login.html", {
      errors: ctx.errors,
      name: enteredUsername,
    });
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  } else {
    if (userExists(ctx.data, enteredUsername)) {
      const user = dbModel.getUser(ctx.data, enteredUsername)[0];
      console.log(await bcrypt.compare(enteredPassword, user.password));
      if (await bcrypt.compare(enteredPassword, user.password)) {
        user.password_hash = undefined;
        ctx.response.status = 303;
        ctx.session.userId = user.id;
        ctx.response.headers.location = new URL("/", ctx.request.url);
      } else {
        ctx.errors.password = "Passwort ist falsch!";
        ctx.response.body = ctx.nunjucks.render("login.html", {
          errors: ctx.errors,
          name: enteredUsername,
        }); //namen übernehmen
        ctx.response.status = 200;
        ctx.response.headers["content-type"] = "text/html";
      }
    } else {
      ctx.errors.name = "Username existiert nicht!";
      ctx.response.body = ctx.nunjucks.render("login.html", {
        errors: ctx.errors,
        name: enteredUsername,
      });
      ctx.response.status = 200;
      ctx.response.headers["content-type"] = "text/html";
    }
  }
  return ctx;
}

export const userExists = (data, name) =>
  dbModel.getUser(data, name)[0] != undefined;

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
  ctx.response.headers["location"] = "/";
  ctx.response.status = 302; // Found
  return ctx;
}
