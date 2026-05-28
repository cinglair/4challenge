import type { Dificuldade } from "./Game";

function Meadow() {
  return (
    <svg
      viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ADE3F5" />
          <stop offset="100%" stopColor="#DFF4FF" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="810" fill="url(#mSky)" />

      {/* Sun */}
      <circle cx="200" cy="140" r="72" fill="#FFE566" opacity="0.25" />
      <circle cx="200" cy="140" r="54" fill="#FFE566" opacity="0.9" />

      {/* Clouds */}
      <g fill="white" opacity="0.88">
        <circle cx="460" cy="130" r="34" />
        <circle cx="500" cy="112" r="44" />
        <circle cx="548" cy="118" r="36" />
        <circle cx="588" cy="128" r="26" />
        <rect x="460" y="118" width="128" height="36" />
      </g>
      <g fill="white" opacity="0.78">
        <circle cx="930" cy="100" r="28" />
        <circle cx="968" cy="84" r="38" />
        <circle cx="1012" cy="90" r="30" />
        <circle cx="1046" cy="100" r="22" />
        <rect x="930" y="90" width="116" height="30" />
      </g>
      <g fill="white" opacity="0.72">
        <circle cx="1240" cy="165" r="24" />
        <circle cx="1274" cy="150" r="32" />
        <circle cx="1314" cy="157" r="26" />
        <rect x="1240" y="153" width="100" height="24" />
      </g>

      {/* Back hill */}
      <path d="M-50,680 Q360,520 720,555 Q1080,590 1490,680 L1490,810 L-50,810 Z" fill="#C5E8C0" />

      {/* Mid-left hill */}
      <path d="M-50,730 Q200,630 480,650 Q680,665 820,730 L820,810 L-50,810 Z" fill="#9DD495" />

      {/* Mid-right hill */}
      <path d="M680,760 Q920,650 1200,670 Q1360,680 1490,740 L1490,810 L680,810 Z" fill="#9DD495" />

      {/* Foreground */}
      <rect x="-50" y="760" width="1540" height="60" fill="#7CC870" />

      {/* Small trees (back) */}
      <g fill="#5A9E52">
        <polygon points="320,570 340,620 300,620" />
        <polygon points="320,600 348,640 292,640" />
        <polygon points="900,545 922,598 878,598" />
        <polygon points="900,578 928,620 872,620" />
        <polygon points="1100,558 1124,612 1076,612" />
        <polygon points="1100,592 1128,636 1072,636" />
      </g>

      {/* Flowers */}
      <g>
        {[60,150,280,420,580,720,860,1000,1140,1280,1390].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={770 + (i % 3) * 4} r={5 + (i % 3)} fill={["#FF9999","#FFD966","#FF99CC","#99CCFF"][i % 4]} opacity="0.9" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Ocean() {
  return (
    <svg
      viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="oSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8DCEE" />
          <stop offset="60%" stopColor="#DCF0FA" />
          <stop offset="100%" stopColor="#EEF8FF" />
        </linearGradient>
        <linearGradient id="oSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7AC7E0" />
          <stop offset="100%" stopColor="#4AABBF" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="810" fill="url(#oSky)" />

      {/* Sun (top right) */}
      <circle cx="1260" cy="130" r="80" fill="#FFF0A0" opacity="0.2" />
      <circle cx="1260" cy="130" r="58" fill="#FFE566" opacity="0.9" />

      {/* Clouds */}
      <g fill="white" opacity="0.90">
        <circle cx="300" cy="140" r="36" />
        <circle cx="344" cy="122" r="46" />
        <circle cx="396" cy="130" r="38" />
        <circle cx="436" cy="140" r="28" />
        <rect x="300" y="128" width="136" height="36" />
      </g>
      <g fill="white" opacity="0.75">
        <circle cx="760" cy="115" r="28" />
        <circle cx="796" cy="100" r="36" />
        <circle cx="838" cy="107" r="30" />
        <rect x="760" y="100" width="108" height="28" />
      </g>
      <g fill="white" opacity="0.68">
        <circle cx="1040" cy="160" r="24" />
        <circle cx="1072" cy="146" r="32" />
        <circle cx="1110" cy="153" r="26" />
        <rect x="1040" y="148" width="96" height="24" />
      </g>

      {/* Ocean */}
      <rect x="0" y="480" width="1440" height="330" fill="url(#oSea)" />

      {/* Horizon glow */}
      <rect x="0" y="472" width="1440" height="20" fill="#B3E8F5" opacity="0.6" />

      {/* Waves */}
      <path d="M0,520 C120,508 240,532 360,520 C480,508 600,532 720,520 C840,508 960,532 1080,520 C1200,508 1320,532 1440,520" fill="none" stroke="#A8D8E8" strokeWidth="3" opacity="0.7" />
      <path d="M0,560 C100,548 200,572 300,560 C400,548 500,572 600,560 C700,548 800,572 900,560 C1000,548 1100,572 1200,560 C1300,548 1380,566 1440,558" fill="none" stroke="#A8D8E8" strokeWidth="2.5" opacity="0.6" />
      <path d="M0,600 C90,590 180,610 270,600 C360,590 450,610 540,600 C630,590 720,610 810,600 C900,590 990,610 1080,600 C1170,590 1260,610 1350,600 C1400,595 1430,602 1440,598" fill="none" stroke="#A8D8E8" strokeWidth="2" opacity="0.5" />

      {/* Lighthouse */}
      <g transform="translate(180, 350)">
        {/* Tower */}
        <rect x="-12" y="0" width="24" height="120" fill="#F5E6D3" />
        <rect x="-16" y="0" width="32" height="8" fill="#E8D5C0" />
        {/* Stripes */}
        <rect x="-12" y="25" width="24" height="14" fill="#FFAAAA" opacity="0.7" />
        <rect x="-12" y="65" width="24" height="14" fill="#FFAAAA" opacity="0.7" />
        {/* Light housing */}
        <rect x="-16" y="-22" width="32" height="24" fill="#E8D5C0" />
        <rect x="-10" y="-18" width="20" height="16" fill="#FFFDE7" opacity="0.9" />
        {/* Roof */}
        <polygon points="0,-36 -20,-22 20,-22" fill="#B0BEC5" />
        {/* Base */}
        <rect x="-20" y="118" width="40" height="10" fill="#BCAAA4" />
      </g>

      {/* Sailboat */}
      <g transform="translate(780, 430)">
        <polygon points="0,-90 0,10 -50,10" fill="white" opacity="0.95" />
        <polygon points="0,-70 0,10 40,10" fill="#FFD5D5" opacity="0.9" />
        <rect x="-55" y="8" width="110" height="12" fill="#B97B6A" rx="4" />
        <rect x="-1" y="-95" width="3" height="110" fill="#C8A882" />
      </g>
    </svg>
  );
}

function Mountains() {
  return (
    <svg
      viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mtSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BEB5DC" />
          <stop offset="55%" stopColor="#E8C8D8" />
          <stop offset="100%" stopColor="#F8DEC0" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="810" fill="url(#mtSky)" />

      {/* Stars */}
      {[
        [80,60],[200,90],[340,45],[500,70],[680,40],[820,80],[960,55],[1100,75],[1280,50],[1400,85],
        [140,160],[420,140],[640,170],[900,145],[1160,155],[1360,170],
        [260,220],[580,200],[840,230],[1080,210],[1320,240],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5 + (i % 2)} fill="white" opacity={0.6 + (i % 3) * 0.12} />
      ))}

      {/* Moon */}
      <circle cx="1100" cy="110" r="52" fill="#FFF8DC" opacity="0.9" />
      <circle cx="1122" cy="95" r="48" fill="#BEB5DC" opacity="0.7" />

      {/* Far mountains */}
      <path d="M-50,580 L180,300 L380,500 L560,260 L750,460 L940,290 L1130,510 L1320,280 L1490,520 L1490,810 L-50,810 Z" fill="#C4B8E0" opacity="0.7" />

      {/* Mid mountains */}
      <path d="M-50,640 L100,420 L280,560 L460,350 L640,530 L800,380 L980,580 L1160,360 L1340,540 L1490,600 L1490,810 L-50,810 Z" fill="#A895CC" />

      {/* Near mountains */}
      <path d="M-50,720 L120,530 L280,650 L440,480 L600,620 L740,500 L900,660 L1060,490 L1220,640 L1380,510 L1490,680 L1490,810 L-50,810 Z" fill="#8B75B8" />

      {/* Pine tree line */}
      <g fill="#4A6741">
        {[0,60,120,180,240,300,360,420,480,540,600,660,720,780,840,900,960,1020,1080,1140,1200,1260,1320,1380].map((x, i) => {
          const h = 60 + (i % 4) * 14;
          return (
            <g key={x} transform={`translate(${x + 20}, 760)`}>
              <polygon points={`0,${-h} ${h * 0.4},0 ${-h * 0.4},0`} />
              <polygon points={`0,${-h * 0.6} ${h * 0.5},0 ${-h * 0.5},0`} fill="#3A5532" />
            </g>
          );
        })}
      </g>

      {/* Ground strip */}
      <rect x="-50" y="775" width="1540" height="50" fill="#3A5532" />
    </svg>
  );
}

export default function BackgroundSVG({ dificuldade }: { dificuldade: Dificuldade }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {dificuldade === "facil" && <Meadow />}
      {dificuldade === "medio" && <Ocean />}
      {dificuldade === "dificil" && <Mountains />}
    </div>
  );
}
