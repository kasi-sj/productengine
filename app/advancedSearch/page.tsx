'use client'
import { useConfigurationStore } from "@/utils/store";


export default function Home() {
  const Configuration = useConfigurationStore((state) => state.configuration);
  if (Configuration === undefined || Configuration === null) {
    return <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="">
          configuration not found
        </div>
      </main>
    </>
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        advanced search
        {JSON.stringify(Configuration)}
      </div>
    </main>
  );
}
