import Link from "next/link";
import {
  Home,
  Menu,
  Settings,
  CreditCard,
  File,
  Edit,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.note.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function deleteNote(formData:FormData){
    "use server"
    const noteId = formData.get('noteId') as string

    await prisma.note.delete({
      where:{
        id:noteId
      }
    })
    revalidatePath('/dashboard')
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
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <div
            className="flex flex-col flex-1 rounded-lg border border-dashed shadow-sm p-6 gap-y-6"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-3xl">Your Notes</h1>
              <Link href="/newNote">
                <Button>Create Notes</Button>
              </Link>
            </div>
            <div>
              <p className="text-muted">
                Here you can see and create your notes
              </p>
            </div>

            {data.length < 1 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center gap-y-2">
                <div>
                  <File className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold">
                  You do not have any notes created yet
                </h3>
              </div>
            ) : (
              <div className="flex flex-col gap-y-4">
                {data.map((item) => (
                  <Card
                    key={item.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <h2 className="font-semibold text-xl text-primary">
                        {item.title}
                      </h2>
                      <p>
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "full",
                        }).format(new Date(item.createdAt))}
                      </p>
                    </div>

                    <div className="flex gap-x-4">
                      <Link href={`/newNote/${item.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>

                      <form action={deleteNote}>
                        <input type="hidden" name="noteId" value={item.id}/>
                        <Button variant="destructive" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
