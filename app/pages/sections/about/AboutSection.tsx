import Image from 'next/image';

export default function AboutSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center h-full container mx-auto">
      <div className="relative w-full hidden md:flex md:h-full flex items-center justify-center">
        <div className="relative w-3/4 md:w-4/5 md:h-[60vh]">
          <Image
            src="/about.png"
            alt="About Image"
            fill
            className="object-scale-down md:object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center px-6 md:px-12 text-center md:text-left">
        <div className="max-w-1xl">
          <h1 className="mb-5 text-header-text text-4xl lg:text-6xl font-bold leading-tight">
            Find your Tugma, your perfect match.
          </h1>
          <h2 className="text-xl lg:text-2xl mb-5 primary-light">
            At Tugma, we believe love isn’t just about finding someone — it’s about finding your perfect match. We bring people together through genuine connections, meaningful conversations, and moments that just feel… tugma.
          </h2>
        </div>
      </div>
    </div>
  );
}
