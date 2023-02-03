// import "@commercelayer/core-app-elements/style.css";
import "../../core-app-elements/src/styles/global.css"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "centered",
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
