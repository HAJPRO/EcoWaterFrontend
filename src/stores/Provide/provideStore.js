import { SaleService } from "../../ApiServices/Sale/sale.service";
import { ProvideService } from "../../ApiServices/Provide/provide.service";
import { ToastifyService } from "../../utils/Toastify";
import { loading } from "./../../utils/Loader";
import { defineStore } from "pinia";

export const ProvidePlanStore = defineStore("ProvidePlanStore", {
  state: () => {
    return {
      card_id: "",
      detail_paint_modal: false,
      detail_weaving_modal: false,
      detail_spinning_modal: false,
      items: [],
      detail: [],
      all_length: {},
      item: [],
      model: "",
      is_provide: false,
      departmen: "",
      is_active: "",
    };
  },
  actions: {
    async DetailModal(payload) {
      try {
        if (payload.department === 2) {
          this.detail_paint_modal = true;
          this.card_id = payload.id;
        }
        if (payload.department === 3) {
          this.detail_weaving_modal = true;
          this.card_id = payload.id;
        }
        if (payload.department === 4) {
          this.detail_spinning_modal = true;
          this.card_id = payload.id;
        }
        const data = await ProvideService.getOne(payload);
        this.detail = data.data;
      } catch (err) {
        console.log(err);
      }
    },
    IsActive(payload) {
      this.is_active = payload.is_active;
    },
    async getAll(payload) {
      const data = await ProvideService.getAll(payload);
      this.items = data.data.items;
      this.all_length = data.data.all_length;
    },

    async cancelSendReason(payload) {
      try {
        const loader = loading.show();
        const data = await ProvideService.cancelReason({
          reason: payload.reason,
          card_id: this.card_id,
        });
        loader.hide();
        const Refresh = () => {
          window.location.href = "/explore/department/provide/working/plan";
        };
        ToastifyService.ToastSuccess({ msg: data.data.msg });
        setTimeout(Refresh, 1500);
      } catch (error) {
        ToastifyService.ToastError({
          msg: error.message,
        });
      }
    },
    async Confirm(item) {
      const loader = loading.show();
      const data = await ProvideService.Confirm({
        ...item,
        card_id: this.card_id,
      });
      if (item.department === 2) {
        this.detail_paint_modal = false;
      }
      if (item.department === 3) {
        this.detail_weaving_modal = false;
      }
      if (item.department === 4) {
        this.detail_spinning_modal = false;
      }
      this.getAll({ status: this.is_active });
      loader.hide();
      ToastifyService.ToastSuccess({
        msg: data.data.msg,
      });
    },
    async Delivered(payload) {
      try {
        const loader = loading.show();
        const data = await ProvideService.Delivered({
          reason: payload.reason,
          card_id: payload.id,
        });
        loader.hide();
        const Refresh = () => {
          window.location.href = "/explore/department/provide/working/plan";
        };
        ToastifyService.ToastSuccess({ msg: data.data.msg });
        setTimeout(Refresh, 1500);
      } catch (error) {
        ToastifyService.ToastError({
          msg: error.message,
        });
      }
    },

    // async cancelSendReason(payload) {
    //     console.log(payload);
    //     try {
    //         const loader = loading.show();
    //         const data = await PaintService.cancelReason({
    //             reason: payload.reason,
    //             card_id: payload.id,
    //         });
    //         loader.hide();
    //         const Refresh = () => {
    //             window.location.href = "/explore/department/paint/working/plan";
    //         };
    //         ToastifyService.ToastSuccess({ msg: data.data.msg });
    //         setTimeout(Refresh, 1500);
    //     } catch (error) {
    //         ToastifyService.ToastError({
    //             msg: error.message,
    //         });
    //     }
    // },
    // isConfirmModal(payload) {
    //     this.is_provide = payload.is_detail_modal;

    // },
    // async SaveToProvide(payload) {
    //     try {
    //         const loader = loading.show();
    //         const data = await PaintService.create({
    //             items: payload.data,
    //             card_id: payload.id,
    //         });
    //         loader.hide();
    //         const TimeOut = () => {
    //             window.location.href = "/explore/department/paint/working/plan";
    //         };
    //         ToastifyService.ToastSuccess({ msg: data.data.msg });
    //         setTimeout(TimeOut, 1000);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // },
    // async StatusModalById(payload) {
    //     this.status_modal.id = payload.id;
    //     this.status_modal.isModal = payload.is_detail_modal;
    //     // const data = await SaleService.getOne(payload.id)
    //     // this.model = data.data
    // },
    // async Update(payload) {
    //     try {
    //         const loader = loading.show();
    //         const updateData = await SaleService.Edit(this.card_id, payload);
    //         loader.hide();
    //         ToastifyService.ToastSuccess({
    //             msg: updateData.data.msg,
    //         });
    //         const Refresh = () => {
    //             window.location.href = "/explore/sale/legal";
    //         };
    //         setTimeout(Refresh, 1500);
    //     } catch (error) {
    //         return ToastifyService.ToastError({ msg: error.messages });
    //     }
    // },

    // async Confirm(id) {
    //     try {
    //         const loader = loading.show();
    //         const confirmData = await SaleService.confirm(id);
    //         loader.hide();
    //         ToastifyService.ToastSuccess({
    //             msg: confirmData.data.msg,
    //         });
    //         const Refresh = () => {
    //             window.location.href = "/explore/sale/legal";
    //         };
    //         setTimeout(Refresh, 1500);
    //     } catch (error) {
    //         return ToastifyService.ToastError({ msg: error.messages });
    //     }
    // },

    // async DeleteById(id) {
    //     try {
    //         const loader = loading.show();
    //         const data = await SaleService.Delete(id);
    //         loader.hide();
    //         ToastifyService.ToastSuccess({
    //             msg: data.data.msg,
    //         });
    //         const Refresh = () => {
    //             window.location.href = "/explore/sale/legal";
    //         };
    //         setTimeout(Refresh, 1500);
    //     } catch (error) {
    //         return ToastifyService.ToastError({ msg: error.messages });
    //     }
    // },
  },
});
