import { useState } from 'react';
import apiService from '../../services/api';
import './TestConnection.css';

interface TestResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

const TestConnection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await apiService.testConnection();
      setResult({
        success: response.success,
        message: response.message,
        data: response.data,
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Error al conectar con el backend',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await apiService.healthCheck();
      setResult({
        success: response.success,
        message: 'Health check exitoso',
        data: response,
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Error en health check',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestDatabase = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await apiService.testDatabase();
      setResult({
        success: response.success,
        message: response.message || 'Prueba de base de datos',
        data: response,
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Error al conectar con la base de datos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetDatabaseData = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await apiService.getDatabaseData();
      setResult({
        success: response.success,
        message: response.message || 'Datos obtenidos de la base de datos',
        data: response.data,
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Error al obtener datos de la base de datos',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-connection">
      <h2>Prueba de Conexión con el Backend</h2>
      
      <div className="test-connection__buttons">
        <button 
          onClick={handleTest} 
          disabled={loading}
          className="test-connection__button"
        >
          {loading ? 'Probando...' : 'Probar Conexión'}
        </button>
        
        <button 
          onClick={handleHealthCheck} 
          disabled={loading}
          className="test-connection__button"
        >
          {loading ? 'Verificando...' : 'Health Check'}
        </button>

        <button 
          onClick={handleTestDatabase} 
          disabled={loading}
          className="test-connection__button"
        >
          {loading ? 'Probando...' : 'Probar Base de Datos'}
        </button>

        <button 
          onClick={handleGetDatabaseData} 
          disabled={loading}
          className="test-connection__button"
        >
          {loading ? 'Obteniendo...' : 'Obtener Datos DB'}
        </button>
      </div>

      {result && (
        <div className={`test-connection__result ${result.success ? 'success' : 'error'}`}>
          {result.success ? (
            <>
              <h3>✅ Conexión Exitosa</h3>
              {result.message && <p className="message">{result.message}</p>}
              {result.data && (
                <div className="data">
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              )}
            </>
          ) : (
            <>
              <h3>❌ Error de Conexión</h3>
              <p className="error-message">{result.error || result.message}</p>
              <p className="help-text">
                Asegúrate de que el servidor backend esté corriendo en{' '}
                <code>http://localhost:3000</code>
              </p>
            </>
          )}
        </div>
      )}

      <div className="test-connection__info">
        <h4>Información:</h4>
        <ul>
          <li>Backend URL: <code>{import.meta.env.VITE_API_URL || 'http://localhost:3000'}</code></li>
          <li>Endpoint de prueba: <code>/api/test</code></li>
          <li>Health check: <code>/api/test/health</code></li>
          <li>Test base de datos: <code>/api/database/test</code></li>
          <li>Datos de prueba: <code>/api/database/data</code></li>
        </ul>
      </div>
    </div>
  );
};

export default TestConnection;
