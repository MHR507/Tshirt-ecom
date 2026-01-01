import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const CategorySection = () => {
  const categories = [
    {
      name: 'Classic Collection',
      description: 'Timeless essentials for everyday wear',
      image: '/assets/white-compression-shirt.jpeg',
      href: '/shop?category=normal',
      count: '24 Styles',
    },
    {
      name: 'Designer Series',
      description: 'Limited editions by world-class artists',
      image: '/assets/sweat.jpeg',
      href: '/shop?category=designer',
      count: '12 Exclusives',
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">
            Collections
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-4">
            FIND YOUR FIT
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative overflow-hidden aspect-[4/3] bg-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-primary text-sm uppercase tracking-wider mb-2">
                  {category.count}
                </span>
                <h3 className="font-display text-4xl md:text-5xl text-foreground group-hover:text-primary transition-smooth">
                  {category.name}
                </h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  {category.description}
                </p>
                
                {/* Arrow */}
                <div className="absolute top-8 right-8 w-12 h-12 border border-foreground/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-smooth">
                  <ArrowUpRight className="w-5 h-5 text-foreground group-hover:text-primary-foreground transition-smooth" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
