import { Link, useParams } from "react-router-dom";
import {
  HiOutlineClock,
  HiOutlineArrowLeft,
  HiArrowRight,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import {
  getPostBySlug,
  getRelatedPosts,
  formatPostDate,
} from "../data/blogPosts.js";
import { buildWhatsAppLink } from "../config/siteConfig.js";

// Renders one content block. Keeping this as a switch (rather than a markdown
// dependency) means the article styling stays inside our design system and
// there's no third-party parser to keep patched.
const Block = ({ block }) => {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="font-display text-2xl sm:text-[28px] mt-12 mb-4 leading-snug">
          {block.text}
        </h2>
      );

    case "quote":
      return (
        <blockquote className="my-10 border-l-2 border-gold-2 pl-6 py-1">
          <p className="font-display italic text-xl sm:text-[23px] text-ink/80 leading-relaxed">
            {block.text}
          </p>
        </blockquote>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={`my-6 space-y-3 pl-1 ${
            block.ordered ? "list-decimal list-inside" : ""
          }`}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              className={`text-[15.5px] text-ink/70 leading-relaxed ${
                block.ordered ? "pl-2" : "flex gap-3"
              }`}
            >
              {!block.ordered && (
                <span className="text-gold-2 mt-[7px] shrink-0" aria-hidden="true">
                  ▪
                </span>
              )}
              <span>{item}</span>
            </li>
          ))}
        </Tag>
      );
    }

    default:
      return (
        <p className="text-[15.5px] sm:text-[16.5px] text-ink/70 leading-[1.8] mb-5">
          {block.text}
        </p>
      );
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="container-content py-24 text-center">
        <span className="eyebrow mb-3">The Journal</span>
        <h1 className="font-display text-3xl mb-3">Article Not Found</h1>
        <p className="text-ink/55 mb-8 max-w-sm mx-auto">
          This article may have been moved or renamed.
        </p>
        <Link to="/blog" className="btn btn-dark">Back to the Journal</Link>
      </div>
    );
  }

  const related = getRelatedPosts(post);

  return (
    <div className="bg-ivory">
      {/* Header */}
      <div className="bg-ink text-ivory pt-12 pb-14 sm:pt-16 sm:pb-20">
        <div className="container-content max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[11.5px] tracking-[0.14em] uppercase font-semibold text-cream/60 hover:text-gold-3 transition-colors mb-8"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            All Articles
          </Link>

          <span className="eyebrow mb-4">{post.category}</span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] leading-tight text-ivory mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px] text-cream/50">
            <span>{post.author}</span>
            <span className="text-cream/25">•</span>
            <span>{formatPostDate(post.date)}</span>
            <span className="text-cream/25">•</span>
            <span className="flex items-center gap-1.5">
              <HiOutlineClock className="w-4 h-4" />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      <div className="container-content max-w-4xl mx-auto -mt-8 sm:-mt-12 relative z-10">
        <div className="aspect-[16/9] overflow-hidden bg-cream border border-cream-dim">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <article className="container-content max-w-[720px] mx-auto py-12 sm:py-16">
        <p className="font-display text-lg sm:text-xl text-ink/75 leading-relaxed pb-8 mb-4 border-b border-cream-dim">
          {post.excerpt}
        </p>

        {post.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-cream-dim">
            <span className="text-[11px] tracking-[0.14em] uppercase text-ink/40 font-semibold mr-1">
              Tagged
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-cream border border-cream-dim text-[11.5px] text-ink/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Inline CTA */}
        <div className="mt-12 bg-cream border border-cream-dim p-7 sm:p-9">
          <h3 className="font-display text-xl sm:text-2xl mb-3">
            Questions about your hair type?
          </h3>
          <p className="text-[14px] text-ink/60 leading-relaxed mb-6">
            Every scalp is different. Send us a message and we'll tell you
            honestly whether our oil is the right fit — including when it isn't.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/shop" className="btn btn-dark">Shop the Oil</Link>
            <a
              href={buildWhatsAppLink(`Hi Well's Merry! I just read "${post.title}" and have a question.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline gap-2"
            >
              <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-cream-dim">
          <div className="container-content py-14 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
              <div>
                <span className="eyebrow mb-2">Keep Reading</span>
                <h2 className="font-display text-2xl sm:text-3xl">More From the Journal</h2>
              </div>
              <Link
                to="/blog"
                className="flex items-center gap-1.5 text-[12px] tracking-[0.12em] uppercase font-semibold text-gold-1 hover:text-ink transition-colors"
              >
                View All
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/blog/${item.slug}`}
                  className="group bg-white border border-cream-dim hover:border-gold-2/50 transition-colors duration-300 flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-cream">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-2.5 text-[11px] tracking-[0.12em] uppercase">
                      <span className="text-gold-1 font-semibold">{item.category}</span>
                      <span className="text-ink/25">•</span>
                      <span className="text-ink/45">{item.readTime} min</span>
                    </div>
                    <h3 className="font-display text-[19px] leading-snug mb-2.5 group-hover:text-gold-1 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-ink/55 leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
