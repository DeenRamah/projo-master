const specializedPositionModel = require('../models/specializedPosition');
const positionModel = require('../models/position');
const { v4: uuidv4 } = require('uuid');
const category = 'Specialized position';
const logController = require('./logController');

const specializedPositionController = {
    create: async (req, res) => {
        try {
            const { name, positionId } = req.body;
            const position = await specializedPositionModel.create({
                id: uuidv4(),
                name,
                positionId
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Create Specialized Position",
                target:position.id
            });

            return res.status(201).json({ message: 'Operation Successful' });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while creating the position" });
        }
    },
    edit: async (req, res) => {
        try {
            const { id, name, positionId } = req.body;
            const specializedPosition = await specializedPositionModel.findByPk(id);
            if (!specializedPosition) {
                return res.status(404).json({ error: "Position not found" });
            }

            specializedPosition.name = name || specializedPosition.name;
            specializedPosition.positionId = positionId || specializedPosition.positionId;

            await specializedPosition.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Specialized Position",
                target:id
            });

            return res.status(200).json({ message: 'Operation Successful' });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while editing the position" });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.body;
            console.log(id);
            const specializedPosition = await specializedPositionModel.findByPk(id);
            if (!specializedPosition) {
                return res.status(404).json({ error: "Position not found" });
            }
            await specializedPosition.destroy();
            
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Specialized Position",
                target:id
            });

            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while deleting the position" });
        }
    },
    view: async (req, res) => {
        try {
            const { id } = req.body;
            const specializedPosition = await specializedPositionModel.findByPk(id);
            if (!specializedPosition) {
                return res.status(404).json({ error: "Position not found" });
            }
            const position = await positionModel.findByPk(specializedPosition.positionId);

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Specialized Position",
                target:id
            });

            return res.status(200).json({ specializedPosition, position });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while fetching the position" });
        }
    },
    viewAll: async (req, res) => {
        try {
            const specializedPositionElements = await specializedPositionModel.findAll();
            const positions = await Promise.all(specializedPositionElements.map(async (position) => {
                const positionElement = await positionModel.findByPk(position.positionId);
                return { position, positionElement };
            }));

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View all Specialized Positions",
                target:"All"
            });

            return res.status(200).json(positions);
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while fetching all positions" });
        }
    },
    viewPosition: async (req, res) => {
        try {
            const { positionId } = req.body;

            const position = await positionModel.findByPk(positionId);

            const specializedPositions = await specializedPositionModel.findAll({
                where: { positionId }
            });
    
            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,
                category,
                action: "View Specialized Positions by Position ID",
                target: positionId
            });
    
            return res.status(200).json({SpecializedPositions:specializedPositions, Position:position});
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while fetching specialized positions for the position ID" });
        }
    }    
};

module.exports = specializedPositionController;
