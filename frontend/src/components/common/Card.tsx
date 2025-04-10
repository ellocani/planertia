import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div>{children}</div>
    </div>
  );
}