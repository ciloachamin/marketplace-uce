import { Link, useParams } from 'react-router-dom';

const BlogPost = ({ posts }) => {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return <div>Post no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <article className="prose lg:prose-xl">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          Publicado el {post.date} • {post.category}
        </p>
        
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          className="mt-4"
        />
      </article>
      
      <div className="mt-12 border-t pt-6">
        <Link to="/blog" className="text-blue-600 hover:underline">
          ← Volver al blog
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;