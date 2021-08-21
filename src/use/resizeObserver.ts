import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { UnwrapNestedRefs } from "@vue/reactivity";

interface DOMRectDimensions {
  bottom?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  width?: number;
  x?: number;
  y?: number;
}

interface DOMRect {
  dimensions: DOMRectDimensions;
}

export const useResizeObserver = () => {
  // create a new ref,
  // which needs to be attached to an element in a template
  const resizeRef = ref();
  const resizeState: UnwrapNestedRefs<DOMRect> = reactive({
    dimensions: {
      bottom: undefined,
      height: undefined,
      left: undefined,
      right: undefined,
      top: undefined,
      width: undefined,
      x: undefined,
      y: undefined,
    },
  });

  const observer = new ResizeObserver((entries) => {
    // called initially and on resize
    entries.forEach((entry) => {
      resizeState.dimensions = entry.contentRect;
    });
  });

  onMounted(() => {
    // set initial dimensions right before observing: Element.getBoundingClientRect()
    resizeState.dimensions = resizeRef.value?.getBoundingClientRect();
    observer.observe(resizeRef.value);
  });

  onBeforeUnmount(() => {
    observer.unobserve(resizeRef.value);
  });

  // return to make them available to whoever consumes this hook
  return { resizeState, resizeRef };
};

export default useResizeObserver;
