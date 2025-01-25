const blockModel = require('../models/block');
const employeeModel = require('../models/employee');
const specializedPositionModel = require('../models/specializedPosition');
const positionModel = require('../models/position');
const streamModel = require('../models/Stream');
const classModel = require('../models/class');
const { v4: uuidv4 } = require('uuid');
const category = 'Class';
const logController = require('./logController');

const classController = {
    create: async (req, res) => {
        try {
            const { BlockId, blockRange,StreamId, teacher } = req.body;

            if (!BlockId || !StreamId || !teacher) {
                return res.status(400).json({ error: 'BlockId, StreamId, and teacher are required.' });
            }

            const ClassId = uuidv4();
            const classItem = await classModel.create({
                ClassId,
                BlockId,
                BlockRange:blockRange,
                StreamId,
                teacher
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Class",
                target: classItem.ClassId
            });

            return res.status(200).json({ message: 'Class created successfully.' });
        } catch (error) {
            console.log('An error occurred creating a class:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    edit: async (req, res) => {
        try {
            const { ClassId, BlockId, BlockRange, StreamId, teacher } = req.body;

            const classItem = await classModel.findByPk(ClassId);
            if (!classItem) {
                return res.status(400).json({ error: 'Class not found.' });
            }

            classItem.BlockId = BlockId || classItem.BlockId;
            classItem.BlockRange = BlockRange || classItem.BlockRange;
            classItem.StreamId = StreamId || classItem.StreamId;
            classItem.teacher = teacher || classItem.teacher;

            await classItem.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Class",
                target: classItem.ClassId
            });

            return res.status(200).json({ message: 'Class updated successfully.' });
        } catch (error) {
            console.log('An error occurred editing the class:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    delete: async (req, res) => {
        try {
            const { ClassId } = req.body;

            const classItem = await classModel.findByPk(ClassId);
            if (!classItem) {
                return res.status(400).json({ error: 'Class not found.' });
            }

            await classItem.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Class",
                target: classItem.ClassId
            });

            return res.status(200).json({ message: 'Class deleted successfully.' });
        } catch (error) {
            console.log('An error occurred deleting the class:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    view: async (req, res) => {
        try {
            const { ClassId } = req.body;

            const classItem = await classModel.findByPk(ClassId);
            if (!classItem) {
                return res.status(400).json({ error: 'Class not found.' });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Class",
                target: classItem.ClassId
            });

            return res.status(200).json(classItem);
        } catch (error) {
            console.log('An error occurred viewing the class:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    viewDetailedClass:async(req,res)=>{
        try {
            const ClassId = req.body.ClassId;
            const classElement = await classModel.findByPk(ClassId);
            const block = await blockModel.findByPk(classElement.BlockId);
            const stream = await streamModel.findByPk(classElement.StreamId);
            const teacher = await employeeModel.findByPk(classElement.teacher);

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Detailed Class",
                target: ClassId
            });

            return res.status(200).json({
                Class: classElement,
                Block: {
                    id:block.BlockId,
                    name:block.Name,
                    startRange:block.startRange,
                    endRange:block.endRange,
                },
                Stream: {
                    id:stream.StreamId,
                    name:stream.Name
                },
                Teacher: {
                    id:teacher.EmployeeID,
                    fname:teacher.FirstName,
                    lname:teacher.LastName
                }
            });
        } catch (error) {
            console.log('An error occurred viewing the class:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    viewAll: async (req, res) => {
        try {
            const classes = await classModel.findAll();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View All Classes",
                target: 'All'
            });

            return res.status(200).json(classes);
        } catch (error) {
            console.log('An error occurred viewing all classes:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    viewDetailedClasses:async(req,res)=>{
        try {
            const rawClasses = await classModel.findAll();
        
            const finishedClasses = await Promise.all(rawClasses.map(async (classElement) => {
                const classes = await classModel.findByPk(classElement.ClassId);
                const block = await blockModel.findByPk(classElement.BlockId);
                const stream = await streamModel.findByPk(classElement.StreamId);
                const teacher = await employeeModel.findByPk(classElement.teacher);

                return {
                    Class: classes.ClassId,
                    Block: `${block.Name} ${classes.BlockRange}`,
                    Stream: stream.Name,
                    Teacher: `${teacher.FirstName} ${teacher.LastName}`
                };
            }));

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View All Classes Detailed",
                target: "all"
            });

            return res.status(200).json(finishedClasses);
        } catch (error) {
            console.log('An error occurred viewing all classes:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
    getCounts: async (req, res) => {
        try {
            const allClassesCount = await classModel.count();
            const allStreamsCount = await streamModel.count();
            const allBlocksCount = await blockModel.count();
    
            const allTeachersCount = await employeeModel.count({
                include: {
                    model: specializedPositionModel,
                    as: 'specializedPosition',
                    required: true,
                    include: {
                        model: positionModel,
                        as: 'position',
                        required: true, 
                        where: {
                            Name: 'Teacher'
                        }
                    }
                }
            });
            
    
            return res.status(200).json({
                allClasses: allClassesCount,
                allStreams: allStreamsCount,
                allBlocks: allBlocksCount,
                allTeachers: allTeachersCount
            });
        } catch (error) {
            console.error('An error occurred fetching counts', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = classController;
