import api from "@/helpers/api";

// Asosiy URL prefix
const RESOURCE = "warehouses/input";

export const InputWarehouseService = {
    clearDocumentAll() {
        return api.post(`${RESOURCE}/clear-all`);
    },
    /**
     * Yangi model shablonini olish
     * Method: GET
     */
    GetModel() {
        return api.get(`${RESOURCE}/model`);
    },

    /**
     * Yangi partiya yaratish yoki kirim qilish
     * Method: POST
     * Payload: { ...data, action: 'create' | 'update' }
     */
    Create(data) {
        return api.post(`${RESOURCE}/create`, data);
    },

    /**
     * Barchasini olish (Pagination & Filter)
     * Method: GET
     * Parametrlar query orqali ketadi: ?page=1&limit=10&search=...
     */
    GetAll(params) {
        return api.get(RESOURCE, { params });
    },

    /**
     * Bittasini olish
     * Method: GET
     * URL: /warehouses/r-warehouse/:id
     */
    GetOne(id) {
        return api.get(`${RESOURCE}/${id}`);
    },

    /**
     * Mahsulot chiqarish (Sotuv/Chiqim)
     * Method: POST (Chunki bu murakkab tranzaksiya)
     * URL: /warehouses/r-warehouse/output
     */
    OutputProduct(data) {
        return api.post(`${RESOURCE}/output`, data);
    },

    /**
     * O'chirish (Partiya yoki tarix)
     * Method: DELETE
     * URL: /warehouses/r-warehouse/:id?action=...
     * Backendga id URLda, action (nimani o'chirish) esa queryda boradi.
     */
    DeleteById(id, action = 4) {
        // action: 1-input, 2-products, 3-output, 4-main (default)
        return api.delete(`${RESOURCE}/${id}`, { 
            params: { action } 
        });
    },
};