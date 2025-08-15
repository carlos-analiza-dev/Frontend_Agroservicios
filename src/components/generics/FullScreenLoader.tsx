export const FullScreenLoader = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      role="status"
      aria-label="Cargando..."
    >
      <div className="h-12 w-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};
