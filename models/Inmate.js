const mongoose = require('mongoose')

const InmateSchema = new mongoose.Schema({
    //info about inmate included here
    inmateName: {
        type: String,
        required: [true, 'Please provide inmate name'],
        maxlength:80
    },
    totalYears: {
        type: Number,
        required: [true, 'Please provide total years of incarceration'],
    },
    yearsLeft: {
        type: Number,
        required: [true, 'Please provide amount of years left of incarceration']
    },
    lifeSentence: {
        type: Boolean,
        required: [true, 'Please provide if life sentence is true or false']
    },
    crimeCommitted: {
        type: String,
        required:[ true, 'Please provide name of crime committed'],
        maxlength: 100
    },
    threatLevel: {
        type: String,
        enum:['low', 'moderate', 'substantial', 'severe', 'critical', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide inmate name'],
        maxlength: 80
    }
}, 
{timestamps:true} //createdAt and updatedAt come from here
)

module.exports = mongoose.model('Inmate', InmateSchema)

