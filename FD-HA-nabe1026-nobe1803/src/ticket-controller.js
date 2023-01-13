import { debug as Debug } from "https://deno.land/x/debug/mod.ts";
import * as dbModel from "./db-model.js";
const debug = Debug("app:formController");

export function tagesticket(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("tagesticket.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function vipticket(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("vipticket.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export async function tagesticketSubmit(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const enteredTicketData = await ctx.request.formData();
  const name = enteredTicketData.get("name");
  const surname = enteredTicketData.get("surname");
  const email = enteredTicketData.get("email");
  const tickettype = "dayticket";
  let foodpass = enteredTicketData.get("food");
  if (foodpass != null) {
    foodpass = "yes";
  } else {
    foodpass = "no";
  }
  const order = {
    name: name,
    surname: surname,
    email: email,
    foodpass: foodpass,
    tickettype: tickettype,
  };
  dbModel.addOrder(ctx.data, order);
  ctx.response.headers["location"] = "/confirmation";
  ctx.response.status = 302;
  return ctx;
}

export async function vipticketSubmit(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const enteredTicketData = await ctx.request.formData();
  const name = enteredTicketData.get("name");
  const surname = enteredTicketData.get("surname");
  const email = enteredTicketData.get("email");
  const tickettype = "vipticket";
  let foodpass = enteredTicketData.get("food");
  if (foodpass != null) {
    foodpass = "yes";
  } else {
    foodpass = "no";
  }
  const order = {
    name: name,
    surname: surname,
    email: email,
    foodpass: foodpass,
    tickettype: tickettype,
  };
  dbModel.addOrder(ctx.data, order);
  ctx.response.headers["location"] = "/confirmation";
  ctx.response.status = 302;
  return ctx;
}

export function confirmation(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("confirmation.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}
