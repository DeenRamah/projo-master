const SettingsModel = require('../models/Settings'); // Import your settings model (replace with your actual model path)

exports.viewSettings = async (req, res) => {
    try {
        // Fetch settings from the database (adjust query as per your schema)
        const settings = await SettingsModel.findOne();

        if (settings) {
            res.status(200).json({
                exists: true,
                settings,
            });
        } else {
            res.status(200).json({
                exists: false,
                message: 'No settings found.',
            });
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
};
