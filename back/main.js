
const Connect = require('./bd/connect')
const express =require("express")
const app = express()
const offres = require ('./routes/offres')
const auth_passenger=require('./routes/auth-passenger')
const auth_covoitureur=require('./routes/auth-covoitureur')
const reservation=require('./routes/reservations')
require('dotenv').config()
app.use(express.json())// use :fonction utilise pour ajouter des middlewares / express.json():est une middleware qui fait parser le corp d'une requete http qui est de format json {(key,value)variable} et le rende disponibles dans req.body.
app.use('/api/v1/offre' , offres)
app.use('/api/v1/auth_passenger' , auth_passenger)
app.use('/api/v1/auth_covoitureur' , auth_covoitureur)
app.use('/api/v1/reserver' ,reservation )


const port= 4000 
const start = async() => {//start est une fonction asynchrone.
    try{
        await Connect(process.env.MONGO_URI)//démarre le serveur sur le port défini (3000)./await bich matit3ada listar eli min ba3d ela matkamil tous le traitement
        app.listen(port, console.log(`server is listening on port ${port}`))//bonne pratique pour connaitre le serveur ye5dim ou pas (sa3at si on est connecter lil base de donnes)
    }catch(error){
        console.log(error)
    }
}
start()
