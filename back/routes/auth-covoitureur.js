const { register, updatecov}=require('../controllers/auth_covoitureur')
const express=require('express')
const router = express.Router()
router.route('/register').post(register)
// router.route('/login').post(login)
router.route('/update').put(updatecov)

module.exports=router