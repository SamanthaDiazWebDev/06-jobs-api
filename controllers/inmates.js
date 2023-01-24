const Inmate = require('../models/Inmate');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError , NotFoundError } = require('../errors');

const getAllInmates = async (req, res) => {
    const inmates = await Inmate.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({ inmates, count: inmates.length });
}

const getInmate = async (req, res) => {
    const {
        user: {userId},
        params: { id: inmateId},
    } = req

    const inmate = await Inmate.findOne({
        _id: inmateId,
        createdBy:userId
    })
    if(!inmate) {
        throw new NotFoundError(`No inmate with id ${inmateId}`)
    }
    res.status(StatusCodes.OK).json({ inmate })
}

const createInmate = async (req, res) => {
    req.body.createdBy = req.user.userId
    const inmate = await Inmate.create(req.body)
    res.status(StatusCodes.CREATED).json({inmate});
}

const updateInmate = async (req, res) => {
    const {
        body: {inmateName,totalYears, yearsLeft, lifeSentence, crimeCommitted, threatLevel},
        user: {userId},
        params: { id: inmateId},
    } = req

    if( inmateName === '' || totalYears === '' || yearsLeft === '' || lifeSentence === '' || crimeCommitted === '' || threatLevel === ''){
        throw new BadRequestError('Inmate name, total incarceration years, years left, life sentence, crime committed, and threat level fields cannot be empty')
    }
    const inmate = await Inmate.findByIdAndUpdate(
        {_id:inmateId, createdBy: userId},
        req.body, 
        {new:true, runValidators:true}
    )
    if(!inmate) {
        throw new NotFoundError(`No inmate with id ${inmateId}`)
    }
    res.status(StatusCodes.OK).json({ inmate })
}

const deleteInmate = async (req, res) => {
    const {
        user: {userId},
        params: { id: inmateId},
    } = req

    const inmate = await Inmate.findByIdAndRemove({
        _id: inmateId,
        createdBy: userId
    })
    if(!inmate) {
        throw new NotFoundError(`No inmate with id ${inmateId}`)
    }
    res.status(StatusCodes.OK).send()
}


module.exports = {
    getAllInmates,
    getInmate,
    createInmate,
    updateInmate,
    deleteInmate,
}