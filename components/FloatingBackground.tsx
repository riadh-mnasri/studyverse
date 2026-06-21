interface Props {
  emojis: string[];
}

export default function FloatingBackground({ emojis }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {emojis.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-2xl select-none opacity-20"
          style={{
            left: `${(i * 11 + 5) % 95}%`,
            top: `${(i * 17 + 8) % 85}%`,
            animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}
