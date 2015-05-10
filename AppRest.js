var express = require("express"),
	app		= express(),
	puerto	= 3000,
	bodyParser = require('body-parser'),
	MongoClient = 	require("mongodb").MongoClient,db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Conectarse a la base de datos de MngoDB...
MongoClient.connect("mongodb://127.0.0.1:27017/MiDB", function(err, database)
{
	if(err) throw err;
	//Buscar un documento en la colección...
	db = database;	
});


var Usuarios = [
				{
					"id" : 1,
					"nombre" : "Jorge ",
					"apellido":"Rubiano",
					"foto ":"https://cambiardeimagen.files.wordpress.com/2013/03/moda-masculina-lentes-cara-hombre-carametria-caramorfoligia-consultoria-de-imagen.jpg"
					
				},
	
				{
					"id" : 2,
					"nombre" : "Franklyn",
					"apellido":"Lombana",
					"foto ":"http://fernandocara.com/wp-content/gallery/corteshombre2014/fernando-cara-corte-chico-4.jpg"
				},
				{
					"id" : 3,
					"nombre" : "Diana Joya",
					"apellido":"Joya",
					"foto ":"http://www.elbolsodemaribel.com/wp-content/uploads/2013/04/rostro-ova-01.jpg"
				


			}];

var Mensajes = [
				{
					"id" : 1,
					"usuario" : "Jorge Rubiano",
					"mensaje":"Mensaje del usuario 1",
					"Fecha":"09/05/2015",
					"hora":"5:00"
				},
	
				{
					"id" : 2,
					"usuario" : "Franklyn Lombana",
					"mensaje":"Mensaje del usuario 2",
					"Fecha":"10/05/2015",
					"hora":"3:00"
				},
				{
					"id" : 3,
					"usuario" : "Diana Joya",
					"mensaje":"Mensaje del usuario 2",
					"Fecha":"11/05/2015",
					"hora":"6:00"
				}


			];
			
			
/*
var llenadb = function(){
	var coleccion = db.collection("Usuarios");
		coleccion.insert(Usuarios);
	};llenadb();
*/
app.get("/TodosUsuarios", function(req, res){
	res.json(Usuarios);
});

app.get("/Usuario/:id", function(req, res){
	var idU = Number(req.param("id"));
	if(BuscarUsuario(idU)){
		res.json(Usuarios[idU-1]);
	}else{
		res.json({Usuario : "No Existe"});
	}	

	
});
app.get("/TodosMensajes", function(req, res){
	res.json(Mensajes);
});

app.post("/CrearMensaje", function(req, res){
	
	res.json(CrearMensaje(req.body));	
	
	console.log(req.body); 
	
});

//Datos desde MongoDB
app.get('/TodosUsuariosMongoDB', function(req, res)
{
	var coleccion = db.collection("Usuarios");
	coleccion.insert(Usuarios);
	var opciones = {"sort" : ["nombre", "acs"]};
	var cursor = coleccion.find({}, opciones);
	cursor.toArray(function(err, doc)
	{
		if(err)
		{
			throw err;
		}
		res.json(doc);
	});
});

app.get('/UsuarioMongoDB/:id', function(req, res)
{
	var coleccion = db.collection("Usuarios");
	var query = {id : Number(req.param("id"))};
	coleccion.findOne(query, function(err, doc)
	{
		var devuelve = {datos : doc !== null ? doc : "", Estado : doc !== null ? "Exitoso" : "No se encontraron datos"};
		res.json(devuelve);
	});
});
app.post("/CrearMensajeMongoDB", function(req, res){
	var coleccion = db.collection("Mensajes");
	var datos = req.body;
	var FinDatos = [	{	id : Mensajes.length+1,
							usuario : datos.usuario,
							mensaje : datos.mensaje,
							Fecha   : datos.Fecha,
							hora   : datos.hora
						}

	];	 

	coleccion.insert(FinDatos, function(err, records)
				{
					res.json({status : true});	
				});
	
	
	
});


app.get('/TodosMensajesMongoDB', function(req, res)
{
	var coleccion = db.collection("Mensajes");
	coleccion.insert(Mensajes);
	var opciones = {"sort" : ["nombre", "acs"]};
	var cursor = coleccion.find({}, opciones);
	cursor.toArray(function(err, doc)
	{
		if(err)
		{
			throw err;
		}
		res.json(doc);
	});
});


app.get("*", function(req, res){
	
	res.status(404).send("Página no encontrada :( en el momento");

});

var CrearMensaje = function(Mensaje){
	
	var Estad;

	Mensajes.push(Mensaje);
	Mensajes[Mensajes.length - 1].id = Mensajes.length;
	
	Number(Mensajes[Mensajes.length-1].id) === Number(Mensajes.length) ? Estad = "Guadado" : Estad ="No Guardo";
	
	return {Estado : Estad};

}


var BuscarUsuario = function(id){
	var Existe = false;

for (var i=0;i <= Usuarios.length - 1; i++) {
	if(Usuarios[i].id === id){
		Existe = true;
	} 
}
return Existe;
}

app.listen(puerto);
console.log("Escuchando por el puerto "+puerto);
