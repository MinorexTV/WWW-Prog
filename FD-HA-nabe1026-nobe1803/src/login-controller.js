import { debug as Debug } from "https://deno.land/x/debug/mod.ts";

const debug = Debug("app:formController");

export const isValidText = (text) => text.length >= 3;

export function add(ctx) {
   ctx.response.body = ctx.nunjucks.render("login.html", {});
   ctx.response.status = 200;
   ctx.response.headers["content-type"] = "text/html";
  return ctx;
  }

  export async function submitForm(ctx) {
    /* ... */
    if (any(errors)) {
    // Render form with errors
    } else {
    const user = await userModel.getByUsername(ctx.db, form.username);
    if ((await userModel.passwordIsCorrect(user, form.password)) === true) {
    user.password_hash = undefined;
    ctx.session.user = user; // complete object
    ctx.session.flash = `Du bist als ${user.fullname} eingeloggt.`;
    ctx.response.status = 303;
    ctx.response.headers['location'] = ctx.url.origin + '/'; // Redirect to Profile?
    } else {
    errors.login = 'Diese Kombination aus Benutzername und Passwort ist nicht gültig.';
    // Render form with error
    }
    }
    return ctx;
    }