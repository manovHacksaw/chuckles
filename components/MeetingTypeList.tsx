"use client";
import React, { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { toast } from "@/hooks/use-toast";
import { Textarea } from './ui/textarea';
import { Input } from "@/components/ui/input"
import ReactDatePicker from "react-datepicker"

const MeetingTypeList = () => {
     const router = useRouter();

     const [values, setValues] = useState({
          dateTime: new Date(),
          description: '',
          title: '',
          link: ''
     });

     const [meetingState, setMeetingState] = useState<'isInstantMeeting' | 'isJoiningMeeting' | 'isScheduleMeeting' | undefined>(undefined);

     const { user } = useUser();
     const client = useStreamVideoClient();

     const [callDetails, setCallDetails] = useState<Call>();

     const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

     const createMeeting = async () => {
          if (!client || !user) return;
          try {
               if (!values.dateTime) {
                    toast({ title: "Please select a date and time to schedule a meeting" });
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
               });

               setCallDetails(call);

               if (!values.description) {
                    router.push(`/meeting/${call.id}`);
               }

               toast({ title: "Meeting Created! Share the link to let others join you" });
          } catch (error) {
               toast({ title: "Failed to create a meeting!" });
               console.log(error);
          }
     };

     return (
          <section className='grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4 px-4'>
               <HomeCard
                    img="/icons/add-meeting.svg"
                    title="Instant Meeting"
                    description="Start an instant meeting now"
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

               {!callDetails ? (
                    <MeetingModal
                         isOpen={meetingState === 'isScheduleMeeting'}
                         onClose={() => setMeetingState(undefined)}
                         title="Create Meeting"
                         buttonText="Start Meeting"
                         className="text-center"
                         handleClick={createMeeting}
                    >
                         <div>
                              <label htmlFor="meeting-title" className="block text-sm font-medium text-sky-1">Meeting Title</label>
                              <input
                                   type="text"
                                   id="meeting-title"
                                   value={values.title}
                                   onChange={(e) => setValues({ ...values, title: e.target.value })}
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                   placeholder="Enter meeting title"
                              />
                         </div>
                         <div className="mt-4 flex flex-col gap-2.5">
                              <label htmlFor="meeting-description" className="block text-sm font-medium text-sky-1">Add a description</label>
                              <Textarea
                                   id="meeting-description"
                                   value={values.description}
                                   onChange={(e) => setValues({ ...values, description: e.target.value })}
                              />
                         </div>
                         <div className="mt-4 flex flex-col gap-2.5">
                              <label htmlFor="meeting-date" className="block text-sm font-medium text-sky-1">Select Date and Time</label>
                              <ReactDatePicker
                                   showTimeSelect
                                   timeFormat='HH:mm'
                                   timeIntervals={15}
                                   timeCaption='time'
                                   dateFormat={"MMMM d, yyyy h:mm aa"}
                                   selected={values.dateTime}
                                   onChange={(date) => setValues({ ...values, dateTime: date! })}
                              />
                         </div>
                    </MeetingModal>
               ) : (
                    <MeetingModal
                         isOpen={meetingState === 'isScheduleMeeting'}
                         onClose={() => setMeetingState(undefined)}
                         title="Meeting Created!"
                         buttonText="Copy Meeting Link"
                         buttonIcon='/icons/copy.svg'
                         image='/icons/checked.svg'
                         className="text-center"
                         handleClick={() => {
                              navigator.clipboard.writeText(meetingLink);
                              toast({ title: 'Link Copied' });
                         }}
                    />
               )}

               <MeetingModal
                    isOpen={meetingState === 'isInstantMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Start an instant meeting"
                    buttonText="Start Meeting"
                    className="text-center"
                    handleClick={createMeeting}
               />
               <MeetingModal
                    isOpen={meetingState === 'isJoiningMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Paste the link here"
                    buttonText="Join Meeting"
                    className="text-center"
                    handleClick={() => router.push(values.link)}
               >
                    <Input
                         placeholder='Enter meeting link'
                         className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0'
                         onChange={(e) => setValues({ ...values, link: e.target.value })}
                    />
               </MeetingModal>
          </section>
     );
};

export default MeetingTypeList;
