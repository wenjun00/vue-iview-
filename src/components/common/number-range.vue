<template>
  <section class="component number-range">
    <i-input-number v-model.lazy="minValue" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" :placeholder="minPlaceholder"></i-input-number>
    <span>-</span>
    <i-input-number v-model.lazy="maxValue" :min="0" :max="99999999" :formatter="$filter.moneyFormat" :parser="$filter.moneyParse" :placeholder="maxPlaceholder"></i-input-number>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch, Prop, Emit, Model } from "vue-property-decorator";

@Component({
  components: {}
})
export default class NumberRange extends Vue {


  @Prop() minPlaceholder;
  @Prop() maxPlaceholder;
  @Prop({
    type: Boolean,
    default: false
  }) isInteger;

  @Model("numberRangeChange") numberRange: { min: number, max: number };

  @Emit("numberRangeChange")
  updateNumberRange(value) {}

  @Watch("numberRange")
  onNumberChange(value) {
    this.inputNumber.min = value.min;
    this.inputNumber.max = value.max;
  }

  public inputNumber = { min: 0, max: 0 };

  get minValue() {
    return this.inputNumber.min
  }

  get maxValue() {
    return this.inputNumber.max
  }

  set minValue(value) {
    this.updateNumberRange({
      min: this.parseInt(value),
      max: this.inputNumber.max
    });
  }
  set maxValue(value) {
    this.updateNumberRange({
      min: this.inputNumber.min,
      max: this.parseInt(value)
    });
  }

  parseInt(value) {
    if (this.isInteger) {
      return Math.round(Number.parseFloat(value))
    }
    return value
  }
  public validate(rule, value, callback) {
    if (this.numberRange.min > this.numberRange.max) {
      callback(new Error("输入数字范围有误"));
    } else {
      callback()
    }
  }
}
</script>

