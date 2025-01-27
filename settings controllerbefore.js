const SettingsModel = require('../models/Settings'); // Import your settings model

// View a single setting
exports.viewSettings = async (req, res) => {
    try {
        const settings = await SettingsModel.findOne();
        if (settings) {
            res.status(200).json({ exists: true, settings });
        } else {
            res.status(404).json({ exists: false, message: 'No settings found.' });
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Create a new setting
exports.create = async (req, res) => {
    try {
        const newSettings = new SettingsModel(req.body);
        await newSettings.save();
        res.status(201).json({ message: 'Settings created successfully.' });
    } catch (error) {
        console.error('Error creating settings:', error);
        res.status(500).json({ message: 'Failed to create settings.' });
    }
};

// Edit existing settings
exports.edit = async (req, res) => {
    try {
        const { id, ...updates } = req.body; // Ensure `id` is passed for the settings to be updated
        const settings = await SettingsModel.findByIdAndUpdate(id, updates, { new: true });

        if (!settings) {
            return res.status(404).json({ message: 'Settings not found.' });
        }

        res.status(200).json({ message: 'Settings updated successfully.', settings });
    } catch (error) {
        console.error('Error editing settings:', error);
        res.status(500).json({ message: 'Failed to edit settings.' });
    }
};

// Delete settings
exports.delete = async (req, res) => {
    try {
        const { id } = req.body; // Ensure `id` is passed for the settings to be deleted
        const settings = await SettingsModel.findByIdAndDelete(id);

        if (!settings) {
            return res.status(404).json({ message: 'Settings not found.' });
        }

        res.status(200).json({ message: 'Settings deleted successfully.' });
    } catch (error) {
        console.error('Error deleting settings:', error);
        res.status(500).json({ message: 'Failed to delete settings.' });
    }
};

// View all settings
exports.viewAll = async (req, res) => {
    try {
        const allSettings = await SettingsModel.find();
        res.status(200).json({ settings: allSettings });
    } catch (error) {
        console.error('Error fetching all settings:', error);
        res.status(500).json({ message: 'Failed to fetch all settings.' });
    }
};
