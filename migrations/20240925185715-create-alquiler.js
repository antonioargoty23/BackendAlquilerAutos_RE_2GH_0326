'use strict';

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('alquiler', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      fechaInicio: {
        type: DataTypes.DATE
      },
      fechaFin: {
        type: DataTypes.DATE
      },
      clienteId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'clientes',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      autoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'autos',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      estado: {                        // ✅ campo agregado aquí
        type: DataTypes.STRING,
        defaultValue: 'activo',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('alquiler');
  }
};