<!--GPS记录-->
<template>
  <section class="component prepare-car-add-gps">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-form-item label="设备厂家" prop="gpsManufactor">
        <i-select v-model="model.gpsManufactor" placeholder="请选择设备厂家" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10045)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
      <i-form-item label="设备号" prop="gpsNo">
        <i-input v-model="model.gpsNo" placeholder="请输入设备号" clearable :maxlength="50"></i-input>
      </i-form-item>
      <i-form-item label="GPS安装状态" prop="gpsStatus">
        <i-select v-model="model.gpsStatus" placeholder="请选择GPS安装状态" clearable>
          <i-option v-for="{label,value} of $dict.getDictData(10073)" :key="value" :label="label" :value="value"></i-option>
        </i-select>
      </i-form-item>
    </i-form>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dependencies } from "~/core/decorator";
import { BasicCarDetailService } from "~/services/manage-service/basic-car-detail.service";
import ChooseVehicleModel from "~/components/operate-center/choose-vehicle-model.tsx.vue";


@Component({
    components: {
        ChooseVehicleModel
    }
})
export default class PrepareCarAddGPS extends Vue {
    @Dependencies(BasicCarDetailService)
    private basicCarDetailService: BasicCarDetailService;

    @Prop() data;
    @Prop() stockId; 
    private model: any = null;
    private rules: any = null;

    created() {
        this.model = {
            gpsManufactor: "",
            gpsNo: "",
            gpsStatus: ""
        };

        this.rules = {
            gpsManufactor: {
                required: true,
                message: "请输入设备厂家",
                trigger: "blur",
                type: "number"
            },
            gpsNo: {
                required: true,
                message: "请输设备号",
                trigger: "blur"
            },
            gpsStatus: {
                required: true,
                message: "请选择GPS安装状态",
                trigger: "blur",
                type: "number"
            }
        };
    }

    mounted() {
        if (this.data) {
            this.model = Object.assign({}, this.data);
        }
    }

    /**
     * 新增GPS记录
     */
    private addGPS() {
        return new Promise((resolve, reject) => {
            this.basicCarDetailService
                .addCarGps(this.model,this.stockId)
                .subscribe(data => resolve(), err => reject(err));
        });
    }

    /**
     * 修改GPS记录
     */
    private modifyGPS() {
        return new Promise((resolve, reject) => {
            this.basicCarDetailService
                .editCarGps(this.model,this.data.id)
                .subscribe(data => resolve(), err => reject(err));
        });
    }

    private submit() {
        let form: any = this.$refs.form;
        return new Promise(resolve => {
            form.validate(v => {
                if (!v) return resolve();
                let result = this.data ? this.modifyGPS() : this.addGPS();
                result
                    .then(() => {
                        this.$Message.success("操作成功");
                        resolve(true);
                    })
                    .catch(e => {
                        this.$Message.error(e.msg);
                        resolve();
                    });
            });
        });
    }
}
</script>
<style lang="less">
</style>
