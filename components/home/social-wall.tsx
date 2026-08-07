import Image from "next/image";
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from "@/components/ui/social-icons";
import { SectionHeading } from "@/components/ui/section-heading";

const posts = [
  { platform: "Instagram", icon: InstagramIcon, image: "https://picsum.photos/seed/social-1/400/400", caption: "Behind the scenes at tonight's episode shoot 🎬" },
  { platform: "Facebook", icon: FacebookIcon, image: "https://picsum.photos/seed/social-2/400/400", caption: "Who caught last night's season finale?" },
  { platform: "YouTube", icon: YoutubeIcon, image: "https://picsum.photos/seed/social-3/400/400", caption: "Full interview now streaming on our channel" },
  { platform: "TikTok", icon: TiktokIcon, image: "https://picsum.photos/seed/social-4/400/400", caption: "This clip broke the internet this week" },
];

export function SocialWall() {
  return (
    <section className="container-page py-16 lg:py-24">
      <SectionHeading eyebrow="Follow Along" title="Social Media Wall" description="Our latest posts from across the platforms." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {posts.map((post) => (
          <a key={post.caption} href="#" className="group relative aspect-square overflow-hidden rounded-2xl">
            <Image src={post.image} alt={post.caption} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width:768px) 45vw, 300px" />
            <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <post.icon className="h-5 w-5" />
              <p className="text-xs">{post.caption}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
