import Navbar from "@/_components/navbar";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface LayoutProps {
  categories: Category[];
  children: React.ReactNode;
}

export default function Layout({ categories, children }: LayoutProps) {
  return (
    <>
      <Navbar categories={categories} />
      <main className="p-4">{children}</main>
    </>
  );
}
