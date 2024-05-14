import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SubmitButton from "./submit-button";
import { revalidatePath } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      colorScheme: true,
    },
  });

  return data;
}

export default async function CardWithForm() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function updateData(formData: FormData) {
    "use server";
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const color = formData.get("color") as string;

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        firstName: firstname ?? undefined,
        lastName: lastname ?? undefined,
        colorScheme: color ?? undefined,
      },
    });
    revalidatePath('/', 'layout')
  }

  return (
    <Card className="w-[650px] h-fit">
      <CardHeader>
        <CardTitle>User Profile Setting</CardTitle>
        <CardDescription>Change Color Theme and Name</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateData}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                placeholder="Your First name"
                name="firstname"
                type="text"
                defaultValue={data?.firstName ?? ""}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                placeholder="Your Last Name"
                name="lastname"
                type="text"
                defaultValue={data?.lastName ?? ""}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Your Email"
                name="email"
                type="email"
                defaultValue={data?.email ?? ""}
                disabled
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <Select name="color" defaultValue={data?.colorScheme}>
                <SelectTrigger className="w-full" id="color">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Color</SelectLabel>
                    <SelectItem value="theme-green">Green</SelectItem>
                    <SelectItem value="theme-blue">Blue</SelectItem>
                    <SelectItem value="theme-violet">Violet</SelectItem>
                    <SelectItem value="theme-yellow">Yellow</SelectItem>
                    <SelectItem value="theme-orange">Orange</SelectItem>
                    <SelectItem value="theme-red">Red</SelectItem>
                    <SelectItem value="theme-rose">Rose</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col my-4">
            <SubmitButton/>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
