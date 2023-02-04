const apiResponse = require('../helpers/apiResponse');
const Lodge = require('../models/lodgeModel');
const { body } = require('express-validator');
const User = require('../models/userModel');


exports.getAllLodges = async (req, res) => {
    try {
        const lodges = await Lodge.paginate({}, {});


        return apiResponse.successResponseWithData(res, "success", lodges);
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.getLodge = async (req, res) => {
    try {
        let { id } = req.params;
        const lodge = Lodge.findById(id);

        if (!lodge) return apiResponse.notFoundResponse(res, "No lodge was found with that id.");
        return apiResponse.successResponseWithData(res, "Lodge found successfully", lodge);
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.validations = [
    body('title'),
    body('displayTtle'),
    body('type'),
    body('locationText'),
    body('town'),
    body('specifications'),
    body('pricePerYear'),
    body('isAvailable'),
    body('isVerified'),
    body('summary'),
    body('displayImage'),
    body('images'),
    body('contactInfo'),
    body('likes'),
    body('dislikes'),
];

exports.suggestLodge = async (req, res) => {
    try {
        const newSuggestion = new Lodge({ ...req.body });
        await newSuggestion.save();

        return apiResponse.successResponse(res, "New suggestion has been added.")
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.updateLodge = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const user = User.findById(userId);
        if (!user) return apiResponse.notFoundResponse(res, "user no longer available");
        if (user.role === 'user') return apiResponse.unauthorizedResponse(res, "You are not authorized to perform this action");

        const lodge = Lodge.findByIdAndUpdate(id, req.body);
        if (!lodge) return apiResponse.notFoundResponse(res, "Lodge not found");

        return apiResponse.successResponseWithData(res, "Lodge updated successfully.", lodge);
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};

exports.deleteLodge = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const user = User.findById(userId);
        if (!user) return apiResponse.notFoundResponse(res, "user no longer available");
        if (user.role === 'user') return apiResponse.unauthorizedResponse(res, "You are not authorized to perform this action");

        const lodge = Lodge.findByIdAndDelete(id, req.body);
        if (!lodge) return apiResponse.notFoundResponse(res, "Lodge not found");

        return apiResponse.successResponseWithData(res, "Lodge deleted successfully.", lodge);
    } catch (error) {
        return apiResponse.ErrorResponse(res, error);
    }
};