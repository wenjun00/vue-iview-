<!--车检记录-->
<template>
  <section class="component modify-yearly-check-record">
    <i-form ref="form" inline :model="model" :rules="rules" :label-width="110">
      <i-row :gutter="15">
        <i-col :span="12">
          <i-form-item label="车检到期日" prop="inspectEndDate">
            <i-date-picker class="form-picker" v-model="model.inspectEndDate" placeholder="请选择车检到期日" clearable></i-date-picker>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="车检结果" prop="inspectResult">
            <i-select v-model="model.inspectResult" clearable>
              <i-option v-for="{label,value} of $dict.getDictData(10080)" :key="value" :label="label" :value="value"></i-option>
            </i-select>
          </i-form-item>
        </i-col>
        <i-col :span="12">
          <i-form-item label="车检费用" prop="inspectCost">
            <i-input-number v-model="model.inspectCost" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse"></i-input-number>
          </i-form-item>
        </i-col>
        <i-col :span="24">
          <i-form-item label="车检备注" prop="remark ">
            <i-input v-model="model.remark " class="item-full" :maxlength="100" clearable></i-input>
          </i-form-item>
        </i-col>
      </i-row>
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
export default class ModifyYearlyCheckRecord extends Vue {
    @Dependencies(BasicCarDetailService)
    private basicCarDetailService: BasicCarDetailService;

    @Prop() data;
    @Prop() stockId; 
    private model: any = null;
    private rules: any = null;

    created() {
        this.model = {
            inspectEndDate: null,
            inspectResult: null,
            inspectCost: null,
            remark: ""
        };

        this.rules = {
            inspectEndDate: {
                required: true,
                message: "请选择车检终止日",
                trigger: "blur",
                type: "date"
            },
            inspectCost: {
                required: true,
                message: "请输入年检金额",
                trigger: "blur",
                type: "number"
            },
            inspectResult: {
                required: true,
                message: "请选择年检结果",
                trigger: "blur",
                type: "number"
            }
        };
    }

    mounted() {
        if (this.data) {
            this.model = Object.assign({}, this.data);
            this.model.inspectEndDate = new Date(this.data.inspectEndDate)
        }
    }

    /**
     * 新增车检记录
     */
    private addInspection() {
        return new Promise((resolve, reject) => {
            this.basicCarDetailService
                .addCarInspectionRecord(this.model,this.stockId)
                .subscribe(data => resolve(), err => reject(err));
        });
    }

    /**
     * 修改车检记录
     */
    private modifyInspection() {
        return new Promise((resolve, reject) => {
            this.basicCarDetailService
                .editCarInspectionRecord(this.model,this.data.id)
                .subscribe(data => resolve(), err => reject(err));
        });
    }

    private submit() {
        let form: any = this.$refs.form;
        return new Promise(resolve => {
            form.validate(v => {
                if (!v) return resolve();
                let result = this.data ? this.modifyInspection() : this.addInspection();
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
