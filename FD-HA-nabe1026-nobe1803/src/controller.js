import { debug as Debug } from "https://deno.land/x/debug/mod.ts";
import { contextOrFrameLookup } from "https://deno.land/x/nunjucks@3.2.3/src/runtime.js";
import * as dbModel from "./db-model.js";

const debug = Debug("app:controller");

export function error404(ctx) {
  debug("@error404. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("error404.html", {});
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function info(ctx) {
  debug("@about. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("info.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function index(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.state.authenticated;
  ctx.response.body = ctx.nunjucks.render("index.html", {authenticated : auth});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function datenschutz(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("datenschutzerklärung.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function formular(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("Formular.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function impressum(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("Impressum.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function kollophon(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("Kollophon.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function lineup(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const allArtists = dbModel.getAllArtists(ctx.data);
  const auth = true;
  ctx.response.body = ctx.nunjucks.render("LineUp.html", {allArtists, authenticated: auth});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function tickets(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("tickets.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function artist(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const artistdataraw = dbModel.getArtist(ctx.data, ctx.params.id);
  const artistdata = artistdataraw[0];
  const auth = true;
  ctx.response.body = ctx.nunjucks.render("artist.html", {artistdata, authenticated: auth});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function documentation(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("d_index.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function d_module(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("d_module.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function d_farben(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("d_farben.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function d_erklaerung(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("d_erklärung.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}


export function d_zeitleiste(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("d_zeitleiste.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function login(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.state.authenticated;
  ctx.response.body = ctx.nunjucks.render("login.html", {authenticated: auth});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}