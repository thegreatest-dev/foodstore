export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} FoodStuff. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
