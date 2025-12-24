import Container from "@/components/container";
import Header from "@/components/landing/header";
import Nav from "@/components/landing/nav";

export default function Page() {
  return (
    <>
      <Container
        maxWidth="5xl"
        className="min-h-screen border-l border-r border-gray-100"
      >
        <Nav />
        <Header />
      </Container>
    </>
  );
}
