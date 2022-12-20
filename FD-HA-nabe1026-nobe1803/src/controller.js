import { debug as Debug } from "https://deno.land/x/debug/mod.ts";

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
  ctx.response.body = ctx.nunjucks.render("index.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function datenschutzerklärung(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("Datenschutzerklärung.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function dourouedouroue(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("DouroueDouroue.html", {});
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
  const allArtists = ctx.data.query('SELECT * FROM artists');
  console.log("lineup(): artists: ", allArtists);
  ctx.response.body = ctx.nunjucks.render("LineUp.html", allArtists);
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function onsonsweeney(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("OnsonSweeney.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function shownfurcotte(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("ShownFurcotte.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function slevemcdichael(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("SleveMcdichael.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function thechamgerlains(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("TheChamgerlains.html", {});
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

export function toddbonzalez(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("ToddBonzalez.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function artist(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const artistdataraw = ctx.data.queryEntries(`SELECT * FROM artists WHERE artistId = ${ctx.params.id}`);
  const artistdata = artistdataraw[0];
  console.log("artistdata: ",artistdata);
  ctx.response.body = ctx.nunjucks.render("artist.html", {artistdata});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}
