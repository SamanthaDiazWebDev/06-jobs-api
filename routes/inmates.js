const express = require('express')
const router = express.Router()

const {
    getAllInmates, 
    getInmate, 
    createInmate, 
    updateInmate, 
    deleteInmate,
} = require('../controllers/inmates')

router.route('/').post(createInmate).get(getAllInmates)

router.route('/:id').get(getInmate).delete(deleteInmate).patch(updateInmate)

module.exports = router