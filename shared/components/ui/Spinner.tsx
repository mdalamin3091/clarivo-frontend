import { Loader2 } from 'lucide-react';

interface Props {
  className?: string;
}

export function Spinner({ className }: Props) {
  return <Loader2 className={`animate-spin text-indigo-600 ${className ?? 'h-6 w-6'}`} />;
}
