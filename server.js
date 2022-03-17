const express = require("express");
const app = express();
const fs = require("fs")


const expressFileUpload = require("express-fileupload");
app.use(expressFileUpload({
  limits: { fileSize: 5000000 },
  abortOnLimit: true,
  responseOnLimit: "El peso del archivo que intentas subir supera ellimite permitido",
}));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(3000, () => console.log("El servidor inicializado en el puerto 3000"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/formulario.html`)
});

app.get("/imagen", (req, res) => {
  res.sendFile(`${__dirname}/collage.html`)
});

app.post("/imagen", (req, res) => {
  try {
    const { target_file } = req.files;
    const { posicion } = req.body;
    if (posicion >= 1 && posicion <=8) {    
      target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
        if (err) {
          const { code } = err;
          res.send(`<h1 style="color: red;" align="center">Error código: "${code}" al cargar imagen</h1>`);
        } else {
          res.redirect("/imagen");
        }
      });
    } else {
      res.send(`<h1 style="color: red;" align="center">¡¡¡ERROR!!!... número de posición debe ser un número entero del 1 al 8</h1>`);
    }
  } catch (error) {
    res.send(`<h1 style="color: red;" align="center">¡¡¡ERROR!!!... archivo NO seleccionado</h1`);
  }
});

app.get("/deleteImg/:nombre", (req, res) => {
  res.sendFile(__dirname + "/collage.html")
})

app.delete("/deleteImg/:nombre", (req, res) => {
  const { nombre } = req.params;
  fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
    if (err) {
      const { code } = err;
      console.log(`Error código: "${code}" al eliminar imagen`);
    } else {
      res.redirect("/imagen");
    }
  });
});