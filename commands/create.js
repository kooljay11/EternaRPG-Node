module.exports = {
    name: 'create',
    description: 'Creates a new character',
    aliases: ['c'],
    execute(message, args, connection) {
        const name = args[0];
        const characterClass = args[1];
        const level = args[2];

        const sql = `INSERT INTO characters (name, class, level) VALUES ('${name}', '${characterClass}', ${level})`;

        connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log('New character created with ID ' + result.insertId);
            message.reply('Your character has been created!');
        });
    },
};
