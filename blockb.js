const blockModel = require('../models/block');
const { v4: uuidv4 } = require('uuid');
const category = 'Blocks';
const logController = require('./logController');

const blockController = {
    create: async (req, res) => {
        try {
            const { Name, startRange, endRange } = req.body;

            if (!Name || !startRange || !endRange) {
                return res.status(400).json({ error: 'Please provide all values' });
            }

            const BlockId = uuidv4();
            const block = await blockModel.create({
                BlockId, Name, startRange, endRange
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Block",
                target: block.BlockId
            });

            return res.status(200).json({ message: 'Block created successfully' });
        } catch (error) {
            console.log('An error occurred adding a block', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    edit: async (req, res) => {
        try {
            const { BlockId, Name, startRange, endRange } = req.body;
            const blockItem = await blockModel.findByPk(BlockId);

            if (!blockItem) {
                return res.status(400).json({ error: 'Block not found' });
            }

            blockItem.Name = Name || blockItem.Name;
            blockItem.startRange = startRange || blockItem.startRange;
            blockItem.endRange = endRange || blockItem.endRange;

            await blockItem.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Block",
                target: BlockId
            });

            return res.status(200).json({ message: 'Block updated successfully' });
        } catch (error) {
            console.log('An error occurred editing the block', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    delete: async (req, res) => {
        try {
            const { BlockId } = req.body;
            const blockItem = await blockModel.findByPk(BlockId);

            if (!blockItem) {
                return res.status(400).json({ error: 'Block not found' });
            }

            await blockItem.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Block",
                target: BlockId
            });

            return res.status(200).json({ message: 'Block deleted successfully' });
        } catch (error) {
            console.log('An error occurred deleting the block', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    view: async (req, res) => {
        try {
            const { BlockId } = req.body;
            const blockItem = await blockModel.findByPk(BlockId);

            if (!blockItem) {
                return res.status(400).json({ error: 'Block not found' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Block",
                target: blockItem.BlockId
            });

            return res.status(200).json(blockItem);
        } catch (error) {
            console.log('An error occurred fetching the block', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const blockItems = await blockModel.findAll();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View All Block",
                target: 'All'
            });

            return res.status(200).json(blockItems);
        } catch (error) {
            console.log('An error occurred fetching blocks', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = blockController;
