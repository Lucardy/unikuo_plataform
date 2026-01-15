import pool from '../config/database.js';

/**
 * Modelo de Usuario
 */
class User {
  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    const query = `
      SELECT 
        u.id,
        u.email,
        u.password,
        u.first_name,
        u.last_name,
        u.active,
        u.email_verified,
        u.created_at,
        u.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'name', r.name,
              'description', r.description
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = $1
      GROUP BY u.id
    `;

    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    // Convertir roles de JSON string a array si es necesario
    if (typeof user.roles === 'string') {
      user.roles = JSON.parse(user.roles);
    }
    return user;
  }

  /**
   * Buscar usuario por ID
   */
  async findById(userId) {
    const query = `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.active,
        u.email_verified,
        u.created_at,
        u.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'name', r.name,
              'description', r.description
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
      GROUP BY u.id
    `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    // Convertir roles de JSON string a array si es necesario
    if (typeof user.roles === 'string') {
      user.roles = JSON.parse(user.roles);
    }
    return user;
  }

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    const { email, password, first_name, last_name, roleIds = [] } = userData;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insertar usuario
      const userQuery = `
        INSERT INTO users (email, password, first_name, last_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, first_name, last_name, active, email_verified, created_at, updated_at
      `;
      const userResult = await client.query(userQuery, [email, password, first_name, last_name]);
      const user = userResult.rows[0];

      // Asignar roles si se proporcionaron
      if (roleIds.length > 0) {
        const roleValues = roleIds.map((roleId, index) => {
          const baseIndex = index * 2;
          return `($${baseIndex + 1}, $${baseIndex + 2})`;
        }).join(', ');

        const roleParams = roleIds.flatMap(roleId => [user.id, roleId]);
        const roleQuery = `
          INSERT INTO user_roles (user_id, role_id)
          VALUES ${roleValues}
        `;
        await client.query(roleQuery, roleParams);
      }

      await client.query('COMMIT');

      // Obtener usuario completo con roles
      return await this.findById(user.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Verificar si el email ya existe
   */
  async emailExists(email) {
    const query = 'SELECT id FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }

  /**
   * Obtener todos los roles disponibles
   */
  async getRoles() {
    const query = 'SELECT id, name, description FROM roles ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }
}

export default new User();
