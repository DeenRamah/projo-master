const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const dbinit = require('./db/init');
const systemJob = require('./job/system');

const routesUtils = require('./utils/routesUtils');

const setupRoutes = require('./routes/setupRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const blockRoutes = require('./routes/blockRoutes');
const classRoutes = require('./routes/classRoutes');
const streamRoutes = require('./routes/streamRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const positionRoutes = require('./routes/positionRoutes');
const yearRoutes = require('./routes/yearRoutes');
const termRoutes = require('./routes/termRoutes');
const specializedPositionRoutes = require('./routes/specializedPositionRoutes');
const accountRoutes = require('./routes/accountRoutes');
const bankRoutes = require('./routes/bankRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const voteheadRoutes = require('./routes/voteheadRoutes');
const feeRoutes = require('./routes/feeRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const inventoryCategoryRoutes = require('./routes/inventoryCategoryRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bursaryRoutes = require('./routes/bursaryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const eventsRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');

const configPath = path.join(__dirname, 'db', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

dbinit.createDatabase()

routesUtils.populateRoutes();

const systemConfig = config.system;

const app = express();
const port = systemConfig.port;

app.use(express.static('public'));
app.use(cookieParser());
app.use(cors())
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/simba-systems/setup', setupRoutes);
app.use('/api/simba-systems/user',userRoutes);
app.use('/api/simba-systems/student',studentRoutes);
app.use('/api/simba-systems/class',classRoutes);
app.use('/api/simba-systems/stream', streamRoutes);
app.use('/api/simba-systems/block', blockRoutes);
app.use('/api/simba-systems/employee',employeeRoutes);
app.use('/api/simba-systems/position',positionRoutes);
app.use('/api/simba-systems/year',yearRoutes);
app.use('/api/simba-systems/term',termRoutes);
app.use('/api/simba-systems/specialized-position', specializedPositionRoutes);
app.use('/api/simba-systems/account', accountRoutes);
app.use('/api/simba-systems/bank', bankRoutes);
app.use('/api/simba-systems/supplier', supplierRoutes);
app.use('/api/simba-systems/payroll', payrollRoutes);
app.use('/api/simba-systems/votehead', voteheadRoutes);
app.use('/api/simba-systems/fee', feeRoutes);
app.use('/api/simba-systems/transaction', transactionRoutes);
app.use('/api/simba-systems/inventory-category', inventoryCategoryRoutes);
app.use('/api/simba-systems/inventory', inventoryRoutes);
app.use('/api/simba-systems/notification', notificationRoutes);
app.use('/api/simba-systems/bursary', bursaryRoutes);
app.use('/api/simba-systems/settings', settingsRoutes);
app.use('/api/simba-systems/event', eventsRoutes);
app.use('/api/simba-systems/report', reportRoutes);

app.listen(port, () => {
    systemJob.start();
    console.log(`Server running at http://localhost:${port}`);
});
