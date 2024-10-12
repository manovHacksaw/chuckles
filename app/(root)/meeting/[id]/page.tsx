"use client";
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react';
import Loader from '@/components/Loader';

const Meeting = ({ params }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser();
  const [isSetUpComplete, setIsSetUpComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(params.id); // Ensure to access params.id

  if (isCallLoading && !isLoaded) {
    return <Loader />; // Show loader while fetching call data
  }

  if (!call) {
    return <div>No call found.</div>; // Handle case where no call is found
  }

  return (
    <main>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetUpComplete ? (
            <MeetingSetup setIsSetUpComplete={setIsSetUpComplete}  />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
