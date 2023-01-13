export const getAllArtists = (data) =>
  data.queryEntries("SELECT * FROM artists");

export const getArtist = (data, id) =>
  data.queryEntries("SELECT * FROM artists WHERE artistId = $id", { $id: id });

export const addArtist = (data, newArtistData) =>
  data.query(
    `
    INSERT INTO artists (name, description, time, date, picture) 
    VALUES (:name, :description,:time, :date, :picture);`,
    newArtistData,
  );

export const editArtist = (data, newArtistData) =>
  data.query(
    `UPDATE artists
    SET name=:name ,description=:description, time=:time, date=:date
    WHERE artists.artistId=:id`,
    newArtistData,
  );

export const removeArtist = (data, id) =>
  data.queryEntries("DELETE FROM artists WHERE artistId=$id", { $id: id });

export const getUser = (data, name) =>
  data.queryEntries("SELECT * FROM users WHERE username = $name", {
    $name: name,
  });

export const addOrder = (data, order) =>
  data.query(
    `
INSERT INTO orders (name, surname, email, tickettype, foodpass) 
VALUES (:name, :surname, :email, :tickettype, :foodpass);`,
    order,
  );
