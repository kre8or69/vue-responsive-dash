import DashItem from "./DashItem.vue";
import DashLayout from "./DashLayout.vue";
import Dashboard from "./Dashboard.vue";

const VueResponsiveDash = {
  DashItem,
  DashLayout,
  Dashboard,
};

// Declare install function executed by createApp()
export function install(appInstance) {
  if (install.installed) return;
  install.installed = true;
  Object.keys(VueResponsiveDash).forEach((name) => {
    appInstance.component(name, VueResponsiveDash[name]);
  });
}

export default VueResponsiveDash;
export { DashItem, DashLayout, Dashboard };
