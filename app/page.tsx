import { Nav } from "@/components/layout/Nav";
import { Loader } from "@/components/layout/Loader";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Signals } from "@/components/about/Signals";
import { Work } from "@/components/projects/Work";
import { Archive } from "@/components/projects/Archive";
import { Experience } from "@/components/experience/Experience";
import { Skills } from "@/components/skills/Skills";
import { GithubSection } from "@/components/github/GithubSection";
import { Contact } from "@/components/contact/Contact";
import { getProjects } from "@/lib/projects";
import { profile } from "@/data/profile";

export const revalidate = 86400;

export default async function Home() {
  const { featured, archive, github } = await getProjects();

  return (
    <>
      <Loader />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Signals />
        <Work projects={featured} />
        <Archive projects={archive} githubUrl={profile.links.github} />
        <Experience />
        <Skills />
        <GithubSection github={github} featuredRepos={featured.map((p) => p.name)} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
