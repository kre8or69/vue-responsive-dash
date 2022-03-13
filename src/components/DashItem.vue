<template>
  <div
    :id="'item_' + id"
    ref="itemElement"
    class="item"
    :style="cssStyle"
    :class="classObj"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Resize Top Div -->
    <div
      :id="id + '-resizeTop'"
      :ref="id + '-resizeTop'"
      class="resize resize-top"
      :style="{
        height: resizeHandleSize + 'px',
        top: -(resizeHandleSize / 2) + 'px',
        left: 0,
        right: 0,
        cursor: 'ns-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeTop"
    >
      <slot name="resizeTop"></slot>
    </div>
    <!-- Resize Bottom Div -->
    <div
      :id="id + '-resizeBottom'"
      :ref="id + '-resizeBottom'"
      class="resize resize-bottom"
      :style="{
        height: resizeHandleSize + 'px',
        left: 0 + 'px',
        right: 0 + 'px',
        bottom: -(resizeHandleSize / 2) + 'px',
        cursor: 'ns-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeBottom"
    >
      <slot name="resizeBottom"></slot>
    </div>
    <!-- Resize Left Div -->
    <div
      :id="id + '-resizeLeft'"
      :ref="id + '-resizeLeft'"
      class="resize resize-left"
      :style="{
        width: resizeHandleSize + 'px',
        top: 0 + 'px',
        bottom: 0 + 'px',
        left: -(resizeHandleSize / 2) + 'px',
        cursor: 'ew-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeLeft"
    >
      <slot name="resizeLeft"></slot>
    </div>
    <!-- Resize Right Div -->
    <div
      :id="id + '-resizeRight'"
      :ref="id + '-resizeRight'"
      class="resize resize-right"
      :style="{
        width: resizeHandleSize + 'px',
        top: 0 + 'px',
        bottom: 0 + 'px',
        right: -(resizeHandleSize / 2) + 'px',
        cursor: 'ew-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeRight"
    >
      <slot name="resizeRight"></slot>
    </div>
    <!-- Resize Top Left Div -->
    <div
      :id="id + '-resizeTopLeft'"
      :ref="id + '-resizeTopLeft'"
      class="resize resize-left resize-top"
      :style="{
        width: resizeHandleSize * 2 + 'px',
        height: resizeHandleSize * 2 + 'px',
        top: -resizeHandleSize + 'px',
        left: -resizeHandleSize + 'px',
        cursor: 'nw-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeTopLeft"
    >
      <slot name="resizeTopLeft"></slot>
    </div>
    <!-- Top Right Resize Div -->
    <div
      :id="id + '-resizeTopRight'"
      :ref="id + '-resizeTopRight'"
      class="resize resize-right resize-top"
      :style="{
        width: resizeHandleSize * 2 + 'px',
        height: resizeHandleSize * 2 + 'px',
        top: -resizeHandleSize + 'px',
        right: -resizeHandleSize + 'px',
        cursor: 'ne-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeTopRight"
    >
      <slot name="resizeTopRight"></slot>
    </div>
    <!-- Bottom Left Resize Div -->
    <div
      :id="id + '-resizeBottomLeft'"
      :ref="id + '-resizeBottomLeft'"
      class="resize resize-left resize-bottom"
      :style="{
        width: resizeHandleSize * 2 + 'px',
        height: resizeHandleSize * 2 + 'px',
        bottom: -resizeHandleSize + 'px',
        left: -resizeHandleSize + 'px',
        cursor: 'ne-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeBottomLeft"
    >
      <slot name="resizeBottomLeft"></slot>
    </div>
    <!-- Bottom Right Resize Div -->
    <div
      :id="id + '-resizeBottomRight'"
      :ref="id + '-resizeBottomRight'"
      class="resize resize-right resize-bottom"
      :style="{
        width: resizeHandleSize * 2 + 'px',
        height: resizeHandleSize * 2 + 'px',
        bottom: -resizeHandleSize + 'px',
        right: -resizeHandleSize + 'px',
        cursor: 'nw-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeBottomRight"
    >
      <slot name="resizeBottomRight"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import interact from "interactjs";

import { DashItem } from "./DashItem.model";
import { Layout as layoutModel } from "./Layout.model";
import {
  defineComponent,
  provide,
  inject,
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { Interactable } from "@interactjs/types";

export default defineComponent({
  name: "DashItem",
  inheritAttrs: false,
  props: {
    id: { type: [Number, String], required: true },
    x: { type: Number, default: DashItem.defaults.x },
    y: { type: Number, default: DashItem.defaults.y },
    width: { type: Number, default: DashItem.defaults.width },
    maxWidth: { type: [Number, Boolean], default: DashItem.defaults.maxWidth },
    minWidth: { type: [Number, Boolean], default: DashItem.defaults.minWidth },
    height: { type: Number, default: DashItem.defaults.height },
    maxHeight: {
      type: [Number, Boolean],
      default: DashItem.defaults.maxHeight,
    },
    minHeight: {
      type: [Number, Boolean],
      default: DashItem.defaults.minHeight,
    },
    draggable: { type: Boolean, default: DashItem.defaults.draggable },
    resizable: { type: Boolean, default: DashItem.defaults.resizable },
    resizeEdges: { type: String, default: "bottom right" },
    resizeHandleSize: { type: Number, default: 8 },
    draggableZIndex: { type: Number, default: 1 },
    resizableZIndex: { type: Number, default: 1 },
    moveHold: { type: Number, default: 0 },
    resizeHold: { type: Number, default: 0 },
    dragAllowFrom: { type: String, default: null },
    dragIgnoreFrom: { type: String, default: null },
    locked: { type: Boolean, default: DashItem.defaults.locked },
  },
  setup(props, { emit }) {
    const itemElement = ref(); //This is the template ref we use for the element
    const item = reactive(new DashItem(props)) as DashItem;
    provide("$item", item);

    watch(props, (newPropValue) => {
      item.x = newPropValue.x;
      item.y = newPropValue.y;
      item.width = newPropValue.width;
      item.minWidth = newPropValue.minWidth;
      item.maxWidth = newPropValue.maxWidth;
      item.height = newPropValue.height;
      item.minHeight = newPropValue.minHeight;
      item.maxHeight = newPropValue.maxHeight;
      item.draggable = newPropValue.draggable;
      item.resizeEdges = newPropValue.resizeEdges;
      item.resizeHandleSize = newPropValue.resizeHandleSize;
      item.moveHold = newPropValue.moveHold;
      item.resizeHold = newPropValue.resizeHold;
      item.locked = newPropValue.locked;
    });

    const layout = inject("$layout") as layoutModel;

    let interactInstance: Interactable;

    const addWatchersToLayout = () => {
      //Check if layout exists and if not then start a watcher
      if (layout) {
        layout.addDashItem(item);
        createDashItemWatchers();
      } else {
        const unWatch = watch(layout, (newValue: layoutModel | undefined) => {
          if (newValue) {
            newValue.addDashItem(item);
            createDashItemWatchers();
            unWatch();
          }
        });
      }
    };

    onMounted(() => {
      interactInstance = interact(itemElement.value);
      setDraggable();
      setResizable();
      addWatchersToLayout();
    });
    onBeforeUnmount(() => {
      if (interactInstance) {
        interactInstance.unset();
      }
      if (layout) {
        layout.removeDashItem(item);
      }
    });

    const createDashItemWatchers = () => {
      watch(
        [() => item.x, () => item.y, () => item.width, () => item.height],
        ([
          newItemXValue,
          newItemYValue,
          newItemWidthValue,
          newItemHeightValue,
        ]) => {
          if (newItemXValue !== props.x) {
            emit("update:x", newItemXValue);
          }
          if (newItemYValue !== props.y) {
            emit("update:y", newItemYValue);
          }
          if (newItemWidthValue !== props.width) {
            emit("update:width", newItemWidthValue);
          }
          if (newItemHeightValue !== props.height) {
            emit("update:height", newItemHeightValue);
          }
        }
      );
    };

    const dragging = ref(false);
    const setDraggable = () => {
      if (!interactInstance) {
        return;
      }
      if (props.draggable && !props.locked) {
        interactInstance.draggable({
          enabled: true,
          hold: props.moveHold,
          allowFrom: props.dragAllowFrom,
          ignoreFrom: props.dragIgnoreFrom,
          listeners: {
            start: () => {
              dragging.value = true;
              item._onMoveStart();
              emit("moveStart", { ...item.toItem() });
            },
            move: (event) => {
              if (dragging) {
                item._onMove(event.dx, event.dy);
                emit("moving", { ...item.toItem() });
              }
            },
            end: () => {
              item._onMoveEnd();
              dragging.value = false;
              emit("moveEnd", { ...item.toItem() });
            },
          },
        });
      } else {
        interactInstance.draggable(false);
      }
    };

    const resizing = ref(false);
    const setResizable = () => {
      if (!interactInstance) {
        return;
      }
      if (props.resizable && !props.locked) {
        interactInstance.resizable({
          enabled: true,
          hold: props.resizeHold,
          edges: {
            top: ".resize-top",
            left: ".resize-left",
            bottom: ".resize-bottom",
            right: ".resize-right",
          },
          listeners: {
            start: () => {
              resizing.value = true;
              item._onResizeStart();
              emit("resizeStart", { ...item.toItem() });
            },
            move: (event) => {
              if (resizing) {
                item._onResize(event);
                emit("resizing", { ...item.toItem() });
              }
            },
            end: () => {
              item._onResizeEnd();
              resizing.value = false;
              emit("resizeEnd", { ...item.toItem() });
            },
          },
        });
      } else {
        interactInstance.resizable(false);
      }
    };

    const hover = ref(false);
    watch(hover, (newValue) => {
      item.hover = newValue;
      if (newValue) {
        emit("hoverStart", item);
      } else {
        emit("hoverEnd", item);
      }
    });

    watch(
      [
        () => props.draggable,
        () => props.moveHold,
        () => props.dragIgnoreFrom,
        () => props.dragAllowFrom,
      ],
      () => setDraggable()
    );
    watch([() => props.resizable, () => props.resizeHold], () =>
      setResizable()
    );
    watch(
      () => props.locked,
      () => {
        setDraggable();
        setResizable();
      }
    );
    const resizingOrDragging = computed((): boolean => {
      return (resizing.value || dragging.value) && !props.locked;
    });
    const useCssTransforms = computed((): boolean => {
      if (layout) {
        return layout.useCssTransforms;
      }
      return layoutModel.defaults.useCssTransforms;
    });

    const classObj = computed((): object => {
      return {
        dragging: resizingOrDragging.value,
        cssTransforms: useCssTransforms.value,
      };
    });

    const left = computed((): number => {
      return item ? item.left : 0;
    });
    const top = computed((): number => {
      return item ? item.top : 0;
    });
    const widthPx = computed((): number => {
      return item ? item.widthPx : 0;
    });
    const heightPx = computed((): number => {
      return item ? item.heightPx : 0;
    });
    const cssStyle = computed((): object => {
      if (useCssTransforms.value) {
        return DashItem.cssTransform(
          top.value,
          left.value,
          widthPx.value,
          heightPx.value
        );
      }
      return DashItem.cssTopLeft(
        top.value,
        left.value,
        widthPx.value,
        heightPx.value
      );
    });
    const resizeTop = computed((): boolean => {
      return (
        !props.locked && props.resizable && props.resizeEdges.includes("top")
      );
    });
    const resizeBottom = computed((): boolean => {
      return (
        !props.locked && props.resizable && props.resizeEdges.includes("bottom")
      );
    });
    const resizeLeft = computed((): boolean => {
      return (
        !props.locked && props.resizable && props.resizeEdges.includes("left")
      );
    });
    const resizeRight = computed((): boolean => {
      return (
        !props.locked && props.resizable && props.resizeEdges.includes("right")
      );
    });
    const resizeTopLeft = computed((): boolean => {
      return !props.locked && resizeTop.value && resizeLeft.value;
    });
    const resizeBottomLeft = computed((): boolean => {
      return !props.locked && resizeBottom.value && resizeLeft.value;
    });
    const resizeTopRight = computed((): boolean => {
      return !props.locked && resizeTop.value && resizeRight.value;
    });
    const resizeBottomRight = computed((): boolean => {
      return !props.locked && resizeBottom.value && resizeRight.value;
    });

    return {
      item,
      itemElement,
      hover,
      classObj,
      left,
      top,
      widthPx,
      heightPx,
      cssStyle,
      resizeTop,
      resizeBottom,
      resizeLeft,
      resizeRight,
      resizeTopLeft,
      resizeBottomLeft,
      resizeTopRight,
      resizeBottomRight,
    };
  },
});
</script>

<style scoped>
.item {
  box-sizing: border-box;
  position: absolute;
  display: inline-block;
  transition: all 200ms ease;
  transition-property: left, top, right;
  touch-action: none;
  user-select: none;
}
.item.dragging {
  transition: none;
  z-index: 3;
}

.resize {
  touch-action: none;
  user-select: none;
}

.item.cssTransforms {
  transition-property: transform;
  left: 0;
  right: auto;
}
</style>
