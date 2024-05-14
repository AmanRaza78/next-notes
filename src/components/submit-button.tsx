"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>Please Wait</Button>
      ) : (
        <Button type="submit">Update</Button>
      )}
    </>
  );
};

export default SubmitButton;
