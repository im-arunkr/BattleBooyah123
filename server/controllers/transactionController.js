const Transaction = require('../models/Transaction');

const getMyTransactions = async (req, res) => {
    console.log('\n--- DEBUGGING: TRANSACTION CONTROLLER REACHED ---');
    try {
        // Log the entire user object that the middleware found
        console.log('1. User object from middleware:', req.user);

        // Log the specific ID we are using in our search
        const loggedInUserId = req.user.id;
        console.log('2. Searching for transactions where user ID is:', loggedInUserId);

        // This is the query that is currently failing
        const transactions = await Transaction.find({ user: loggedInUserId }).sort({ createdAt: -1 });

        // Log the result of that query
        console.log('3. Query finished. Found', transactions.length, 'matching transactions.');
        
        // --- FOR TESTING ---
        // Let's also find ALL transactions in the database, ignoring the user filter,
        // to make sure we can read the collection at all.
        const allTransactionsInDB = await Transaction.find({});
        console.log('4. For testing, there are a total of', allTransactionsInDB.length, 'transactions in the entire database.');
        console.log('-------------------------------------------\n');

        res.json(transactions); // Send the (currently empty) list back

    } catch (err) {
        console.error('!!! ERROR IN TRANSACTION CONTROLLER !!!:', err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getMyTransactions };