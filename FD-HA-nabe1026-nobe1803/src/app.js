import nunjucks from "https://deno.land/x/nunjucks@3.2.3/mod.js";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import * as path from "https://deno.land/std@0.152.0/path/posix.ts";
import * as mediaTypes from "https://deno.land/std@0.151.0/media_types/mod.ts";
import { CookieMap, mergeHeaders } from "https://deno.land/std/http/mod.ts";
import { encode as base64Encode } from "https://deno.land/std/encoding/base64.ts";
import * as controller from "./controller.js";
import * as lineupController from "./lineup-controller.js";
import * as loginController from "./login-controller.js";
import * as ticketController from "./ticket-controller.js";

export const createSessionStore = () => {
  const sessionStore = new Map();
  return {
    get(key) {
      const data = sessionStore.get(key);
      if (!data) {
        return;
      }
      return data.maxAge < Date.now() ? this.destroy(key) : data.session;
    },
    set(key, session, maxAge) {
      sessionStore.set(key, {
        session,
        maxAge: Date.now() + maxAge,
      });
    },
    destroy(key) {
      sessionStore.delete(key);
    },
  };
};

nunjucks.configure("templates", { autoescape: true, noCache: true });

const db = new DB("./data/roadrockdb.db");

const SESSION_KEY = "my_app.session";
const MAX_AGE = 60 * 60 * 1000 * 2; //* 2(Stunden) wegen europäischer Zeitzone
const sessionStore = createSessionStore();

export const handleRequest = async (request) => {
  let ctx = {
    data: db,
    nunjucks: nunjucks,
    request: request,
    cookies: {},
    state: {},
    params: {},
    session: {},
    errors: {},
    sessionStore: sessionStore,
    sessionId: undefined,
    response: {
      body: undefined,
      status: undefined,
      headers: {},
    },
  };
  const base = "assets";
  ctx.cookies = new CookieMap(ctx.request);
  const currentSessionKey = ctx.cookies.get(SESSION_KEY);
  ctx.session = ctx.sessionStore.get(currentSessionKey) ?? {};
  ctx = await serveStaticFile(base, ctx);
  ctx = await router(ctx);

  if (Object.values(ctx.session).find(Boolean)) {
    ctx.sessionId = ctx.sessionId ?? createId();
    ctx.sessionStore.set(ctx.sessionId, ctx.session, MAX_AGE);
    const maxAge = new Date(Date.now() + MAX_AGE);
    ctx.cookies.set(SESSION_KEY, ctx.sessionId, {
      expires: maxAge,
      httpOnly: true,
      overwrite: true,
    });
  } else {
    ctx.sessionStore.destroy(ctx.sessionId);
    ctx.cookies.delete(SESSION_KEY);
  }
  ctx.response.headers = mergeHeaders(ctx.response.headers, ctx.cookies);

  ctx.response.status = ctx.response.status ?? 404;
  if (!ctx.response.body && ctx.response.status == 404) {
    ctx = await controller.error404(ctx);
  }

  return new Response(ctx.response.body, {
    status: ctx.response.status,
    headers: ctx.response.headers,
  });
};

const router = async (ctx) => {
  if (ctx.response.status == 200) return ctx;
  const url = new URL(ctx.request.url);
  const method = ctx.request.method;
  if (url.pathname == "/" || url.pathname == "/index") {
    return await controller.index(ctx);
  }
  if (url.pathname == "/login") {
    if (method == "POST") {
      return await loginController.submitForm(ctx);
    } else {
      return await loginController.login(ctx);
    }
  }
  if (url.pathname == "/logout") {
    if (method == "POST") {
      return await loginController.logout(ctx);
    } else {
      return await controller.logout(ctx);
    }
  }
  if (url.pathname == "/info") return await controller.info(ctx);
  if (url.pathname == "/datenschutz") return await controller.datenschutz(ctx);
  if (url.pathname == "/formular") return await controller.formular(ctx);
  if (url.pathname == "/confirmation") {
    return await ticketController.confirmation(ctx);
  }
  if (url.pathname == "/impressum") return await controller.impressum(ctx);
  if (url.pathname == "/kollophon") return await controller.kollophon(ctx);
  if (url.pathname == "/lineup") return await controller.lineup(ctx);
  if (url.pathname == "/lineup/add") {
    if (ctx.session.userId != undefined) {
      if (method == "GET") {
        return await lineupController.add(ctx);
      }
      if (method == "POST") {
        return await lineupController.submitAdd(ctx);
      }
    } else {
      return await controller.index(ctx);
    }
  }
  if (url.pathname == "/tickets") return await controller.tickets(ctx);
  if (url.pathname == "/tickets/tagesticket") {
    if (method == "GET") {
      return await ticketController.tagesticket(ctx);
    } else {
      return await ticketController.tagesticketSubmit(ctx);
    }
  }
  if (url.pathname == "/tickets/vipticket") {
    if (method == "GET") {
      return await ticketController.vipticket(ctx);
    } else {
      return await ticketController.vipticketSubmit(ctx);
    }
  }
  if (url.pathname == "/documentation") {
    return await controller.documentation(ctx);
  }
  if (url.pathname == "/documentation/aufbau") {
    return await controller.d_aufbau(ctx);
  }
  if (url.pathname == "/documentation/erklaerung") {
    return await controller.d_erklaerung(ctx);
  }
  if (url.pathname == "/documentation/zeitleiste") {
    return await controller.d_zeitleiste(ctx);
  }
  if (url.pathname.match(/\/artist\/([0-9]*)$/)) {
    const matches = url.pathname.match(/\/artist\/([0-9]*)$/);
    ctx.params.id = matches[1];
    if (method == "GET") {
      return await controller.artist(ctx);
    }
    if (method == "POST") {
      if (ctx.session.userId != undefined) {
        return await lineupController.removeArtist(ctx);
      } else {
        return await controller.index(ctx);
      }
    }
  }

  if (url.pathname.match(/\/lineup\/artist\/([0-9]*)\/edit/)) {
    if (ctx.session.userId != undefined) {
      const matches = url.pathname.match(/\/artist\/([0-9]*)\/edit/);
      ctx.params.id = matches[1];
      if (method == "GET") {
        return await lineupController.edit(ctx);
      }
      if (method == "POST") {
        return await lineupController.submitEdit(ctx);
      }
    } else {
      return await controller.index(ctx);
    }
  }
  return await controller.error404(ctx);
};

export const createId = () => {
  const array = new Uint32Array(64);
  crypto.getRandomValues(array);
  return base64Encode(array);
};

const serveStaticFile = async (base, ctx) => {
  const url = new URL(ctx.request.url);
  let file;
  try {
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
    ctx.response.body = file.readable;
  } else {
    Deno.close(file.rid);
  }
  return ctx;
};
