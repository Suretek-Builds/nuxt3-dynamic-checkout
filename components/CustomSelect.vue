<template>
  <div class="w-full">
    <select v-model="selectedValue"
      @change="updateValue($event.target.value)" :class="selectClass" >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option[optionsValue]"
      >
        {{ option[displayName] }}
      </option>
    </select>
    <ErrorMessage :errorMessage="errorMessage" />
  </div>
</template>

<script setup>
import { useFormStore, useShippingStore } from "~/stores";
import ErrorMessage from "./ErrorMessage.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  errorMessage: [String, Array],
  options: {
    type: [Array, Promise],
    required: true,
  },
  optionsValue: String,
  displayName: String,
  id: String,
  placeholder: {
    type: String,
    default: "Select an option",
  },
  selectClass: {
    type: String,
    default:
      "border border-gray-300 py-[6px] px-[12px] rounded-md bg-white text-gray-700 xl:text-sm text-xs  w-full h-[42px] mt-2",
  },
});

// form store
const formStore = useFormStore();
const handleError = formStore.handleError;

// shipping store
const shippingStore = useShippingStore();

const { modelValue, errorMessage, options, placeholder, selectClass } =
  toRefs(props);
const emit = defineEmits();

// Local state to manage the selected value
const selectedValue = ref(modelValue.value);

// Watch for changes in modelValue prop and update local state
watch(modelValue, (newValue) => {
  selectedValue.value = newValue;
});

// Update the value and emit events on change
const updateValue = (value) => {
  selectedValue.value = value; // Update local value
  emit("update:modelValue", value); // Emit the change
  emit("change", value);
  shippingStore.updateShipping();
  handleError(props.id)
};
</script>
