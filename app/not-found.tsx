import Link from "next/link";
import { Nav } from "@/components/layout/Nav";

export default function NotFound() {
  return (
    <>
      <Nav home={false} />
      <main id="main" className="frame flex min-h-svh flex-col justify-end pt-[var(--nav-h)] pb-12">
        <p className="t-label text-gray">Error / 404</p>
        <h1 className="t-display mt-4 text-[30vw] lg:text-[22vw]">404</h1>
        <p className="mt-6 max-w-md text-lg">This page doesn&apos;t exist. The work does, though.</p>
        <Link href="/#work" className="btn btn-solid mt-8 self-start">
          See selected work <span className="arrow arrow-e">→</span>
        </Link>
      </main>
    </>
  );
}
