var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('notes.sqlite3');
var Promise = require('es6-promise').Promise;


module.exports = {
  startDB: function (){
    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS notes (id Integer Primary Key AUTOINCREMENT, titulo TEXT NOT NULL , nota TEXT)");

    });
  },
  addNote: function (titulo,nota)
  {
    db.serialize(function() {
      var stmt = db.prepare("INSERT INTO notes (titulo,nota) VALUES (?,?)");
      stmt.run(titulo,nota);
      stmt.finalize();
    });
  },
  queryAllNotes: function ()
  {
    return new Promise(function(resolve, reject) {
      db.all("SELECT * from notes", function(err,row)
      {
        if(err)
        {
          reject(err);
        }
        else {
          resolve(row);
        }
      });
    })
  },
  deleteNote: function(id){
    db.serialize(function() {
      db.run("DELETE FROM notes where id="+id);
    });
  },
  closeDB: function(){
    db.close();
  }
}
