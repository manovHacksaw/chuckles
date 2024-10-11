"use client"
import MeetingTypeList from '@/components/MeetingTypeList';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Format time as HH:MM AM/PM
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })); // Format date
    };

    updateTimeAndDate(); 
    const intervalId = setInterval(updateTimeAndDate, 1000*60); 

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[350px] w-full rounded-[20px] bg-hero bg-cover bg-gray-800'>
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className='glassmorphism'>Upcoming Meeting at 12:30 PM</h2>
          <div className="flex flex-col gap-2">
            <h1 className='text-4xl font-extrabold lg:text-6xl'>{time}</h1>
            <p className='text-lg font-medium text-sky-1'>{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList/>
    </div>

    
  );
}

export default Home;
