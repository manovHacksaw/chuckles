import Image from 'next/image';
import React from 'react';

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <Image src="/icons/loading-circle.svg" alt='Loading' width={72} height={72} />
    </div>
  );
}

export default Loader;
