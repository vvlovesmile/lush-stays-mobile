export function Hero() {
  return (
    <section className="bg-white">
      <div className="relative aspect-[2/1] w-full overflow-hidden">
        <img
          src="https://res.cloudinary.com/dekilxb9g/image/upload/v1779768703/pexels-biren-negi-581272-36598794_yr2qv0.jpg"
          alt="清迈精品旅居"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(20,30,18,0.08)] to-[rgba(30,50,28,0.72)]" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 text-white">
          <h1 className="max-w-[280px] font-[var(--font-cormorant)] text-[28px] font-medium leading-[1.05] tracking-[-0.02em]">
            住进真正的清迈生活
          </h1>

          <p className="mt-3 max-w-[300px] font-[var(--font-jost)] text-[13px] font-light leading-6 text-[rgba(255,255,255,0.84)]">
            在东南亚的热闹与静谧之间，找寻属于你的旅居日常。
          </p>
        </div>
      </div>
    </section>
  );
}
