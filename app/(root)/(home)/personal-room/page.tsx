"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from 'react';

const Table = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className='flex flex-col items-start gap-2 xl:flex-row'>
      <h1 className='text-base font-medium text-sky-1 lg:text-xl xl:min-w-32'>{title}:</h1>
      <h2 className='truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl'>{description}</h2>
    </div>
  );
};

const PersonalRoom = () => {
  const { user } = useUser();
  const { call } = useGetCallById(user?.id);
  const client = useStreamVideoClient();
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${user?.id}?personal=true`;
  const router = useRouter();

  const startRoom = async () => {
    if (!client || !user) {
      toast({ title: "Unable to start the room. Try again later." });
      return;
    }

    try {
      if (!call) {
        const newCall = client.call('default', user?.id);
        await newCall.getOrCreate({
          data: {
            starts_at: new Date().toISOString(),
          },
        });
      }
      // Redirect to the meeting page after creating the call
      router.push(`/meeting/${user?.id}?personal=true`);
    } catch (error) {
      toast({ title: "Failed to start the room. Please try again." });
      console.error(error);
    }
  };

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className="text-3xl font-bold">Personal Room</h1>
      <div className="flex w-full flex-col gap-8 max-w-[900px]">
        <Table title='Topic' description={`${user?.username}'s Meeting Room`} />
        <Table title='Meeting ID: ' description={`${user?.id}`} />
        <Table title='Invite Link: ' description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>Start Meeting</Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
