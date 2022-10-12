const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: 'Guilds',
    tableName: 'guilds',
    columns: {
        index: {
            primary: true,
            type: "int",
            generated: true
        },
        id: {
            type: 'varchar',
            length: '18',
            nullable: false,
            unique: true
        },
        name: {
            type: 'tinytext',
            nullable: true
        },
        modLog: {
            name: 'mod_log',
            type: 'varchar',
            length: '32',
            nullable: true
        }
    }
});