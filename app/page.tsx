'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, Camera, Gift, Star, Cake, Music, Volume2, VolumeX } from 'lucide-react';

// Componenta pentru efectul de particule subtile
const ParticleEffect: React.FC = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const pieces = [];
    for (let i = 0; i < 30; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
        size: 2 + Math.random() * 3,
      });
    }
    setParticles(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-30 animate-float"
          style={{
            left: `${particle.left}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh) translateX(30px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

// Hook pentru detectarea scroll
const useScrollAnimation = (threshold: number = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return [elementRef, isVisible];
};

// Componenta pentru butonul de muzică
const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Creăm un AudioContext pentru a reda un ton plăcut (optional - pentru demo)
    // În producție, ai folosi un fișier audio real
    audioRef.current = new Audio();
    audioRef.current.src = '/muzica.mp3';
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={toggleMusic}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative"
      >
        {/* Glow effect */}
        <div className={`absolute -inset-4 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-xl transition-opacity duration-500 ${
          isPlaying ? 'opacity-60 animate-pulse' : 'opacity-30'
        }`}></div>
        
        {/* Button principal */}
        <div className={`relative w-16 h-16 rounded-full backdrop-blur-2xl bg-linear-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center transform transition-all duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        } ${isPlaying ? 'shadow-2xl shadow-purple-500/50' : 'shadow-xl'}`}>
          {isPlaying ? (
            <Volume2 className="w-7 h-7 text-white animate-pulse" />
          ) : (
            <VolumeX className="w-7 h-7 text-white/80" />
          )}
        </div>

        {/* Label tooltip */}
        <div className={`absolute bottom-full right-0 mb-2 px-4 py-2 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <p className="text-sm text-white font-light">
            {isPlaying ? 'Oprește Muzica' : 'Pornește Muzica'}
          </p>
          <Music className="w-4 h-4 text-pink-400 absolute -bottom-1 right-4" />
        </div>

        {/* Animated rings când cântă */}
        {isPlaying && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-pink-400/50 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/50 animate-ping" style={{ animationDelay: '0.3s' }}></div>
          </>
        )}
      </button>

    
    </div>
  );
};

// Componenta pentru cardul de felicitare
const BirthdayCard: React.FC = () => {
  const [titleRef, titleVisible] = useScrollAnimation(0.2);
  const [messageRef, messageVisible] = useScrollAnimation(0.2);
  const [photosRef, photosVisible] = useScrollAnimation(0.2);
  const [signatureRef, signatureVisible] = useScrollAnimation(0.2);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  type CardData = {
    num: number;
    gradient: string;
    accent: 'purple' | 'pink' | 'blue';
    rotation: string;
  };

  const cards: CardData[] = [
    { num: 1, gradient: 'from-purple-500/20 via-pink-500/20 to-purple-500/20', accent: 'purple', rotation: '-rotate-1'  },
    { num: 2, gradient: 'from-pink-500/20 via-blue-500/20 to-pink-500/20', accent: 'pink', rotation: 'rotate-1' },
    { num: 4, gradient: 'from-blue-500/20 via-purple-500/20 to-blue-500/20', accent: 'blue', rotation: '-rotate-1' },
    { num: 5, gradient: 'from-blue-500/20 via-purple-500/20 to-blue-500/20', accent: 'blue', rotation: '-rotate-1' }
  ];

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      {/* Hero Section ultra-modern cu floating elements */}
      <div
        ref={titleRef}
        className={`text-center mb-32 transition-all duration-1000 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
        }}
      >
        <div className="relative inline-block mb-8">
          {/* Multiple glow layers */}
          <div className="absolute -inset-8 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -inset-4 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-4 relative tracking-tight">
            <span className="relative bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              La Mulți Ani
            </span>
          </h1>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-12 tracking-tight">
          Varu Barbu
        </h2>
        
        <div className="inline-flex items-center gap-6 px-10 py-5 bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
          <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="text-2xl text-white font-light tracking-wide">17 Ani ba nebunule</span>
          <Cake className="w-8 h-8 text-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Decorative floating icons */}
        <div className="absolute -left-20 top-20 opacity-20">
          <Star className="w-12 h-12 text-yellow-400 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute -right-20 top-40 opacity-20">
          <Gift className="w-12 h-12 text-purple-400 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* Mesaj cu card modern 3D enhanced */}
      <div
        ref={messageRef}
        className={`mb-32 transition-all duration-1000 delay-200 ${
          messageVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        }`}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative backdrop-blur-2xl bg-linear-to-br from-white/10 to-white/5 rounded-3xl p-10 md:p-16 border border-white/20 shadow-2xl overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-linear-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-pink-500/50 to-transparent"></div>
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
                  <Star className="w-10 h-10 text-yellow-400 relative" fill="currentColor" />
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-pink-500/50 to-transparent"></div>
              </div>
              
              <p className="text-2xl md:text-3xl text-white leading-relaxed text-center font-light mb-8">
                Astăzi împlinești <span className="font-bold text-transparent bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text">17 ani</span> și vreau să știi cât de special ești.
                Fiecare moment petrecut alături de tine este o amintire de neuitat.
              </p>
              
              <div className="mt-10 pt-10 border-t border-white/10">
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed text-center font-light">
                  Îți urez un an plin de realizări, aventuri și momente care să-ți aducă zâmbetul pe buze.
                  <span className="flex items-center justify-center gap-3 mt-6 text-transparent bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold text-2xl">
                    Meriti tot ce e mai bun! 
                    <Gift className="w-7 h-7 text-purple-400" />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Galerie cu carduri premium 3D enhanced */}
      <div
        ref={photosRef}
        className={`mb-32 transition-all duration-1000 delay-400 ${
          photosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Amintiri de Neuitat
          </h2>
          <p className="text-xl text-white/60 font-light">Momente speciale împreună</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={card.num}
              className={`group transition-all duration-700 ${card.rotation} hover:rotate-0 ${
                photosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(card.num)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative">
                {/* Enhanced glow effect */}
                <div className={`absolute -inset-2 bg-linear-to-r ${card.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-70 transition duration-700`}></div>
                
                {/* Card principal cu depth */}
                <div className="relative backdrop-blur-2xl bg-linear-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 overflow-hidden transform group-hover:-translate-y-3 group-hover:scale-[1.03] transition-all duration-500 shadow-2xl group-hover:shadow-purple-500/50">
                  {/* Header cu număr enhanced */}
                  <div className="relative h-16 bg-linear-to-r from-white/5 to-white/10 border-b border-white/10 flex items-center px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${card.accent}-400 animate-pulse shadow-lg shadow-${card.accent}-400/50`}></div>
                      <span className="text-white/60 font-light text-sm tracking-widest">Amintiri frumoase</span>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-green-400/50 transition-colors"></div>
                      <div className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-yellow-400/50 transition-colors"></div>
                      <div className="w-3 h-3 rounded-full bg-white/20 group-hover:bg-red-400/50 transition-colors"></div>
                    </div>
                  </div>

                  {/* Zona imaginii enhanced */}
                  <div className="relative w-full max-w-130 mx-auto  h-120 bg-linear-to-br from-slate-900/50 to-slate-800/50 flex flex-col items-center justify-center overflow-hidden" style={{
                            backgroundImage: `url('/barbu${card.num}.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}>
                    {/* Animated grid pattern */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0) ',
                      backgroundSize: '32px 32px'
                    }}></div>
                    
                    {/* Gradient overlay animat */}
                    <div className={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                    
                    {/* Conținut */}
                    <div className="relative z-10 text-center transform group-hover:scale-110 transition-transform duration-500">
                      <div className="mb-8 transform group-hover:rotate-12 transition-transform duration-500 filter drop-shadow-2xl">
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                          <Camera className="w-28 h-28 text-white/70 mx-auto group-hover:text-white transition-colors duration-500 relative" strokeWidth={0.2} />
                        </div>
                      </div>
                    
                     
                    </div>

                    {/* Enhanced corner accents */}
                    <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
                    <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
                    <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
                    <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
                  </div>

                  {/* Footer cu progress bar enhanced */}
                  <div className="relative h-2 bg-linear-to-r from-slate-900/50 to-slate-800/50 overflow-hidden">
                    <div className={`absolute inset-0 bg-linear-to-r ${card.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 shadow-lg`}></div>
                  </div>
                </div>
              </div>

              {/* Enhanced hover text */}
              <div className={`text-center mt-4 transition-all duration-300 ${hoveredCard === card.num ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <p className="text-white/60 text-sm font-light flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4" />
                  Click pentru a vizualiza
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semnătură ultra-elegantă enhanced */}
      <div
        ref={signatureRef}
        className={`text-center transition-all duration-1000 delay-600 ${
          signatureVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        }`}
      >
        <div className="relative group max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-linear-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000 animate-pulse"></div>
          <div className="relative backdrop-blur-2xl bg-linear-to-br from-white/5 to-white/10 rounded-3xl p-12 md:p-16 border border-white/20 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
                <Heart className="w-12 h-12 text-pink-400 animate-pulse" fill="currentColor" />
              </div>
              <p className="text-2xl text-white/70 font-light mb-6 tracking-wide">Iti doresc tot binele din lume,varule</p>
              <p className="text-5xl md:text-6xl font-bold bg-linear-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
                Semnat Varu Tau
              </p>
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
                <div className='text-gray-300'>Sa revii si tu pe picioare sa te faci tank ca inainte</div>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagina Principală
export default function BirthdayPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="fixed inset-0 bg-from-purple-900/20 via-slate-900 to-slate-900"></div>
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      ></div>
      
      <ParticleEffect />
      <MusicPlayer />
      
      <div className="relative z-10 py-20 px-4">
        <BirthdayCard />
      </div>

      {/* Enhanced ambient lighting effects */}
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none animate-pulse"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}