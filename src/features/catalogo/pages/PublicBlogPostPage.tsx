import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPostDetail {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  content: string[];
}

export function PublicBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const blogPostsDetails: Record<string, BlogPostDetail> = {
    "1": {
      id: "1",
      title: "El Arte del Layering de Perfumes",
      category: "Guías Olfativas",
      date: "Junio 20, 2026",
      readTime: "5 min lectura",
      author: "Sofia Vartorelli (Sommelier Perfumista)",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop",
      content: [
        "El 'layering' o arte de superponer fragancias es una técnica ancestral, originaria de Medio Oriente, que consiste en mezclar dos o más perfumes directamente sobre la piel para crear una estela completamente personalizada e inimitable.",
        "Para iniciarse en este arte, es fundamental comprender las familias olfativas. Se aconseja comenzar combinando fragancias sencillas antes de pasar a composiciones complejas. Una regla de oro es aplicar el aroma más denso o pesado (como maderas, oud o ámbar) en primer lugar, dejando que repose un momento, y luego pulverizar la fragancia más ligera (como cítricos o notas florales transparentes) encima.",
        "Otra técnica menos invasiva es aplicar un aroma en los puntos de pulso de las muñecas y otro diferente en el cuello o detrás de las orejas. Esto crea una atmósfera dinámica a medida que te mueves, permitiendo que las notas interactúen en el aire a tu alrededor en lugar de mezclarse directamente en tu piel.",
        "Experimenta sin miedo. Los contrastes suelen ser fascinantes: la frescura de una bergamota cítrica puede dar una luminosidad increíble a un fondo denso de pachulí o vainilla de Madagascar. Encuentra tu propia firma."
      ]
    },
    "2": {
      id: "2",
      title: "Historia del Oud: El Oro Líquido de Oriente",
      category: "Ingredientes de Lujo",
      date: "Junio 14, 2026",
      readTime: "7 min lectura",
      author: "Marcus Vance (Historiador Olfativo)",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
      content: [
        "El Oud es indiscutiblemente una de las materias primas más caras y codiciadas del planeta. Proviene de la madera de los árboles de Aquilaria, nativos del sudeste asiático, pero con una condición particular: el árbol debe estar infectado por un hongo específico llamado Phialophora parasitica.",
        "Como respuesta a la infección, el árbol produce una resina oscura, densa y extremadamente aromática para defenderse. Esta madera resinosa es la que se destila para obtener el aceite esencial de Oud, cuyo precio puede superar con creces el del oro por gramo.",
        "Su perfil aromático es inigualable: complejo, amaderado, animal, ahumado y ligeramente dulce. En la cultura árabe, ha sido utilizado durante siglos no solo como perfume personal sino también en forma de incienso ('bakhoor') para purificar y perfumar los hogares y templos.",
        "Hoy en día, las casas de alta perfumería occidentales han adoptado este ingrediente para conferir un carácter misterioso, opulento y duradero a sus creaciones más exclusivas, convirtiéndose en el símbolo máximo de la perfumería de nicho."
      ]
    },
    "3": {
      id: "3",
      title: "Tendencias Olfativas para el Verano 2026",
      category: "Tendencias",
      date: "Junio 05, 2026",
      readTime: "4 min lectura",
      author: "Elena Rostova (Trend Hunter)",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
      content: [
        "El verano de 2026 marca un cambio radical respecto a los clásicos cítricos efímeros. Esta temporada, la tendencia se enfoca en las texturas de 'segunda piel' y la frescura acuática mineral.",
        "Las fragancias veraniegas de este año incorporan notas inesperadas como sal marina pura, acordes de arena caliente, yodo y almizcles limpios y transparentes. La idea ya no es oler a fruta dulce, sino evocar la sensación de la piel salada tras un baño bajo el sol mediterráneo.",
        "Asimismo, las maderas ligeras como el cedro blanco y el bambú se combinan con notas florales etéreas (té blanco, jazmín de agua) para asegurar que la fragancia mantenga una excelente fijación incluso en los días más calurosos del año.",
        "Si buscas actualizar tu armario olfativo para los meses estivales, prioriza fragancias minimalistas que destaquen la transparencia y la frescura natural sobre la opulencia gourmand."
      ]
    }
  };

  const post = blogPostsDetails[id || ""] || blogPostsDetails["1"];

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Inter:wght@200;300;400;500;600;700&display=swap');
        .font-serif-elegant {
          font-family: 'Cormorant Garamond', serif;
        }
        .font-sans-clean {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Header */}
      <header className="w-full border-b border-black/10 sticky top-0 z-30 bg-[#fafafa]/90 backdrop-blur-md">
        <div className="max-w-[800px] mx-auto px-6 h-20 flex items-center justify-between">
          <Button 
            onPress={() => navigate("/")}
            variant="light"
            className="text-black font-sans-clean font-bold text-xs tracking-wider uppercase h-10 px-4 rounded-none hover:bg-black/5"
          >
            <ArrowLeft size={16} className="mr-2" /> Volver al Inicio
          </Button>
          <span 
            onClick={() => navigate("/")}
            className="text-xl font-serif-elegant tracking-[0.25em] uppercase font-bold cursor-pointer hover:opacity-75"
          >
            THEONE
          </span>
        </div>
      </header>

      {/* Article Content */}
      <main className="flex-1 max-w-[800px] mx-auto px-6 py-12 w-full">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Category */}
          <span className="text-[11px] font-sans-clean font-bold tracking-[0.25em] uppercase text-black/40">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif-elegant font-light tracking-tight text-black leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-black/50 font-sans-clean border-y border-black/5 py-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>Por {post.author}</span>
            </div>
          </div>

          {/* Image */}
          <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover grayscale contrast-[1.05]"
            />
          </div>

          {/* Body Content */}
          <div className="space-y-6 text-base md:text-lg font-serif-elegant font-light text-black/80 leading-relaxed pt-4">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.article>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black text-white/50 py-12 border-t border-white/10 font-sans-clean mt-16">
        <div className="max-w-[800px] mx-auto px-6 text-center text-xs space-y-4">
          <span className="text-white text-lg font-serif-elegant tracking-widest uppercase font-bold">THEONE CLUB</span>
          <p>© 2026 TheOne Club. Diario del Perfumista.</p>
        </div>
      </footer>
    </div>
  );
}
