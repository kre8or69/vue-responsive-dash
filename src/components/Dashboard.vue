<template>
  <div :id="id" ref="resizeRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, watch, reactive } from "vue";
import { Dashboard } from "./Dashboard.model";
import useResizeObserver from "@/use/resizeObserver";

export default defineComponent({
  name: "Dashboard",
  inheritAttrs: false,
  props: {
    id: { type: [Number, String], required: true },
    autoHeight: { type: Boolean, default: Dashboard.defaults.autoHeight },
  },
  setup(props, { emit }) {
    const dashboard: Dashboard = reactive(new Dashboard(props)) as Dashboard;
    provide("$dashboard", dashboard);

    watch(
      () => props.autoHeight,
      (newAutoHeightValue) => {
        dashboard.autoHeight = newAutoHeightValue;
      }
    );

    const { resizeRef, resizeState } = useResizeObserver();
    watch(
      resizeState,
      (newDimensions) => {
        dashboard.width = newDimensions.dimensions?.width ?? 0;
      },
      { immediate: true }
    );

    watch(
      () => dashboard.currentBreakpoint,
      (newBreakpoint) => {
        emit("currentBreakpointUpdated", newBreakpoint);
      },
      { immediate: true }
    );

    return {
      resizeRef,
    };
  },
});
</script>
