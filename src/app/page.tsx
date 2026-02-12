import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-tahoma text-5xl font-bold text-center mb-10">CCDI UI Components Demo</h1>
      <div className="flex flex-col gap-4">
        <Link href="/sidebar" className="text-blue-500 hover:text-blue-700 text-2xl">
          Filter Sidebar Demo
        </Link>
        <Link href="/charts" className="text-blue-500 hover:text-blue-700 text-2xl">
          Charts Demo
        </Link>
        <Link href="/tabbed-table" className="text-blue-500 hover:text-blue-700 text-2xl">
          Tabbed Table Demo
        </Link>
        <Link href="/complete-demo" className="text-blue-500 hover:text-blue-700 text-2xl">
          Complete Demo
        </Link>
      </div>
    </div>
  );
}
