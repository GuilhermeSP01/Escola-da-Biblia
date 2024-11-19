interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Carregando...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
}
