import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";
import { useConfigurationStore } from "@/utils/store";
import { useRouter } from "next/navigation";

export function MenubarComponent() {
  const Configuration = useConfigurationStore((state) => state.configuration);
  const setConfiguration = useConfigurationStore(
    (state) => state.setConfiguration
  );

  const router = useRouter();
  // if (Configuration == null || Configuration == undefined) {
  //   router.push("/setUp");
  // }
  return (
    <Menubar className="text-black p-4 px-8 py-8 mt-2 border-none ">
      <div className="flex w-full">
        <img
          src="/pe-removebg-preview.png"
          alt="logo"
          className="w-16 -mt-1 h-10"
        />
        <div className="text-2xl font-semibold">Product Engine</div>
      </div>
      <div className="flex justify-end w-full">
        {Configuration && (
          <MenubarMenu>
            <MenubarTrigger className="gap-2">
              <Link href={"/search"}>
                <div className="text-md">search</div>
              </Link>
            </MenubarTrigger>
          </MenubarMenu>
        )}
        <MenubarMenu>
          <MenubarTrigger className="gap-2">
            <Link href={"/setUp"}>
              <div className="text-md">set up</div>
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <Link href={"/setUp"}>
            <MenubarTrigger className="gap-2">
              <>Help</>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
              </span>
            </MenubarTrigger>
          </Link>
        </MenubarMenu>
        {Configuration && (
          <MenubarMenu>
            <button
              onClick={() => setConfiguration(null)}
              className="text-md ml-2"
            >
              exit
            </button>
          </MenubarMenu>
        )}
      </div>
    </Menubar>
  );
}
