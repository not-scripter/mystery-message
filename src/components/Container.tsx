export default function Container({ children, className = "" }) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className={`px-4 py-4 max-w-md w-full ${className}`}>{children}</div>
    </div>
  );
}
