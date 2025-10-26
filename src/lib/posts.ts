export async function getPosts() {
  const res = await fetch("http://localhost:3000/posts.json", {
    cache: "no-store", // garante atualização imediata
  });
  return res.json();
}

export async function getPostById(id: number) {
  const res = await fetch("http://localhost:3000/posts.json", { cache: "no-store" });
  const posts = await res.json();
  return posts.find((post: any) => post.id === id);
}
