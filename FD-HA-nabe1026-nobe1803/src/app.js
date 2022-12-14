import nunjucks from "https://deno.land/x/nunjucks@3.2.3/mod.js";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

import * as controller from "./controller.js";

nunjucks.configure("templates", { autoescape: true, noCache: true });

//const db = new DB("./data/notes.db");

export const handleRequest = async (request) => {
  const ctx = {
    //data: db,
    nunjucks: nunjucks,
    request: request,
    params: {},
    response: {
      body: undefined,
      status: undefined,
      headers: {},
    },
  };

   const router = async (ctx) => {
    const url = new URL(ctx.request.url);
    const method = ctx.request.method;
    console.log(method);
    if (url.pathname == "/" || url.pathname == "/index.html") return await controller.index(ctx);
    if (url.pathname == "/info.html") return await controller.info(ctx);
    if (url.pathname == "/Datenschutzerklärung.html") return await controller.datenschutzerklärung(ctx);
    if (url.pathname == "/DouroueDouroue.html") return await controller.dourouedouroue(ctx);
    if (url.pathname == "/Formular.html") return await controller.formular(ctx);
    if (url.pathname == "/Impressum.html") return await controller.impressum(ctx);
    if (url.pathname == "/Kollophon.html") return await controller.kollophon(ctx);
    if (url.pathname == "/LineUp.html") return await controller.lineup(ctx);
    if (url.pathname == "/OnsonSweeney.html") return await controller.onsonsweeney(ctx);
    if (url.pathname == "/ShownFurcotte.html") return await controller.shownfurcotte(ctx);
    if (url.pathname == "/SleveMcdichael.html") return await controller.slevemcdichael(ctx);
    if (url.pathname == "/TheChamgerlains.html") return await controller.thechamgerlains(ctx);
    if (url.pathname == "/tickets.html") return await controller.tickets(ctx);
    if (url.pathname == "/ToddBonzalez.html") return await controller.toddbonzalez(ctx);

    return await controller.error404(ctx);
  };

  let result = await router(ctx);

  // Handle redirect
  if (ctx.redirect) {
    return ctx.redirect;
  }

  // Fallback
  result.response.status = result.response.status ?? 404;
  if (!result.response.body && result.response.status == 404) {
    result = await controller.error404(result);
  }
  return new Response(result.response.body, {
    status: result.response.status,
    headers: result.response.headers,
  });
};

