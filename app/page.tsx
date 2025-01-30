import ShoppingList from "@/app/components/ShoppingList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background">
      <ShoppingList />
    </main>
  );
}
