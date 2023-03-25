module.exports = {
    name: 'daily',
    description: 'Collect your daily reward',
    execute(message, args, connection) {
        const userId = message.author.id;

        // Check if user has already collected the daily reward
        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setUTCHours(9); // Set reset time to 2AM PDT (9AM UTC)
        if (now < resetTime) {
            const remainingTime = Math.ceil((resetTime - now) / (1000 * 60 * 60));
            message.reply(`You can't collect your daily reward yet. Please wait ${remainingTime} hours.`);
            return;
        }

        const sql = `SELECT gold FROM players WHERE user_id = '${userId}'`;
        connection.query(sql, (err, result) => {
            if (err) throw err;

            const gold = result[0].gold;
            const reward = 100;

            // Add reward to player's gold and update database
            const newGold = gold + reward;
            const updateSql = `UPDATE players SET gold = ${newGold} WHERE user_id = '${userId}'`;
            connection.query(updateSql, (err, result) => {
                if (err) throw err;

                console.log(`Player ${userId} collected daily reward of ${reward} gold.`);
                message.reply(`You have collected your daily reward of ${reward} gold. Your total gold is now ${newGold}.`);

                // Update last_daily_reward_time in database
                const timeSql = `UPDATE players SET last_daily_reward_time = NOW() WHERE user_id = '${userId}'`;
                connection.query(timeSql, (err, result) => {
                    if (err) throw err;
                });
            });
        });
    },
};
