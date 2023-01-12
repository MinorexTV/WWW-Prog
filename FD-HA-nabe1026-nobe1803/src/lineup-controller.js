import { debug as Debug } from "https://deno.land/x/debug/mod.ts";
import * as dbModel from "./db-model.js";

const debug = Debug("app:formController");

export const isValidText = (text) => text.length >= 3;
export const isValidDate = (date) => date.length == 10;
export const isValidTime = (time) => time.length == 5;

export function add(ctx) {
  const auth = ctx.session.userId;
   ctx.response.body = ctx.nunjucks.render("lineupformular.html", {authenticated: auth});
   ctx.response.status = 200;
   ctx.response.headers["content-type"] = "text/html";
  return ctx;
  }

  export function edit(ctx) {
    const auth = ctx.session.userId;
    const artistdataraw = dbModel.getArtist(ctx.data, ctx.params.id);
    const artistdata = artistdataraw[0];
   ctx.response.body = ctx.nunjucks.render("lineupformular.html", {form: artistdata, authenticated: auth});
   ctx.response.status = 200;
   ctx.response.headers["content-type"] = "text/html";
  return ctx;
  }

export async function submitAdd(ctx) {
  const auth = ctx.session.userId;
  const artistData = await ctx.request.formData();
  const newArtistData = {
    name: artistData.get("artistname"),
    description: artistData.get("text"),
    time: artistData.get("time"),
    date: artistData.get("date"),
    picture: "/pictures/band" + (Math.floor(Math.random() * 6)+1) + ".jpg"
  };
  const errors = validate(newArtistData);
  if (Object.values(errors).length > 0) {
    ctx.response.body = ctx.nunjucks.render("lineupformular.html", {errors: errors, form: newArtistData, authenticated: auth});
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  else{
    dbModel.addArtist(ctx.data, newArtistData);
    ctx.response.status = 303;
    ctx.response.headers.location = new URL("/lineup", ctx.request.url);
    }
  
  return ctx;
  }
  export async function submitEdit(ctx) {
    const auth = ctx.session.userId;
    const artistData = await ctx.request.formData();
    const newArtistData = {
      name: artistData.get("artistname"),
      description: artistData.get("text"),
      time: artistData.get("time"),
      date: artistData.get("date"),
      id: ctx.params.id
    };
    const errors = validate(newArtistData);
    if (Object.values(errors).length > 0) {
      ctx.response.body = ctx.nunjucks.render("lineupformular.html", {errors: errors, form: newArtistData, authenticated: auth});
      ctx.response.status = 200;
      ctx.response.headers["content-type"] = "text/html";
    }
    else{
      dbModel.editArtist(ctx.data, newArtistData);
      ctx.response.status = 303;
      ctx.response.headers.location = new URL(`/artist/${ctx.params.id}`, ctx.request.url);
      }
    
    return ctx;
    }

  export function removeArtist(ctx) {
    dbModel.removeArtist(ctx.data, ctx.params.id);
    //ctx.redirect = Response.redirect(new URL("/lineup", ctx.request.url));
    ctx.response.status = 303;
    ctx.response.headers.location = new URL("/lineup", ctx.request.url);
    return ctx;
  }

 function validate(data){
  let errors={};

  if(!isValidText(data.name)){
    errors.title="invalid title";
  }
  if(!isValidText(data.description)){
    errors.text="invalid text";
  }
  if(!isValidDate(data.date)){
    errors.date="invalid date";
  }
  if(!isValidTime(data.time)){
    errors.time="invalid time";
  }
  return errors;
}