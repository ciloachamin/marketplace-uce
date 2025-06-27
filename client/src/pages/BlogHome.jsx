import { Link } from 'react-router-dom';

const BlogHome = ({ posts }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Institucional</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(post => (
          <article key={post.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">
              <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500 mb-2">{post.date} • {post.category}</p>
            <p className="text-gray-700 mb-4">{post.excerpt}</p>
            <Link 
              to={`/blog/${post.slug}`} 
              className="text-blue-600 hover:underline"
            >
              Leer más →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogHome;