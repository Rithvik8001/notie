import { Button } from "../ui/button";

export default function Header() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 mt-34 gap-4">
      <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-center">
        Notie
      </h1>
      <p className="text-xl text-center text-gray-400">
        Notie is an AI powered note taking app that helps you take notes faster
        and easier.
      </p>
      <Button variant="default">Get Started</Button>
    </div>
  );
}
