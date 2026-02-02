import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-tahoma text-5xl font-bold text-center mb-10">CCDI a UI Components Demo</h1>
      <Link href="/sidebar" className="text-blue-500 hover:text-blue-700 text-2xl">Sidebar</Link>
    </div>
  );
}
