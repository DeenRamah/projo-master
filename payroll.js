const payrollModel = require('../models/payroll');
const employeeModel = require('../models/employee');
const { v4: uuidv4 } = require('uuid');
const category = 'Payroll';
const logController = require('./logController');

const payRollController = {
    create: async (req, res) => {
        try {
            const { EmployeeID, BaseSalary, Bonus, Deductions, NetPay, PayDate, PaymentMethod } = req.body;

            const newPayroll = await payrollModel.create({
                PayrollID: uuidv4(),
                EmployeeID,
                BaseSalary,
                Bonus,
                Deductions,
                NetPay,
                PayDate,
                PaymentMethod
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Add Payroll record",
                target: newPayroll.PayrollID
            });

            return res.status(201).json({ message: 'Payroll record created successfully', payroll: newPayroll });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while creating the payroll record" });
        }
    },
    edit: async (req, res) => {
        try {
            const { PayrollID, EmployeeID, BaseSalary, Bonus, Deductions, NetPay, PayDate, PaymentMethod } = req.body;

            const payroll = await payrollModel.findByPk(PayrollID);

            if (!payroll) {
                return res.status(404).json({ error: "Payroll record not found" });
            }

            payroll.EmployeeID = EmployeeID || payroll.EmployeeID;
            payroll.BaseSalary = BaseSalary || payroll.BaseSalary;
            payroll.Bonus = Bonus || payroll.Bonus;
            payroll.Deductions = Deductions || payroll.Deductions;
            payroll.NetPay = NetPay || payroll.NetPay;
            payroll.PayDate = PayDate || payroll.PayDate;
            payroll.PaymentMethod = PaymentMethod || payroll.PaymentMethod;

            await payroll.save();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Edit Payroll record",
                target: PayrollID
            });

            return res.status(200).json({ message: 'Payroll record updated successfully', payroll });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while updating the payroll record" });
        }
    },
    delete: async (req, res) => {
        try {
            const { PayrollID } = req.body;

            const payroll = await payrollModel.findByPk(PayrollID);

            if (!payroll) {
                return res.status(404).json({ error: "Payroll record not found" });
            }

            await payroll.destroy();

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "Delete Payroll record",
                target: payroll.PayrollID
            });

            return res.status(200).json({ message: 'Payroll record deleted successfully' });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while deleting the payroll record" });
        }
    },
    view: async (req, res) => {
        try {
            const { PayrollID } = req.body;

            const payroll = await payrollModel.findByPk(PayrollID);

            if (!payroll) {
                return res.status(404).json({ error: "Payroll record not found" });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Payroll record",
                target: payroll.PayrollID
            });

            return res.status(200).json({ payroll });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while retrieving the payroll record" });
        }
    },
    viewPosition: async (req, res) => {
        try {
            const { PositionId } = req.body;

            const payrolls = await payrollModel.findAll({ 
                where: { EmployeeID: PositionId },
                include: {
                    model: employeeModel,
                    as: 'employee',
                    attributes: ['FirstName', 'LastName','EmployeeID']
                }
            });

            if (payrolls.length === 0) {
                return res.status(404).json({ error: "No payroll records found for the specified employee" });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Position Payroll records",
                target: 'All'
            });

            return res.status(200).json({ payrolls });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while retrieving payroll records" });
        }
    },
    viewSubPosition: async (req, res) => {
        try {
            const { PositionId } = req.params;

            const payrolls = await payrollModel.findAll({ where: { EmployeeID: PositionId } });

            if (payrolls.length === 0) {
                return res.status(404).json({ error: "No payroll records found for the specified employee" });
            }

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View Sub Position Payroll records",
                target: 'All'
            });

            return res.status(200).json({ payrolls });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while retrieving payroll records" });
        }
    },
    viewAll: async (req, res) => {
        try {
            const payrolls = await payrollModel.findAll({
                include: {
                    model: employeeModel,
                    as: 'employee',
                    attributes: ['FirstName', 'LastName','EmployeeID']
                }
            });

            let { token } = req.body;
            token = JSON.parse(token).token;
    
            await logController.create({
                user_id: token,category,
                action: "View all Payroll records",
                target: 'All'
            });

            return res.status(200).json({ payrolls });
        } catch (error) {
            console.log("An error occurred", error);
            return res.status(500).json({ error: "An error occurred while retrieving all payroll records" });
        }
    },
    getCounts: async (req, res) => {
        try {
            const totalNetPay = await payrollModel.sum('NetPay');

            return res.status(200).json({
                totalNetPay
            });
        } catch (error) {
            console.error('Error getting total net pay:', error);
            return res.status(500).json({ error: 'Internal Server Error.' });
        }
    }
};

module.exports = payRollController;
