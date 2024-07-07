import { loadRemote } from "@module-federation/enhanced/runtime";
import { lazy, Suspense } from "react";

const Shell = () => {
  const Example = lazy(() =>
    loadRemote("remote_demo/Example").then((module) => module)
  );
  return (
    <div className="content">
      <Suspense fallback="Loading...">
        <Example />
      </Suspense>
    </div>
  );
};

export default Shell;
