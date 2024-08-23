'use client'
import { useConfigurationStore } from "@/utils/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const Configuration = useConfigurationStore((state) => state.configuration);
  if (Configuration !== undefined && Configuration !== null) {
    console.log(Configuration);
    router.push("/search");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        {JSON.stringify(Configuration)}
      </div>
    </main>
  );
}
