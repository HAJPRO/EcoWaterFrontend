import api from "@/helpers/api";

// Backenddagi asosiy marshrut (Routerdagi prefix)
// Agar backendda app.use('/api/sale/products', router) qilingan bo'lsa:
const RESOURCE = "sale/products"; 

export const ProductManagmentService = {
    
    /**
     * Barcha mahsulotlarni olish
     * Method: GET
     * Parametrlar (page, limit, search) URLda ketadi (?page=1&search=...)
     */
    GetAll(queryParams) {
        // Axios-da GET so'rovida body bo'lmaydi, parametrlar 'params' ichida beriladi
        return api.get(RESOURCE, { params: queryParams });
    },

    /**
     * Bitta mahsulotni olish
     * Method: GET
     * URL: /sale/products/:id
     */
    GetOne(id) {
        return api.get(`${RESOURCE}/${id}`);
    },

    /**
     * Yangi mahsulot yaratish
     * Method: POST
     */
    Create(data) {
        return api.post(RESOURCE, data);
    },

    /**
     * Mahsulotni o'zgartirish
     * Method: PUT
     * URL: /sale/products/:id
     */
    UpdateById(id, data) {
        return api.put(`${RESOURCE}/${id}`, data);
    },

    /**
     * Mahsulotni o'chirish
     * Method: DELETE
     * URL: /sale/products/:id
     */
    DeleteById(id) {
        return api.delete(`${RESOURCE}/${id}`);
    },
};