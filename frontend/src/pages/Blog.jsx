import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { HiOutlineClock, HiArrowRight } from "react-icons/hi2";
import {
  blogPosts,
  BLOG_CATEGORIES,
  formatPostDate,
} from "../data/blogPosts.js";

const PostCard = ({ post }) => (
  <article className="group flex flex-col bg-white border border-cream-dim hover:border-gold-2/50 transition-colors duration-300 rounded-sm overflow-hidden">
    <Link to={`/blog/${post.slug}`} className="block overflow-hidden aspect-[4/3] bg-cream">
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />
    </Link>

    <div className="flex flex-col flex-1 p-6">
      <div className="flex items-center gap-3 mb-3 text-[11px] tracking-[0.12em] uppercase">
        <span className="text-gold-1 font-semibold">{post.category}</span>
        <span className="text-ink/25">•</span>
        <span className="flex items-center gap-1 text-ink/45">
          <HiOutlineClock className="w-3.5 h-3.5" />
          {post.readTime} min read
        </span>
      </div>

      <h2 className="font-display text-[21px] leading-snug mb-3">
        <Link to={`/blog/${post.slug}`} className="hover:text-gold-1 transition-colors">
          {post.title}
        </Link>
      </h2>

      <p className="text-[13.5px] text-ink/55 leading-relaxed line-clamp-3 mb-5">
        {post.excerpt}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-cream-dim">
        <span className="text-[12px] text-ink/40">{formatPostDate(post.date)}</span>
        <Link
          to={`/blog/${post.slug}`}
          className="flex items-center gap-1.5 text-[12px] tracking-[0.1em] uppercase font-semibold text-ink hover:text-gold-1 transition-colors"
        >
          Read
          <HiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  </article>
);

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const sorted = useMemo(
    () => [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  );

  const lead = sorted[0];

  const filtered = useMemo(() => {
    const rest = sorted.slice(1);
    return activeCategory === "All"
      ? rest
      : rest.filter((p) => p.category === activeCategory);
  }, [sorted, activeCategory]);

  // When a filter is active, the lead article shouldn't visually claim to be
  // part of a category it doesn't belong to — so it only shows on "All".
  const showLead = activeCategory === "All";
  const visible = showLead
    ? filtered
    : sorted.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="bg-ink text-ivory py-16 sm:py-20 text-center">
        <span className="eyebrow mb-3">The Journal</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory">
          Hair Care, Honestly
        </h1>
        <p className="text-cream/60 max-w-xl mx-auto mt-4 px-6 leading-relaxed">
          Ingredient breakdowns, routines that hold up, and the reasoning
          behind what we make — written for people who read the back of the
          bottle.
        </p>
      </div>

      <div className="container-content py-14 sm:py-20">
        {/* Lead article.
            The image column used `md:aspect-auto md:h-full`, and `h-full`
            resolves against a grid row that has no height of its own — so on
            desktop the image box could collapse and the photo effectively
            disappeared. A min-height gives `object-cover` a real box to fill
            at every width. */}
        {showLead && lead && (
          <Link
            to={`/blog/${lead.slug}`}
            className="group grid md:grid-cols-2 gap-0 mb-14 border border-cream-dim bg-white hover:border-gold-2/50 transition-colors duration-300 rounded-sm overflow-hidden"
          >
            <div className="overflow-hidden aspect-[16/11] md:aspect-auto md:min-h-[340px] bg-cream">
              <img
                src={lead.image}
                alt={lead.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 text-[11px] tracking-[0.12em] uppercase">
                <span className="bg-gold-2 text-ink px-2.5 py-1 font-bold">Latest</span>
                <span className="text-gold-1 font-semibold">{lead.category}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] leading-tight mb-4 group-hover:text-gold-1 transition-colors">
                {lead.title}
              </h2>
              <p className="text-[14.5px] text-ink/60 leading-relaxed mb-6">
                {lead.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink/45">
                <span>{formatPostDate(lead.date)}</span>
                <span className="text-ink/25">•</span>
                <span className="flex items-center gap-1">
                  <HiOutlineClock className="w-3.5 h-3.5" />
                  {lead.readTime} min read
                </span>
                <span className="text-ink/25">•</span>
                <span>{lead.author}</span>
              </div>
              <span className="inline-flex items-center gap-2 mt-7 text-[12.5px] tracking-[0.14em] uppercase font-semibold text-ink group-hover:text-gold-1 transition-colors">
                Read Article
                <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )}

        {/* Category filter */}
        <div
          className="flex flex-wrap gap-2 sm:gap-3 mb-10 pb-8 border-b border-cream-dim"
          role="group"
          aria-label="Filter articles by category"
        >
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-4 py-2 text-[11.5px] tracking-[0.12em] uppercase font-semibold border transition-colors ${
                activeCategory === cat
                  ? "bg-ink text-ivory border-ink"
                  : "bg-transparent text-ink/60 border-cream-dim hover:border-gold-2 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink/55 mb-6">
              No articles in this category yet — more are on the way.
            </p>
            <button onClick={() => setActiveCategory("All")} className="btn btn-outline">
              View All Articles
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visible.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {/* Shop CTA */}
        <div className="mt-16 sm:mt-20 bg-espresso text-ivory p-10 sm:p-14 text-center">
          <span className="eyebrow mb-3">Put It Into Practice</span>
          <h3 className="font-display text-2xl sm:text-3xl text-ivory mb-4">
            The Oil Behind Every Article
          </h3>
          <p className="text-cream/60 max-w-lg mx-auto mb-8 text-[14.5px] leading-relaxed">
            Cold-pressed, chemical free, and formulated around the same
            principles we write about here.
          </p>
          <Link to="/shop" className="btn btn-gold">Shop the Collection</Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
