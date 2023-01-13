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
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("info.html", { authenticated: auth });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function index(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("index.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function datenschutz(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("datenschutzerklaerung.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function formular(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("Formular.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function impressum(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("Impressum.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function kollophon(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("Kollophon.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function lineup(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const allArtists = dbModel.getAllArtists(ctx.data);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("lineup.html", {
    allArtists,
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function tickets(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("tickets.html", {
    authenticated: auth,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function artist(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  const artistdataraw = dbModel.getArtist(ctx.data, ctx.params.id);
  const artistdata = artistdataraw[0];
  artistdata.date = ConvertDate(artistdata.date);
  const auth = ctx.session.userId;
  ctx.response.body = ctx.nunjucks.render("artist.html", {
    artistdata,
    authenticated: auth,
  });
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

export function d_aufbau(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("d_aufbau.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}


export function d_erklaerung(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("d_erklaerung.html", {});
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

export function logout(ctx) {
  debug("@index. ctx %O", ctx.request.url);
  ctx.response.body = ctx.nunjucks.render("logout.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export function ConvertDate(date) {
  const dateArray = date.split("-");
  const year = dateArray[0];
  const month = dateArray[1];
  const day = dateArray[2];
  const convertedDate = `${day}.${month}.${year}`;
  return convertedDate;
}
