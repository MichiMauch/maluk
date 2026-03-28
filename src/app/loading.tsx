export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">
          Lädt...
        </p>
      </div>
    </div>
  );
}
