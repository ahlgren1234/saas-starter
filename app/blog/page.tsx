import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Blog - SaaS Starter",
  description: "Latest news, updates and articles about our platform",
};

export default function BlogPage() {
  const posts = [
    {
      title: "Introducing Our SaaS Starter Kit",
      description: "Learn about the features and benefits of our new SaaS starter kit for developers.",
      date: "March 15, 2024",
      author: "John Doe",
      category: "Product",
      readTime: "5 min read",
      image: "/blog/post-1.jpg",
    },
    {
      title: "Best Practices for SaaS Development",
      description: "Discover the best practices and patterns for building modern SaaS applications.",
      date: "March 10, 2024",
      author: "Jane Smith",
      category: "Development",
      readTime: "8 min read",
      image: "/blog/post-2.jpg",
    },
    {
      title: "Scaling Your SaaS Business",
      description: "Tips and strategies for scaling your SaaS business from zero to thousands of users.",
      date: "March 5, 2024",
      author: "Mike Johnson",
      category: "Business",
      readTime: "6 min read",
      image: "/blog/post-3.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ title: "Home", href: "/" }, { title: "Blog" }]} />
      
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Latest Updates
        </h1>
        <p className="text-xl text-muted-foreground">
          News, tips and insights about our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {posts.map((post) => (
          <article
            key={post.title}
            className="flex flex-col bg-card rounded-lg shadow-lg overflow-hidden border"
          >
            <div className="h-48 bg-muted relative">
              {/* Image placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="p-6 flex-1">
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <span>{post.category}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-muted-foreground mb-4">
                {post.description}
              </p>
              <div className="flex items-center text-sm text-muted-foreground mt-auto">
                <span>{post.author}</span>
                <span className="mx-2">•</span>
                <time>{post.date}</time>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 