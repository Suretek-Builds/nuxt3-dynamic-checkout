import { ref } from "vue";

export function useCountdown(initialMinutes: number, initialSeconds: number) {
  const minutes = ref(initialMinutes);
  const seconds = ref(initialSeconds);
  let countdownInterval: ReturnType<typeof setInterval> | null = null;

  const startCountdown = () => {
    if (countdownInterval) return; // Prevent multiple intervals

    countdownInterval = setInterval(() => {
      if (seconds.value === 0) {
        if (minutes.value === 0) {
          clearInterval(countdownInterval!); // Stop countdown when it ends
          countdownInterval = null;
        } else {
          minutes.value -= 1; // Decrease minutes
          seconds.value = 59; // Reset seconds
        }
      } else {
        seconds.value -= 1; // Decrease seconds
      }
    }, 1000); // Update every second
  };

  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };

  return {
    minutes,
    seconds,
    startCountdown,
    stopCountdown,
  };
}
