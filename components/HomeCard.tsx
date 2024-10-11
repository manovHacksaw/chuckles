import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface HomeCardProps {
  className: string;
  img: string;
  title: string;
  description: string;
  handleClick: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
  return (
    <div className={cn(`relative rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-[1.025] hover:shadow-lg`, className)} onClick={handleClick}>
      <div className={`px-4 py-6  flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`}>
        <div className='flex-center glassmorphism size-12 rounded-[10px]'>
          <Image src={img} alt='meeting' width={27} height={27} />
        </div>
        <div className='mt-4'>
          <div className='text-2xl font-bold'>{title}</div>
          <p className='text-sm text-gray-400'>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
