import { debug as Debug } from "https://deno.land/x/debug/mod.ts";

const debug = Debug("app:formController");

export const isValidText = (text) => text.length >= 3;

export function add(ctx) {
   ctx.response.body = ctx.nunjucks.render("lineupformular.html", {});
   ctx.response.status = 200;
   ctx.response.headers["content-type"] = "text/html";
  return ctx;
  }

  export function edit(ctx) {
    const artistdataraw = ctx.data.queryEntries(`SELECT * FROM artists WHERE artistId = ${ctx.params.id}`);
    const artistdata = artistdataraw[0];
    console.log("artistdata:", artistdata);
   ctx.response.body = ctx.nunjucks.render("lineupformular.html", {form: artistdata});
   ctx.response.status = 200;
   ctx.response.headers["content-type"] = "text/html";
  return ctx;
  }

export async function submitAdd(ctx) {
  const artistData = await ctx.request.formData();
  const newArtistData = {
    name: artistData.get("artistname"),
    description: artistData.get("text"),
    time: artistData.get("time"),
    date: artistData.get("date"),
    picture: "/pictures/band5.jpg"
  };
  console.log("newArtistData: ",newArtistData);
  const errors = validate(newArtistData);
  if (Object.values(errors).length > 0) {
    ctx.response.body = ctx.nunjucks.render("form.html", {errors: errors, form: newArtistData});
    ctx.response.status = 200;
    ctx.response.headers["content-type"] = "text/html";
  }
  else{
    ctx.data.query(`
    INSERT INTO artists (name, description, time, date, picture) 
    VALUES (:name, :description,:time, :date, :picture);`, newArtistData);
    }
    ctx.redirect = Response.redirect(new URL("/lineup", ctx.request.url));
  
  return ctx;
  }
  export async function submitEdit(ctx) {
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
      ctx.response.body = ctx.nunjucks.render("form.html", {errors: errors, form: newArtistData});
      ctx.response.status = 200;
      ctx.response.headers["content-type"] = "text/html";
    }
    else{
      ctx.data.query(`UPDATE artists
      SET name=:name ,description=:description, time=:time, date=:date
      WHERE artists.artistId=:id`, newArtistData);
      }
      ctx.redirect = Response.redirect(new URL(`/artist/${ctx.params.id}`, ctx.request.url));
    
    return ctx;
    }

  export function removeArtist(ctx) {
    const sql ='DELETE FROM artists WHERE artistId=$id';
    ctx.data.query(sql, {$id: ctx.params.id});
    ctx.redirect = Response.redirect(new URL("/lineup", ctx.request.url));
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
  return errors;
}