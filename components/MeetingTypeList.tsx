"use client";
import React, { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { toast, useToast } from "@/hooks/use-toast"


const MeetingTypeList = () => {
     const router = useRouter();

     const [meetingState, setMeetingState] = useState<'isInstantMeeting' | 'isJoiningMeeting' | 'isScheduleMeeting' | undefined>(undefined);
     const [values, setValues] = useState({
          dateTime: new Date(),
          description: '',
          link: ''
     })


     const { user } = useUser();
     const client = useStreamVideoClient();

     const [callDetails, setCallDetails] = useState<Call>();

     const createMeeting = async () => {
          if (!client || !user) return;
          try {
               if(!values.dateTime ){
                    toast({title: "Please select a date and time, in order to schedule a meeting"});
                    return;
               }
               const id = crypto.randomUUID();
               const call = client.call('default', id);

               if (!call) throw new Error("Failed to create a call!");

               const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
               const description = values.description || 'Instant Meeting';

               await call.getOrCreate({
                    data: {
                         starts_at: startsAt,
                         custom: {
                              description
                         }
                    }
               })

               setCallDetails(call);

               if (!values.description) {
                    router.push(`/meeting/${call.id}`)
               }

               console.log(call);
               toast({title: "Meeting Created! Share the link in order to let other join you"})
          } catch (error) {
               toast({
                    title: "Failed to create a meeting!"
               })
               console.log(error);
          }
     }

     return (
          <section className='grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4 px-4'>
               <HomeCard
                    img="/icons/add-meeting.svg"
                    title="Instant Meeting"
                    description="Start an instant meeting now "
                    handleClick={() => setMeetingState('isInstantMeeting')}
                    className="bg-orange-1 hover:bg-orange-500"
               />
               <HomeCard
                    img="/icons/schedule.svg"
                    title="Schedule Meeting"
                    description="Plan and schedule your meeting"
                    handleClick={() => setMeetingState('isScheduleMeeting')}
                    className="bg-blue-1 hover:bg-blue-950"
               />
               <HomeCard
                    img="/icons/recordings.svg"
                    title="View Recording"
                    description="Check out your recorded meetings"
                    handleClick={() => router.push("/recordings")}
                    className="bg-purple-1 hover:bg-purple-900"
               />
               <HomeCard
                    img="/icons/join-meeting.svg"
                    title="Join Meeting"
                    description="Join a meeting via an invitation link"
                    handleClick={() => setMeetingState('isJoiningMeeting')}
                    className="bg-yellow-1 hover:bg-yellow-500"
               />

               <MeetingModal isOpen={meetingState === 'isInstantMeeting'} onClose={() => setMeetingState(undefined)} title="Start an instant meeting" buttonText="Start Meeting" className="text-center" handleClick={createMeeting} />
          </section>

     );
};

export default MeetingTypeList;
