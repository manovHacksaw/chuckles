"use client";
import { cn } from '@/lib/utils';
import { CallControls, CallingState, CallParticipantsList, CallState, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import {
     LayoutList,
     Users,
} from "lucide-react";

import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EndCallButton from './EndCallButton';
import Loader from './Loader';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';



const MeetingRoom = () => {
     const searchParams = useSearchParams();
     const isPersonalRoom = searchParams.get('personal');
     const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
     const [showParticipants, setShowParticipants] = useState(false);
     const router = useRouter();

     const {useCallCallingState} = useCallStateHooks();
     const callingState = useCallCallingState();

     if(callingState != CallingState.JOINED) return <Loader/>
     

     const CallLayout = () => {
          switch (layout) {
               case 'grid':
                    return <PaginatedGridLayout />;
               case 'speaker-right':
                    return <SpeakerLayout participantsBarPosition={'left'} />;
               default:
                    return <SpeakerLayout participantsBarPosition={'right'} />;
          }
     };

     return (
          <section className='relative h-screen w-full overflow-hidden pt-4 text-white bg-[#1a1d22]'>
               <div className="relative flex items-center justify-center">
                    <div className="flex max-w-[1000px] w-full">
                         <CallLayout />
                    </div>
                    <div
                         className={cn('h-[calc(100vh-86px)] hidden ml-2', {
                              'show-block': showParticipants,
                         })}
                    >
                         <CallParticipantsList onClose={() => setShowParticipants(false)} />
                    </div>
               </div>
               <div className="fixed bottom-0 flex justify-center gap-4 items-center w-full p-4 bg-[#19232d] border-t border-gray-700 shadow-lg flex-wrap">
                    <CallControls onLeave={() => router.push(`/`)} />
                    <div className="flex items-center flex-wrap" >
                         <DropdownMenu>
                              <DropdownMenuTrigger className="cursor-pointer rounded-full bg-[#2d3843] p-2 hover:bg-[#4c535b] transition duration-200 ease-in-out">
                                   <LayoutList size={24} className="text-white" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="border border-gray-700 bg-[#2d3843] text-white shadow-lg">
                                   {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                                        <React.Fragment key={index}>
                                             <DropdownMenuItem
                                                  onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                                                  className="hover:bg-[#4c535b] transition duration-200 ease-in-out"
                                             >
                                                  {item}
                                             </DropdownMenuItem>
                                             {index < 2 && <DropdownMenuSeparator className="border-gray-700" />}
                                        </React.Fragment>
                                   ))}
                              </DropdownMenuContent>
                         </DropdownMenu>
                         <CallStatsButton />
                         <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton/>}
                    </div>
               </div>
          </section>
     );
};

export default MeetingRoom;
