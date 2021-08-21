<template>
  <div v-if="currentBreakpoint === breakpoint">
    <div :style="{ position: 'relative', height: height, width: width }">
      <slot></slot>
      <DashItem
        :id="placeholderId"
        :draggable="false"
        :resizable="false"
        v-show="dragging || resizing"
        :y.sync="placeholderY"
        :height.sync="placeholderHeight"
        :maxWidth.sync="placeholderMaxWidth"
      >
        <slot name="placeholder">
          <div class="placeholder"></div>
        </slot>
      </DashItem>
    </div>
    <div v-if="debug">
      Layout Breakpoint: {{ breakpoint }} <br />
      Layout Number of Cols: {{ numberOfCols }} <br />
      placeholder: {{ JSON.stringify(placeholder) }} <br />
      Items: {{ JSON.stringify(itemsFromLayout) }} <br />
      Height: {{ height }} <br />
      Attrs: {{ attrs }}
    </div>
  </div>
</template>

<script lang="ts">
import { Layout } from "./Layout.model";
import { Dashboard as dashboardModel } from "./Dashboard.model";
import DashItem from "./DashItem.vue";
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
  PropType,
} from "vue";
import { Margin } from "@/interfaces";

export default defineComponent({
  name: "DashLayout",
  inheritAttrs: false,
  props: {
    breakpoint: { type: String, required: true },
    breakpointWidth: {
      type: Number,
      default: Layout.defaults.breakpointWidth,
    },
    numberOfCols: { type: Number, default: Layout.defaults.numberOfCols },
    useCssTransforms: {
      type: Boolean,
      default: Layout.defaults.useCssTransforms,
    },
    compact: { type: Boolean, default: Layout.defaults.compact },
    debug: { type: Boolean, default: false },
    margin: {
      type: Object as PropType<Margin>,
      default: Layout.defaults.margin,
    },
    rowHeight: {
      type: [Boolean, Number],
      default: Layout.defaults.rowHeight,
    },
    maxRowHeight: {
      type: [Boolean, Number],
      default: Layout.defaults.maxRowHeight,
    },
    minRowHeight: {
      type: [Boolean, Number],
      default: Layout.defaults.minRowHeight,
    },
    colWidth: {
      type: [Boolean, Number],
      default: Layout.defaults.colWidth,
    },
    maxColWidth: {
      type: [Boolean, Number],
      default: Layout.defaults.maxColWidth,
    },
    minColWidth: {
      type: [Boolean, Number],
      default: Layout.defaults.minColWidth,
    },
  },
  components: {
    DashItem,
  },
  setup(props, { attrs }) {
    const layout = reactive(new Layout(props)) as Layout;

    provide("$layout", layout);

    const dashboard = inject("$dashboard") as dashboardModel;

    onMounted(() => {
      //Check if dashboard exists and if not then start a watcher
      if (dashboard) {
        dashboard.addLayoutInstance(layout);
      } else {
        const unWatch = watch(
          dashboard,
          (newValue: dashboardModel | undefined) => {
            if (newValue) {
              newValue.addLayoutInstance(layout);
              unWatch();
            }
          }
        );
      }
    });
    onBeforeUnmount(() => {
      if (dashboard) {
        dashboard.removeLayoutInstance(layout);
      }
    });

    const currentBreakpoint = computed(() => {
      return dashboard ? dashboard.currentBreakpoint : "";
    });
    const dragging = computed(() => {
      return layout ? layout.itemBeingDragged : false;
    });
    const resizing = computed(() => {
      return layout ? layout.itemBeingResized : false;
    });
    const placeholder = computed(() => {
      return layout?.placeholder ? layout?.placeholder?.toItem() : "";
    });
    const itemsFromLayout = computed(() => {
      return layout ? layout.items : [];
    });
    const height = computed(() => {
      return layout ? layout.height + "px" : "0px";
    });
    const width = computed(() => {
      return layout ? layout.width + "px" : "0px";
    });

    watch(props, (newPropValue) => {
      layout.breakpoint = newPropValue.breakpoint;
      layout.breakpointWidth = newPropValue.breakpointWidth;
      layout.numberOfCols = newPropValue.numberOfCols;
      layout.useCssTransforms = newPropValue.useCssTransforms;
      layout.compact = newPropValue.compact;
      layout.debug = newPropValue.debug;
      layout.margin = newPropValue.margin;
      layout.rowHeight = newPropValue.rowHeight;
      layout.maxRowHeight = newPropValue.maxRowHeight;
      layout.minRowHeight = newPropValue.minRowHeight;
      layout.colWidth = newPropValue.colWidth;
      layout.maxColWidth = newPropValue.maxColWidth;
      layout.minColWidth = newPropValue.minColWidth;
    });

    const placeholderId = ref("-1Placeholder");
    const placeholderY = ref(0);
    const placeholderHeight = ref(0);
    const placeholderMaxWidth = ref(false);

    return {
      currentBreakpoint,
      dragging,
      resizing,
      height,
      width,
      placeholder,
      itemsFromLayout,
      attrs,
      placeholderId,
      placeholderY,
      placeholderHeight,
      placeholderMaxWidth,
    };
  },
});
</script>

<style scoped>
.placeholder {
  height: 100%;
  width: 100%;
  background-color: red;
  opacity: 0.2;
}
</style>
