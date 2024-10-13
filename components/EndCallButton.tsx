"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
     const call = useCall();
     const router = useRouter();
     const { useLocalParticipant } = useCallStateHooks();
     const localParticipant = useLocalParticipant();

     if (!call)
          throw new Error(
               'useStreamCall must be used within a StreamCall component.',
          );

     const isMeetingOwner =
          localParticipant &&
          call.state.createdBy &&
          localParticipant.userId === call.state.createdBy.id;

     if (!isMeetingOwner) return null;

     const handleEndCall = async () => {
          if (confirm("Are you sure you want to end the meeting?")) {
               await call.endCall();
               router.push("/");
          }
     };

     return (
          <Button onClick={handleEndCall} className="bg-red-600 hover:bg-red-700 transition duration-300">
               End Meeting
          </Button>
     );
};

export default EndCallButton;
