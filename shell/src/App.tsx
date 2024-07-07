import { init, loadRemote } from "@module-federation/enhanced/runtime";
import { lazy } from "react";
import Shell from "./Shell";

const App = () => {
  init({
    name: "shell",
    remotes: [
      {
        name: "remote_demo",
        entry: "http://localhost:3002/mf-manifest.json",
      }
    ],

    shared: {
      react: {
        version: "18.3.1",
        scope: "default",
        // lib: () => React,
        shareConfig: {
          singleton: true,
          requiredVersion: "18.3.1",
        },
      },
      "react-dom": {
        version: "18.3.1",
        scope: "default",
        // lib: () => ReactDOM,
        shareConfig: {
          singleton: true,
          requiredVersion: "18.3.1",
        },
      },
      "@mantine/core": {
        version: "7.11.1",
        scope: "default",

        shareConfig: {
          singleton: true,
          requiredVersion: "7.11.1",
        },
      },
      "@mantine/hooks": {
        version: "7.11.1",
        scope: "default",
        shareConfig: {
          singleton: true,
          requiredVersion: "7.11.1",
        },
      },
    },
  });

  return (
    <div className="content">
      <Shell />
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
    </div>
  );
};

export default App;
