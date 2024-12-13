"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import {  useRouter } from "next/navigation";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");
    if (!username || !email || !password || !confirmpassword) {
      setMsg("All fields are required");
      return;
    }
    if (password !== confirmpassword) {
      setMsg("Passwords do not match");
      return;
    } 
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname,
            username,
            email,
            password,
          }),
        });

        if(response){
          router.push("/sign-in");
        }

        const data = await response.json();
        setMsg(data.message);
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong!");
        }
      } catch (error) {
        console.log(error);
      }
    
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
               Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form onSubmit={handleSignUp}>
                  <div className="grid gap-2 mb-2">
                    <Label htmlFor="fullname">Name</Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="Enter Full Name"
                      onChange={(e) => setFullname(e.target.value)}
                      required
                    />
                  </div>
                <div className="grid gap-2 mb-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter Username"
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      required
                    />
                  </div>
                <div className="grid gap-2 mb-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2 mb-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 mb-2">
                  <Label htmlFor="confirmpassword">Confirm Password</Label>
                  <Input
                    id="confirmpassword"
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {msg && <div className="text-red-500">{msg}</div>}

                <Button type="submit" className="w-full">
                  Create an account
                </Button>
              </form>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("google", { callbackUrl: "/questionset" })}
              >
                Sign up with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpForm;