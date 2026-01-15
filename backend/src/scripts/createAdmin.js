/**
 * Script para crear usuario administrador inicial
 * Ejecutar con: node src/scripts/createAdmin.js
 */
import dotenv from 'dotenv';
import pool from '../config/database.js';
import { hashPassword } from '../utils/auth.js';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@unikuo.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const firstName = process.env.ADMIN_FIRST_NAME || 'Admin';
    const lastName = process.env.ADMIN_LAST_NAME || 'Unikuo';

    // Verificar si ya existe
    const exists = await User.emailExists(email);
    if (exists) {
      console.log('❌ El usuario administrador ya existe');
      return;
    }

    // Obtener ID del rol admin
    const roleQuery = "SELECT id FROM roles WHERE name = 'admin'";
    const roleResult = await pool.query(roleQuery);
    
    if (roleResult.rows.length === 0) {
      console.log('❌ El rol "admin" no existe. Asegúrate de que init.sql se haya ejecutado.');
      return;
    }

    const adminRoleId = roleResult.rows[0].id;

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await User.create({
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      roleIds: [adminRoleId],
    });

    console.log('✅ Usuario administrador creado exitosamente');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   ID: ${user.id}`);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
    process.exit(1);
  }
};

createAdmin();
