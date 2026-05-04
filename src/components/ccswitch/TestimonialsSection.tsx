import { Quote } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';
import { SectionHeader } from './SectionHeader';

const avatarStyles = [
  { avatar: '愚', avatarBg: 'bg-blue-500' },
  { avatar: '军', avatarBg: 'bg-purple-500' },
  { avatar: '荀', avatarBg: 'bg-green-500' },
  { avatar: '苟', avatarBg: 'bg-red-500' },
  { avatar: '菌', avatarBg: 'bg-orange-500' },
  { avatar: '白', avatarBg: 'bg-slate-500' },
  { avatar: '念', avatarBg: 'bg-cyan-500' },
  { avatar: 'M', avatarBg: 'bg-pink-500' },
];

function TestimonialCard({ testimonial, style }: {
  testimonial: { content: string; author: string; role: string };
  style: { avatar: string; avatarBg: string };
}) {
  return (
    <div className="flex h-[200px] w-full flex-shrink-0 flex-col rounded-2xl border border-border bg-card p-5 shadow-lg md:w-[360px]">
      {/* Quote Icon */}
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Quote className="w-4 h-4 text-primary" />
      </div>

      {/* Content - flex-grow 占用剩余空间 */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-grow">
        "{testimonial.content}"
      </p>

      {/* Author - 靠近底部 */}
      <div className="flex items-center gap-3 mt-auto pt-3">
        <div className={`w-9 h-9 rounded-full ${style.avatarBg} text-white flex items-center justify-center font-bold text-sm`}>
          {style.avatar}
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm">
            {testimonial.author}
          </div>
          <div className="text-xs text-muted-foreground">
            {testimonial.role}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollRow({ items, direction, offset = 0 }: {
  items: readonly { content: string; author: string; role: string }[];
  direction: 'left' | 'right';
  offset?: number;
}) {
  // 复制足够多的内容确保无缝
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items, ...items];
  const gap = 20; // 统一间距 20px

  return (
    <div
      className="flex w-full max-w-full overflow-hidden [contain:paint]"
      style={{ paddingLeft: offset }}
    >
      {/* 第一组 */}
      <div
        className={`flex shrink-0 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ gap: `${gap}px` }}
      >
        {duplicatedItems.map((testimonial, index) => (
          <TestimonialCard
            key={`a-${index}`}
            testimonial={testimonial}
            style={avatarStyles[index % avatarStyles.length]}
          />
        ))}
      </div>
      {/* 间隔 */}
      <div style={{ width: `${gap}px` }} className="shrink-0" />
      {/* 第二组 - 紧跟第一组实现无缝 */}
      <div
        className={`flex shrink-0 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ gap: `${gap}px` }}
      >
        {duplicatedItems.map((testimonial, index) => (
          <TestimonialCard
            key={`b-${index}`}
            testimonial={testimonial}
            style={avatarStyles[index % avatarStyles.length]}
          />
        ))}
      </div>
      <div style={{ width: `${gap}px` }} className="shrink-0" />
    </div>
  );
}

export function TestimonialsSection() {
  const { t } = useLanguage();
  const items = t.testimonials.items;

  return (
    <section className="section-y overflow-hidden overflow-x-clip bg-muted/30">
      <div className="container">
        <SectionHeader
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
          className="mb-10 md:mb-16"
        />
      </div>

      {/* Mobile Cards */}
      <div className="px-6 md:hidden">
        <div className="grid gap-4">
          {items.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard
              key={`mobile-${index}`}
              testimonial={testimonial}
              style={avatarStyles[index % avatarStyles.length]}
            />
          ))}
        </div>
      </div>

      {/* Scrolling Rows Container */}
      <div className="hidden space-y-6 md:block">
        {/* Top Row - 向左滚动 */}
        <ScrollRow items={items} direction="left" />

        {/* Bottom Row - 向右滚动，错开位置 */}
        <ScrollRow items={items} direction="right" offset={180} />
      </div>

      {/* CSS Keyframes for smooth infinite scroll */}
      <style>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 300s linear infinite;
          will-change: transform;
        }

        .animate-marquee-right {
          animation: marquee-right 330s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
