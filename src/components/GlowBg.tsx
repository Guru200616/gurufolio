import React from 'react';

export default function GlowBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[120px] dark:bg-blue-600/15" />
      <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[130px] dark:bg-purple-600/15" />
      <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-cyan-600/8 blur-[100px] dark:bg-cyan-600/12" />
    </div>
  );
}
