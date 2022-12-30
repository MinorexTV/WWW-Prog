import nunjucks from "https://deno.land/x/nunjucks@3.2.3/mod.js";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import * as path from "https://deno.land/std@0.152.0/path/posix.ts";
import * as mediaTypes from "https://deno.land/std@0.151.0/media_types/mod.ts";

import * as controller from "./controller.js";

import * as lineupController from "./lineup-controller.js";

import * as loginController from "./login-controller.js";


nunjucks.configure("templates", { autoescape: true, noCache: true });

const db = new DB("./data/roadrockdb.db");


export const handleRequest = async (request) => {
  let ctx = {
    data: db,
    nunjucks: nunjucks,
    request: request,
    state: {},
    params: {},
    response: {
      body: undefined,
      status: undefined,
      headers: {},
    },
  }
  const base = "assets";
  ctx = await serveStaticFile(base, ctx);

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

   const router = async (ctx) => {
    if(ctx.response.status == 200) return ctx;
    const url = new URL(ctx.request.url);
    const method = ctx.request.method;
    console.log(method);
    if (url.pathname == "/" || url.pathname == "/index") return await controller.index(ctx);
    if (url.pathname == "/login"){
      if(method == "POST"){
        return await loginController.submitForm(ctx);
      }
      else{
        return await controller.login(ctx);
      }
    }
    if (url.pathname == "/info") return await controller.info(ctx);
    if (url.pathname == "/datenschutz") return await controller.datenschutz(ctx);
    if (url.pathname == "/formular") return await controller.formular(ctx);
    if (url.pathname == "/impressum") return await controller.impressum(ctx);
    if (url.pathname == "/kollophon") return await controller.kollophon(ctx);
    if (url.pathname == "/lineup") return await controller.lineup(ctx);
    if (url.pathname == "/lineup/add"){
      if(method == "GET"){
        return await lineupController.add(ctx);
      }
      if(method == "POST"){
        return await lineupController.submitAdd(ctx);
      }
    }
    if (url.pathname == "/tickets") return await controller.tickets(ctx);
    if (url.pathname == "/documentation") return await controller.documentation(ctx);
    if (url.pathname == "/documentation/module") return await controller.d_module(ctx);
    if (url.pathname == "/documentation/farben") return await controller.d_farben(ctx);
    if (url.pathname == "/documentation/erklaerung") return await controller.d_erklaerung(ctx);
    if (url.pathname == "/documentation/zeitleiste") return await controller.d_zeitleiste(ctx);
    if(url.pathname.match(/\/artist\/(.*)/)){
      const matches = url.pathname.match(/\/artist\/(.*)/);
      ctx.params.id = matches[1];
      if(method=="GET"){
      return await controller.artist(ctx);
      }
      if(method=="POST"){
        return await lineupController.removeArtist(ctx);
        }
    }

    return await controller.error404(ctx);
  };

  const serveStaticFile = async (base, ctx) => {
    const url = new URL(ctx.request.url);
    let file;
    try {
      console.log(path.join(base, url.pathname.toString()));
      file = await Deno.open(path.join(base, url.pathname.toString()), {
        read: true,
      });
    } catch (_error) {
      return ctx;
    }
    const { ext } = path.parse(url.pathname.toString());
    const contentType = mediaTypes.contentType(ext);
    if (contentType) {
      ctx.response.status = 200;
      ctx.response.body = file.readable; // Use readable stream ctx.response.headers["Content-type"] = contentType; ctx.response.status = 200;
    } else {
      Deno.close(file.rid);
    }
    return ctx;
  };

