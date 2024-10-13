"use client"

import { CallControls, DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

const MeetingSetup = ({ setIsSetUpComplete }: { setIsSetUpComplete: (value: boolean) => void }) => {
     const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
     const call = useCall();

     if (!call) {
          throw new Error("Use call must be used with Stream Call Component");
     }

     useEffect(() => {
          if (isMicCamToggledOn) {
               call.camera.disable();
               call.microphone.disable();
          } else {
               call.camera.enable();
               call.microphone.enable();
          }
     }, [isMicCamToggledOn, call]);

     return (
          <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-b text-white p-5'>
               <h1 className='text-3xl font-bold mb-4 shadow-md'>Setup Your Meeting</h1>
               <VideoPreview className='rounded-lg shadow-lg border-2 border-white' />
               <div className='flex items-center justify-center mt-5 p-3 bg-white/10 rounded-lg shadow-lg'>
                    <label className='flex items-center gap-2 font-medium text-white'>
                         <input
                              type="checkbox"
                              checked={isMicCamToggledOn}
                              onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
                              className='cursor-pointer'
                         />
                         <span className='text-lg text-center'>Join with mic and camera off</span>

                    </label>
                    <DeviceSettings />
               </div>
               <Button className='rounded-md bg-green-500 px-4 py-2.5' onClick={() => { call.join(); setIsSetUpComplete(true) }}> Join the Meeting </Button>
              
          </div >
     );
}

export default MeetingSetup;
