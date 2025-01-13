<template>
  <div class="w-full">
    <input :id="id" :type="type" :placeholder="placeholder" :value="modelValue" @input="updateValue" :class="[baseClass, width]"
      :maxlength="maxLength" @keypress="handleKeypress" @focus="handleFocus" @blur="handleBlur" />
    <ErrorMessage v-if="errorMessage" :errorMessage="errorMessage" :errorClear="errorStatus" />
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import ErrorMessage from "./ErrorMessage.vue";
import { useFormStore } from '~/stores/formStore';

const formStore = useFormStore();
const handleError = formStore.handleError;

const props = defineProps({
  modelValue: String,
  placeholder: String,
  type: {
    type: String,
    default: "text",
  },
  errorMessage: [String, Array],
  baseClass: {
    type: String,
    default: "border rounded-md border-gray-300 py-[6px] px-[12px] mt-2 xl:text-sm text-xs h-[42px]",
  },
  width: {
    type: String,
    default: "w-full",
  },
  maxLength: Number,
  regex: String,
  id: String,
  submitPartialOrder:Function
});

const errorStatus = ref(false);
const { modelValue, placeholder, type, errorMessage, regex ,submitPartialOrder} = toRefs(props);

const emit = defineEmits(); // Define emits

// Method to emit updated value
const updateValue = (event) => {
  const value = event.target.value;
  // Emit the updated value
  emit('update:modelValue', value);
  clearError();
};
// Method to handle keypress validation
const handleKeypress = (event) => {
  const regexPattern = new RegExp(props.regex);
  if (!regexPattern.test(event.key)) {
    event.preventDefault(); // Prevent invalid input
  }
};

// Method to clear the error message
const clearError = () => {
  handleError(props.id)
};
 // Conditionally call submitPartialOrder if it's provided
 const handleBlur =()=>{
  if (submitPartialOrder && typeof submitPartialOrder.value === 'function') {
    submitPartialOrder.value();
  }
 }

</script>
