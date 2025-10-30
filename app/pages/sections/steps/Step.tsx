import { Heart, MessageCircle, Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './style.css';

export default function Steps() {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [arrowPaths, setArrowPaths] = useState({ path1: '', path2: '' });

  useEffect(() => {
    const updateArrows = () => {
      if (!card1Ref.current || !card2Ref.current || !card3Ref.current || !containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const card1 = card1Ref.current.getBoundingClientRect();
      const card2 = card2Ref.current.getBoundingClientRect();
      const card3 = card3Ref.current.getBoundingClientRect();

      const x1 = card1.left - container.left;
      const y1 = card1.top + card1.height / 2 - container.top;

      const x2 = card2.left + card2.width / 2 - container.left;
      const y2 = card2.top - container.top;

      const midX1 = (x1 + x2) / 2;
      const midY1 = (y1 + y2) / 2;
      const controlX1 = midX1 - 250;
      const controlY1 = midY1;
      const path1 = `M ${x1} ${y1} Q ${controlX1} ${controlY1}, ${x2} ${y2}`;

      const x2Start = card2.left + card2.width / 2 - container.left;
      const y2Start = card2.bottom - container.top;

      const x3 = card3.left - container.left;
      const y3 = card3.top + card3.height / 2 - container.top;

      const midX2 = (x2Start + x3) / 2;
      const midY2 = (y2Start + y3) / 2;
      const controlX2 = midX2 + 100;
      const controlY2 = midY2 + 250;
      const path2 = `M ${x2Start} ${y2Start} Q ${controlX2} ${controlY2}, ${x3} ${y3}`;

      setArrowPaths({ path1, path2 });
    };

    updateArrows();
    window.addEventListener('resize', updateArrows);

    setTimeout(updateArrows, 100);

    return () => window.removeEventListener('resize', updateArrows);
  }, []);

  return (
    <div className="h-full px-2 lg:p-8 py-6">
      <div className="container items-center mx-auto">
        <div ref={containerRef} className="relative sm:px-0 md:px-12">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#9333ea" opacity="0.5" />
              </marker>
            </defs>
            {arrowPaths.path1 && (
              <path
                d={arrowPaths.path1}
                stroke="#9333ea"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8,8"
                opacity="0.5"
                markerEnd="url(#arrowhead)"
              />
            )}
            {arrowPaths.path2 && (
              <path
                d={arrowPaths.path2}
                stroke="#9333ea"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8,8"
                opacity="0.5"
                markerEnd="url(#arrowhead)"
              />
            )}
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            <h1 className="font-bold text-header-text text-4xl lg:text-6xl mb-0 lg:mb-16">
                How Will Love<br />Find Your Way?
            </h1>
            <div className="lg:col-start-2 lg:row-start-1">
              <div ref={card1Ref} className="w-xs md:w-sm right mt-0 lg:mt-5 ml-auto mr-auto bg-white rounded-3xl p-8 shadow-lg border-none hover:shadow-2xl transition-shadow border-1 hover:border-section-background">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-section-background rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white" fill="currentColor" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-primary text-center mb-4">
                  Choose Partner
                </h2>
                <p className="text-primary text-center leading-relaxed">
                  Set up your account, provide detailed information, and find a partner that matches your interests.
                </p>
              </div>
            </div>

            <div className="lg:col-start-1 lg:row-start-2">
              <div ref={card2Ref} className="test w-xs md:w-sm ml-auto mr-auto rounded-3xl p-8 shadow-lg border-none hover:shadow-2xl transition-shadow border-1 hover:border-header-text">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-header-text" fill="currentColor" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-primary text-center mb-4">
                  Send Message
                </h2>
                <p className="text-primary text-center leading-relaxed">
                  Once you get a match, dont be shy; its your time to shine. Get in touch for a fun conversation.
                </p>
              </div>
            </div>
            <div className="mt-auto max-w-md lg:col-start-1 row-end-6 lg:row-end-4">
              <p className="primary-light mb-4 leading-relaxed">
                Still confused? Dont worry; we have got your back. Check out our in-depth documentation – or simply get in touch with our support team for more help.
              </p>
              <button className="text-primary mt-auto font-semibold px-6 py-3 rounded-md bg-section-background inline-flex items-center gap-2 shadow-md">
                How It Works
                <span>→</span>
              </button>
            </div>
            <div className="lg:col-start-2 lg:row-start-3">
              <div
                ref={card3Ref}
                className="right w-xs md:w-sm mx-auto lg:mr-0 lg:ml-auto bg-white rounded-3xl p-8 shadow-lg border-none hover:shadow-2xl transition-shadow border-1 hover:border-section-background"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-section-background rounded-full flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-primary text-center mb-4">
                  Go On A Date
                </h2>
                <p className="text-primary text-center leading-relaxed">
                  After that, why not go on a date and build your relationship? If everything goes well, live happily ever after.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}