/** Abstract role mark for Strategos — deliberately not a face or a robot. */
export function StrategosMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <circle cx="20" cy="20" r="19" fill="#10213f" stroke="#8f82f5" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="5" fill="#8f82f5" />
      <circle cx="20" cy="8.5" r="2.2" fill="#b4bfd6" />
      <circle cx="30" cy="26" r="2.2" fill="#b4bfd6" />
      <circle cx="10" cy="26" r="2.2" fill="#b4bfd6" />
      <path d="M20 15V10.7M23.9 22.6l3.9 2.2M16.1 22.6l-3.9 2.2" stroke="#b4bfd6" strokeWidth="1.2" />
    </svg>
  );
}
