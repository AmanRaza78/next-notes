import Link from "next/link";
import { Home, Menu, Settings, CreditCard} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/submit-button";
import { redirect } from "next/navigation";


export default async function NewNote() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  async function postData(formdData:FormData){
    "use server"
    const title = formdData.get('title') as string
    const description = formdData.get('description') as string

    await prisma.note.create({
        data:{
            userId:user?.id,
            title:title,
            description:description
        }
    })

    return redirect('/dashboard')
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/setting/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard/"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/setting/"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Create Notes</h1>
          </div>
          <div
            className="flex flex-col flex-1 rounded-lg border border-dashed shadow-sm p-6 gap-y-6"
            x-chunk="dashboard-02-chunk-1"
          >
            <Card>
              <form action={postData}>
                <CardHeader>
                  <CardTitle>New Note</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-3">
                  <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      required
                      type="text"
                      name="title"
                      id="title"
                      placeholder="Title of your note"
                    />
                  </div>

                  <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      required
                      name="description"
                      id="description"
                      placeholder="Description of your note"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/dashboard">
                        <Button variant="destructive">Cancel</Button>
                    </Link>
                    <SubmitButton/>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
