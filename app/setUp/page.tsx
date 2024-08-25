"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurationStore } from "../../utils/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [partitionName, setPartitionName] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const Configuration = useConfigurationStore((state) => state.configuration);
  const setConfiguration = useConfigurationStore(
    (state) => state.setConfiguration
  );

  const handleSubmit = () => {
    const configuration = {
      partitionName,
      baseURL,
      username,
      password,
    };
    //@ts-ignore
    setConfiguration(configuration);
    console.log(configuration);
    router.push("/search");
  };

  return (
    <div className="w-screen h-screen  bg-black flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <Card className="p-6 w-[400px]">
          <CardHeader>
            <h2 className="text-xl font-semibold">Configuration</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Partition Name"
                value={partitionName}
                className="bg-white"
                onChange={(e) => setPartitionName(e.target.value)}
              />
              <Input
                placeholder="Base URL"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
              />
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="h-1" />
              <Button onClick={handleSubmit} className="bg-blue-500 text-white">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
