import { HttpClient } from './http';
import { AuthService } from './auth.service';
import { CatalogService } from './catalog.service';
import { StockService } from './stock.service';
import { SalesService } from './sales.service';
import { UserService } from './user.service';
import { GeneralService } from './general.service';
import { SuperAdminService } from './superAdmin.service';

/**
 * Servicio para hacer llamadas al API
 * 
 * ATENCIÓN: Este archivo ahora actúa como un "Facade" que combina múltiples servicios especializados.
 * La implementación real de cada método está en los servicios específicos (auth.service.ts, catalog.service.ts, etc.)
 */

export * from '../types/models';

// Definición de ApiService usando "Interface Merging" para combinar todos los tipos de los servicios
interface ApiService extends
  AuthService,
  CatalogService,
  StockService,
  SalesService,
  UserService,
  GeneralService,
  SuperAdminService { }

class ApiService extends HttpClient {
  constructor() {
    super();
  }
}

// Función helper para aplicar mixins
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      // No sobrescribir constructor o métodos base de HttpClient si ya existen
      if (name !== 'constructor') {
        Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!);
      }
    });
  });
}

// Aplicar los mixins a la clase ApiService
applyMixins(ApiService, [
  AuthService,
  CatalogService,
  StockService,
  SalesService,
  UserService,
  GeneralService,
  SuperAdminService
]);

export const apiService = new ApiService();
export default apiService;
