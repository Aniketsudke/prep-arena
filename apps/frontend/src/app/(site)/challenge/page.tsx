"use client";
import { Card } from "@/components/ui/card";
import React, { use, useEffect, useState } from "react";
import { TrendingUp, Link2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import InviteFriend from "@/components/challenge/inviteFriend";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";

interface BannerProps {
  user: {
    id: string;
    username?: string;
    createdAt?: Date;
    Role?: "ADMIN" | "USER" | "INSTRUCTOR";
    accessToken?: string;
  };
}



const ChallengePage = () => {
  return (
    <div className="min-h-screen bg text-white p-5">
      <div className="grid grid-cols-12 gap-1 md:gap-3">
        <div className="col-span-12 md:col-span-3">
          <Card className="p-2  md:p-4   space-y-6 rounded-lg">
            <UserProfile />
          </Card>
        </div>
        <div className="col-span-12 md:col-span-9 space-y-4">
          <Banner/>
          <Card className=" p-4 rounded-lg">
            <h2 className="text-xl font-semibold">Recent Challenges</h2>
            <div className="mt-2 text-gray-400">No recent challenges found.</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  return (
    <div className="   flex justify-between p-2 md:flex-col rounded-lg ">
      <div className="flex flex-row md:justify-between  ">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-base sm:text-lg font-semibold">Aniket Sudke</h2>
          <p className="text-gray-400 text-sm sm:text-base ">@aniketsudke</p>
        </div>
        <Link className="hidden" href={`/`}>
          <Link2 className="text-yellow-500 hover:text-yellow-400 md:mt-0.5 mt-1 size-4 md:size-7" />
        </Link>
      </div>
      <Separator className=" md:my-5 hidden " />
      <div className="mt-2  text-center ">
        <h3 className="text-lg sm:text-xl flex justify-center sm:justify-start">Rating</h3>
        <p className="text-2xl sm:text-4xl flex items-center justify-center sm:justify-start">
          1080{" "}
          <span className="items-center flex ml-2">
            <TrendingUp color="green" />
          </span>
        </p>
      </div>
    </div>
  );
};

const Banner = () => {
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const  socket = useSocket();
  console.log(socket);
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "CHALLENGE_ADD":
          setAdded(true);
          console.log("Challenge Added");
          break;
        case "CHALLENGE_INIT":
          console.log("Challenge Initialized");
          break;
        case "CHALLENGE_START":
          router.push(`/challenge/${message.payload.challengeId}`);
          console.log("Challenge Started");
          break;

      }
    };
  }, [socket]);
  return (
    <div className="relative bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 py-16 px-6 sm:px-12 md:px-24 lg:px-36 rounded-lg shadow-lg text-white text-center overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-lg"></div>
      <div className="relative z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 noselect">
          Join the Ultimate Challenge!
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-200 noselect">
          Challenge friends, compete for the top spot, and improve your rank.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button className="relative bg-yellow-700 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 overflow-hidden group" 
          onClick={
            () => {
              socket?.send(JSON.stringify({ type: "INIT_CHALLENGE" }));
            }
          }
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 transform -translate-x-full group-hover:translate-x-full"></span>
            <span className="relative z-10" >Join Challenge </span>
          </Button>
         <InviteFriend />
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;