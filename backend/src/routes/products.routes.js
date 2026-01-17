import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as productController from '../controllers/products.controller.js';

const router = express.Router();

/**
 * GET /api/products
 * Obtener todos los productos (con filtros opcionales)
 */
router.get('/', productController.getAllProducts);

/**
 * GET /api/products/:id
 * Obtener producto por ID
 */
router.get('/:id', productController.getProductById);

/**
 * POST /api/products
 * Crear nuevo producto
 */
router.post('/', authenticate, productController.createProduct);

/**
 * PUT /api/products/:id
 * Actualizar producto
 */
router.put('/:id', authenticate, productController.updateProduct);

/**
 * DELETE /api/products/:id
 * Eliminar producto
 */
router.delete('/:id', authenticate, productController.deleteProduct);

// ============================================
// RUTAS DE IMÁGENES
// ============================================

router.get('/:id/images', productController.getProductImages);
router.post('/:id/images', authenticate, productController.addProductImage);
router.put('/:id/images/:imageId', authenticate, productController.updateProductImage);
router.delete('/:id/images/:imageId', authenticate, productController.deleteProductImage);
router.put('/:id/images/:imageId/primary', authenticate, productController.setPrimaryImage);

// ============================================
// RUTAS DE ATRIBUTOS (MARCAS, TALLES, COLORES)
// ============================================

router.post('/:id/brands', authenticate, productController.associateBrand);
router.delete('/:id/brands/:brandId', authenticate, productController.disassociateBrand);

router.post('/:id/sizes', authenticate, productController.associateSize);
router.delete('/:id/sizes/:sizeId', authenticate, productController.disassociateSize);

router.post('/:id/colors', authenticate, productController.associateColor);
router.delete('/:id/colors/:colorId', authenticate, productController.disassociateColor);

// ============================================
// RUTAS DE PRECIOS POR CANTIDAD
// ============================================

router.get('/:id/prices', productController.getProductPrices);
router.post('/:id/prices', authenticate, productController.addProductPrice);
router.put('/:id/prices/:priceId', authenticate, productController.updateProductPrice);
router.delete('/:id/prices/:priceId', authenticate, productController.deleteProductPrice);

// ============================================
// RUTAS DE VIDEOS
// ============================================

router.get('/:id/videos', productController.getProductVideos);

export default router;
