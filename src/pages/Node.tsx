import { useEffect, useState } from "react";
import FormRow from "../components/FormRow";
import { isOnBlacklist } from "../lib/utils";
import { useGlobalState } from "../store/store";

const Node = () => {
  const nodeConfig = useGlobalState((state) => state.nodeConfig);
  const setNodeConfig = useGlobalState((state) => state.setNodeConfig);

  const [token, setToken] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [port, setPort] = useState<number>(8080);

  useEffect(() => {
    if (nodeConfig) {
      setToken(nodeConfig.token);
      setUrl(nodeConfig.url);
      setPort(nodeConfig.port);
    }
  }, [nodeConfig]);

  const modified =
    token !== nodeConfig?.token ||
    url != nodeConfig?.url ||
    port !== nodeConfig?.port;

  const blacklisted = isOnBlacklist(url);

  return (
    <div className="size-full flex flex-col p-6">
      <div className="flex items-center">
        <div className="flex justify-center w-full items-center font-bold text-lg">
          <img src="algorand_logo_mark_black.svg" className="size-12" />
          Node Settings
        </div>
      </div>

      <div className="rounded text-base mt-4 flex flex-col gap-2 bg-orange-200 p-4 text-sm">
        {nodeConfig ? (
          <>
            <FormRow
              label="Token:"
              inputElement={
                <input
                  className="bg-orange-100 w-full rounded border border-orange-200 focus:border-orange-500 focus:outline-none p-1"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              }
            />

            <FormRow
              label="Server:"
              inputElement={
                <input
                  className="bg-orange-100 w-full rounded border border-orange-200 focus:border-orange-500 focus:outline-none p-1"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              }
            />
            <FormRow
              label="Port:"
              inputElement={
                <input
                  type="number"
                  className="bg-orange-100 w-full rounded border border-orange-200 focus:border-orange-500 focus:outline-none p-1"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                />
              }
            />
            {blacklisted && (
              <div className="text-red-500 text-xs">
                Free APIs are not allowed to be used with this application. Please use your own node. 
              </div>
            )}

            <div className="flex justify-center mt-4 gap-4">
              <button
                disabled={!modified || blacklisted}
                className="bg-orange-500 text-white rounded px-4 py-1 disabled:bg-orange-500/50"
                onClick={() => {
                  setNodeConfig({ token, port, url });
                }}
              >
                Save
              </button>

              <button
                disabled={!modified || blacklisted}
                className="bg-orange-500 text-white rounded px-4 py-1 disabled:bg-orange-500/50"
                onClick={() => {
                  setToken(nodeConfig.token);
                  setUrl(nodeConfig.url);
                  setPort(nodeConfig.port);
                }}
              >
                Reset 
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
