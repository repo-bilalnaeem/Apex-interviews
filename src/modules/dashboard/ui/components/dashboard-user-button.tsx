import GeneratedAvatar from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ChevronDownIcon,
  SettingsIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const DasboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger
          asChild
          className="rounded-xl border border-[#2A2A2A] p-3 w-full flex items-center justify-between bg-[#141414] hover:bg-[#1A1A1A] overflow-hidden gap-x-2 transition-colors duration-150"
        >
          <div>
            {data.user.image ? (
              <Avatar>
                <AvatarImage src={data.user.image} />
              </Avatar>
            ) : (
              <GeneratedAvatar
                seed={data.user.name}
                variant="initials"
                className="size-9 mr-3"
              />
            )}

            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
              <p>{data.user.name}</p>
              <p className="text-xs truncate w-full">{data?.user.email}</p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0" />
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" asChild>
              <Link href="/settings">
                <SettingsIcon className="size-4 text-black" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" onClick={() => {}}>
              <CreditCardIcon className="size-4 text-black" />
              Billing
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOutIcon className="size-4 text-black" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-xl border border-[#2A2A2A] p-3 w-full flex items-center justify-between bg-[#141414] hover:bg-[#1A1A1A] overflow-hidden gap-x-2 transition-colors duration-150 settings-btn">
        {data?.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-9 mr-3"
          />
        )}

        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p>{data?.user.name}</p>
          <p className="text-xs truncate w-full">{data?.user.email}</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72 bg-[#141414] border border-[#2A2A2A] text-[#F5F5F5]">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data?.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings" className="flex items-center justify-between w-full">
            Settings
            <SettingsIcon className="size-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between"
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DasboardUserButton;
