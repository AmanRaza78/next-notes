import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  return (
    <nav
      className="border-b bg-background h-[10vh] flex items-center"
      aria-label="Global"
    >
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-3xl">Next Notes</h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <ModeToggle />

          {(await isAuthenticated()) ? (
            <LogoutLink>
              <Button>Logout</Button>
            </LogoutLink>
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Sign In</Button>
              </LoginLink>

              <RegisterLink>
                <Button variant="secondary">Sign Up</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
