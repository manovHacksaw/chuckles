"use client";
import { useGetCalls } from '@/hooks/useGetCalls';
import { CallRecording } from '@stream-io/node-sdk';
import { Call } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from '@/hooks/use-toast';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
     const { endedCalls, recordings: fetchedRecordings, upcomingCalls, isLoading } = useGetCalls();
     const [recordings, setRecordings] = useState<CallRecording[]>([]);
     const router = useRouter();
     const {toast} = useToast();

     // Memoizing calls based on the type
     const calls = useMemo(() => {
          switch (type) {
               case 'ended':
                    return endedCalls;
               case 'recordings':
                    return recordings;
               case 'upcoming':
                    return upcomingCalls;
               default:
                    return [];
          }
     }, [type, endedCalls, recordings, upcomingCalls]);

     // Memoizing no-calls message based on the type
     const noCallsMessage = useMemo(() => {
          switch (type) {
               case 'ended':
                    return 'No Previous Calls';
               case 'recordings':
                    return 'No Recorded Calls';
               case 'upcoming':
                    return 'There are no upcoming calls';
               default:
                    return '';
          }
     }, [type]);

     // Fetch call recordings when type is 'recordings'
     useEffect(() => {
          const fetchRecordings = async () => {
               try {
                    const callData = await Promise.all(fetchedRecordings.map((meeting) => meeting.queryRecordings()));
                    const recordingsList = callData
                         .filter(call => call.recordings.length > 0)
                         .flatMap(call => call.recordings);
                    setRecordings(recordingsList);
               } catch (error) {
                    toast({ title: "Failed to fetch recordings", description: "Please try again later." });
                    console.error("Error fetching recordings: ", error);
               }
          };

          if (type === 'recordings') {
               fetchRecordings();
          }
     }, [fetchedRecordings, type, toast]);

     if (isLoading) return <Loader />;

     return (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
               {calls && calls.length > 0 ? (
                    calls.map((meeting: Call | CallRecording) => (
                         <MeetingCard
                              key={(meeting as Call)?.id || (meeting as CallRecording).id}
                              icon={
                                   type === 'ended'
                                        ? '/icons/previous.svg'
                                        : type === 'upcoming'
                                             ? '/icons/upcoming.svg'
                                             : '/icons/recordings.svg'
                              }
                              title={
                                   (meeting as Call)?.state?.custom?.description ||
                                   (meeting as CallRecording)?.filename?.substring(0, 20) ||
                                   'No Description'
                              }
                              date={
                                   (meeting as Call)?.state?.startsAt?.toLocaleString() ||
                                   (meeting as CallRecording)?.start_time?.toLocaleString()
                              }
                              isPreviousMeeting={type === 'ended'}
                              link={
                                   type === 'recordings'
                                        ? (meeting as CallRecording).url
                                        : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                              }
                              buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                              buttonText={type === 'recordings' ? 'Play' : 'Start'}
                              handleClick={
                                   type === 'recordings'
                                        ? () => router.push(`${(meeting as CallRecording).url}`)
                                        : () => router.push(`/meeting/${(meeting as Call).id}`)
                              }
                         />
                    ))
               ) : (
                    <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
               )}
          </div>
     );
};

export default CallList;
