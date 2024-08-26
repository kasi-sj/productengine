"use client";
import { useConfigurationStore } from "@/utils/store";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const Configuration = useConfigurationStore((state) => state.configuration);
  router.push("/setUp");
  return <div>Hi i am Kishore and My Friend is Kasi</div>;
}
