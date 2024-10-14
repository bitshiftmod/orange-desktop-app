import { useEffect, useState } from "react";
import Row from "../components/Row";
import { useGlobalState } from "../store/store";
import FormRow from "../components/FormRow";

const Node = () => {
  const nodeConfig = useGlobalState((state) => state.nodeConfig);
  const setNodeConfig = useGlobalState((state) => state.setNodeConfig);

  const [token, setToken] = useState<string>("");
  const [port, setPort] = useState<number>(8080);

  useEffect(() => {
    if (nodeConfig) {
      setToken(nodeConfig.token);
      setPort(nodeConfig.port);
    }
  }, [nodeConfig]);

  const modified = token !== nodeConfig?.token || port !== nodeConfig?.port;

  return (
    <div className="size-full flex flex-col p-6">
      <div className="flex items-center">
        <div className="flex justify-center w-full items-center font-bold text-lg">
          <img src="algorand_logo_mark_black.svg" className="size-12" />
          Node Settings
        </div>
      </div>

      <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4">
        {nodeConfig ? (
          <>
            <FormRow
              label="Token:"
              inputElement={
                <input
                  className="bg-orange-100 w-full rounded border border-orange-200 focus:border-orange-500 focus:outline-none"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              }
            />
            <Row label="Server:" value="http://localhost" />
            <FormRow
              label="Port:"
              inputElement={
                <input
                  type="number"
                  className="bg-orange-100 w-full rounded border border-orange-200 focus:border-orange-500 focus:outline-none"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                />
              }
            />

            <div className="flex justify-center mt-4">
              <button
                disabled={!modified}
                className="bg-orange-500 text-white rounded px-4 py-1 disabled:bg-orange-500/50"
                onClick={() => {
                  setNodeConfig({ token, port, url: "http://localhost" });
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};
export default Node;