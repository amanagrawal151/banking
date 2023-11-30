const Account = require("../models/accountModel");

const addInterest = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        // Get the current date
        let currentDate = new Date();

        // Subtract three months
        let threeMonthsAgo = new Date(currentDate);
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

        // let currentBalance = account.balance;
        let totalInterest = 0;
        const Rate = 0.002;

        account.transactions.slice().reverse().forEach(item => {
            if (item.createdAt > threeMonthsAgo) {
                // Calculate the time difference in milliseconds
                const timeDifference = Math.abs(currentDate - item.createdAt);

                // Convert time difference to days
                const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                totalInterest += Rate * item.balance * daysDifference
            }
            currentDate = item.createdAt;
        });
        account.transactions.push({
            change: totalInterest,
            balance: +account.balance + +totalInterest
        })
        account.markModified("transactions");
        account.balance += +totalInterest;
        account.markModified("balance");
        const updatedAccount = await account.save();
        res.status(200).send(`${updatedAccount}`);
    }
    catch {
        console.log("error at interest adding")
    }
}

const addFdInterest = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (account.account_type != "fd") {
            // Get the current date
            let currentDate = new Date();

            // Subtract three months
            let threeMonthsAgo = new Date(currentDate);
            threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

            // let currentBalance = account.balance;
            let totalInterest = 0;
            const Rate = 0.002;

            account.transactions.slice().reverse().forEach(item => {
                if (item.createdAt > threeMonthsAgo) {
                    // Calculate the time difference in milliseconds
                    const timeDifference = Math.abs(currentDate - item.createdAt);

                    // Convert time difference to days
                    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    totalInterest += Rate * item.balance * daysDifference
                }
                currentDate = item.createdAt;
            });
            account.transactions.push({
                change: totalInterest,
                balance: +account.balance + +totalInterest
            })
            account.markModified("transactions");
            account.balance += +totalInterest;
            account.markModified("balance");
            const updatedAccount = await account.save();
            res.status(200).send(`${updatedAccount}`);
        }
        else {
            let lastTransaction = account.transactions[account.transactions.length - 1];
            let currentDate = new Date();
            const timeDifference = Math.abs(currentDate - lastTransaction.createdAt);
            // Convert time difference to days
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            if (daysDifference > 180) {
                let totalInterest = 0.02 * daysDifference * account.balance;
                account.balance += +totalInterest;
                account.markModified("balance");
                account.transactions.push({
                    change: totalInterest,
                    balance: account.balance
                })
                account.markModified("transactions");
                const response = await account.save();
                res.status(200).send(response)
            }
            else
            {
                res.status(400).send("something went wrong")
            }
        }
    }
    catch {
        res.status(400).send("something went wrong")
        console.log("error at fd interest calculation")
    }
}

module.exports = {
    addInterest,
    addFdInterest
}