import api from "@/helpers/api";

// Backenddagi asosiy marshrut (Routerdagi prefix):
// Masalan: /api/sale/salepos
const RESOURCE = "sale/salepos"; 

export const SaleposManagmentService = {
    
    /**
     * Barcha Sotuv Cheklarini/Tranzaksiyalarini olish (Masalan, kunlik sotuvlar)
     * Method: GET
     * Parametrlar (page, limit, search) URLda ketadi.
     */
    GetAllSales(queryParams) {
        // Axios-da GET so'rovida body bo'lmaydi, parametrlar 'params' ichida beriladi
        return api.get(RESOURCE, { params: queryParams });
    },

    /**
     * Bitta Sotuv Chekini/Tranzaksiyasini olish
     * Method: GET
     * URL: /sale/salepos/:id
     */
    GetSaleById(id) {
        return api.get(`${RESOURCE}/${id}`);
    },

    /**
     * Yangi Savdo Tranzaksiyasini yaratish (Chekni Yakunlash / To'lov)
     * Bu Pinia Store'dagi 'CreateSaleTransaction' actionidan chaqiriladi.
     * Method: POST
     * Data (Payload) tarkibi: customerId, items[], totalAmount, paymentType, etc.
     */
    CreateSale(data) {
        return api.post(`${RESOURCE}/create`, data);
    },

    /**
     * Tranzaksiya holatini o'zgartirish (Masalan, Nasiya Chekni To'langan deb belgilash)
     * Method: PUT
     * URL: /sale/salepos/:id
     */
    UpdateSaleStatus(id, data) {
        return api.put(`${RESOURCE}/${id}`, data);
    },

    /**
     * Sotuv Chekini bekor qilish/o'chirish
     * Method: DELETE
     * URL: /sale/salepos/:id
     */
    DeleteSale(id) {
        return api.delete(`${RESOURCE}/${id}`);
    },
};