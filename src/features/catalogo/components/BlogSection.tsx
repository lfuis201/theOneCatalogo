import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  readTime: string;
  image: string;
}

export function BlogSection() {
  const navigate = useNavigate();
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "El Arte del Layering de Perfumes",
      category: "Guías Olfativas",
      date: "Junio 20, 2026",
      excerpt: "Descubre cómo combinar múltiples fragancias para crear una firma olfativa única y sofisticada que te represente.",
      readTime: "5 min lectura",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "2",
      title: "Historia del Oud: El Oro Líquido de Oriente",
      category: "Ingredientes de Lujo",
      date: "Junio 14, 2026",
      excerpt: "Exploramos los orígenes del oud, una de las resinas más preciadas y exóticas en la perfumería fina contemporánea.",
      readTime: "7 min lectura",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "3",
      title: "Tendencias Olfativas para el Verano 2026",
      category: "Tendencias",
      date: "Junio 05, 2026",
      excerpt: "Desde notas cítricas marinas hasta maderas transparentes. Analizamos qué aromas marcarán la pauta esta temporada.",
      readTime: "4 min lectura",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <section id="blog" className="w-full max-w-[1200px] mx-auto px-6 py-20 border-b border-black/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-black/40">Diario del Perfumista</span>
          <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-black">Blog Olfativo</h2>
        </div>
        <p className="text-sm font-sans-clean font-light text-black/50 max-w-md">
          Artículos redactados por expertos perfumistas sobre notas exóticas, guías de estilo, y las últimas novedades de la industria internacional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => navigate(`/blog/${post.id}`)}
            className="group cursor-pointer flex flex-col bg-white border border-black/5 p-4 transition-all hover:shadow-xl hover:shadow-black/[0.02]"
          >
            <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100 mb-6">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:scale-105 transition-transform duration-700" 
              />
            </div>

            <div className="flex items-center justify-between text-[9px] font-sans-clean font-bold tracking-widest text-black/40 uppercase mb-3">
              <span>{post.category}</span>
              <span>{post.readTime}</span>
            </div>

            <h3 className="text-xl font-serif-elegant font-semibold text-black mb-3 group-hover:text-black/70 transition-colors">
              {post.title}
            </h3>

            <p className="text-sm font-serif-elegant font-light text-black/50 leading-relaxed flex-1 mb-4">
              {post.excerpt}
            </p>

            <span className="text-[10px] font-sans-clean font-light text-black/30 pt-4 border-t border-black/5">
              {post.date}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
