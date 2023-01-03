const Inmate = require('../models/Inmate')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError , NotFoundError } = require('../errors')

const getAllInmates = async (req, res) => {
    res.send('Get All Inmates')
}

const getInmate = async (req, res) => {
    res.send('Get Inmate')
}

const createInmate = async (req, res) => {
    req.body.createdBy = req.user.userId
    const inmate = await Inmate.create(req.body)
    res.status(StatusCodes.CREATED).json({inmate})
}

const updateInmate = async (req, res) => {
    res.send('Update Inmate')
}

const deleteInmate = async (req, res) => {
    res.send('Delete Inmate')
}


module.exports = {
    getAllInmates,
    getInmate,
    createInmate,
    updateInmate,
    deleteInmate,
}