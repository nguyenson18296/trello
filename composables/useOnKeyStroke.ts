import { onMounted, onUnmounted, type Ref } from "vue";

interface KeyStrokeOptions {
  target?: Ref<HTMLElement | null> | Window; // Optional target to listen to, defaults to window
}

function useOnKeyStroke(
  key: string | string[],
  callback: (event: KeyboardEvent) => void,
  options?: KeyStrokeOptions
) {
  const { target = window } = options || {};

  const handleKeyPress = (event: KeyboardEvent) => {
    if (Array.isArray(key)) {
      if (key.includes(event.key)) {
        callback(event);
      }
    } else {
      if (event.key === key) {
        callback(event);
      }
    }
  };

  onMounted(() => {
    (target as EventTarget).addEventListener(
      "keydown",
      handleKeyPress as EventListener
    );
  });

  onUnmounted(() => {
    (target as EventTarget).removeEventListener(
      "keydown",
      handleKeyPress as EventListener
    );
  });
}

export default useOnKeyStroke;
